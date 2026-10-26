import React, { useState } from 'react';
import { Decision, FactorCategory, ProConItem } from '../../types/decision';
import {
  Plus,
  Trash2,
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  SlidersHorizontal,
  ChevronDown,
  Loader2,
} from 'lucide-react';

interface ProsConsViewProps {
  decision: Decision;
  onUpdateDecision: (updated: Decision) => void;
}

const CATEGORIES: FactorCategory[] = [
  'Financial',
  'Career',
  'Emotional / Well-being',
  'Effort & Time',
  'Risk & Uncertainty',
  'Other',
];

export const ProsConsView: React.FC<ProsConsViewProps> = ({
  decision,
  onUpdateDecision,
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string>(
    decision.options[0]?.id || ''
  );
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('All');
  const [isAddingItem, setIsAddingItem] = useState<{
    type: 'pro' | 'con';
  } | null>(null);
  const [newText, setNewText] = useState('');
  const [newRationale, setNewRationale] = useState('');
  const [newCategory, setNewCategory] = useState<FactorCategory>('Career');
  const [newImpact, setNewImpact] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [isBrainstorming, setIsBrainstorming] = useState(false);
  const [brainstormMessage, setBrainstormMessage] = useState<string | null>(null);

  const currentOption =
    decision.options.find((o) => o.id === selectedOptionId) ||
    decision.options[0];

  if (!currentOption) {
    return <div className="p-8 text-center text-slate-500">No options found.</div>;
  }

  // Calculate weighted impact totals
  const totalProsScore = currentOption.pros.reduce((sum, p) => sum + p.impact, 0);
  const totalConsScore = currentOption.cons.reduce((sum, c) => sum + c.impact, 0);
  const netBalance = totalProsScore - totalConsScore;

  // Filter items
  const filteredPros = currentOption.pros.filter(
    (p) => activeCategoryFilter === 'All' || p.category === activeCategoryFilter
  );
  const filteredCons = currentOption.cons.filter(
    (c) => activeCategoryFilter === 'All' || c.category === activeCategoryFilter
  );

  const handleAddItem = (type: 'pro' | 'con') => {
    if (!newText.trim()) return;

    const newItem: ProConItem = {
      id: `custom-${Date.now()}`,
      text: newText.trim(),
      category: newCategory,
      impact: newImpact,
      rationale: newRationale.trim() || 'Custom factor added by user.',
      isUserAdded: true,
    };

    const updatedOptions = decision.options.map((opt) => {
      if (opt.id !== currentOption.id) return opt;
      return {
        ...opt,
        pros: type === 'pro' ? [...opt.pros, newItem] : opt.pros,
        cons: type === 'con' ? [...opt.cons, newItem] : opt.cons,
      };
    });

    onUpdateDecision({
      ...decision,
      options: updatedOptions,
      updatedAt: new Date().toISOString(),
    });

    setNewText('');
    setNewRationale('');
    setIsAddingItem(null);
  };

  const handleDeleteItem = (itemId: string, type: 'pro' | 'con') => {
    const updatedOptions = decision.options.map((opt) => {
      if (opt.id !== currentOption.id) return opt;
      return {
        ...opt,
        pros: type === 'pro' ? opt.pros.filter((p) => p.id !== itemId) : opt.pros,
        cons: type === 'con' ? opt.cons.filter((c) => c.id !== itemId) : opt.cons,
      };
    });

    onUpdateDecision({
      ...decision,
      options: updatedOptions,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleBrainstormHiddenFactors = async () => {
    setIsBrainstorming(true);
    setBrainstormMessage(null);
    try {
      const existing = [
        ...currentOption.pros.map((p) => `Pro: ${p.text}`),
        ...currentOption.cons.map((c) => `Con: ${c.text}`),
      ];

      const res = await fetch('/api/brainstorm-factors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: decision.title,
          optionName: currentOption.name,
          existingFactors: existing,
        }),
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || 'Failed to brainstorm');

      const { hiddenPros, hiddenCons } = resData.data;

      const formattedPros: ProConItem[] = (hiddenPros || []).map(
        (p: any, idx: number) => ({
          id: `ai-brainstorm-p-${Date.now()}-${idx}`,
          text: p.text,
          category: (CATEGORIES.includes(p.category)
            ? p.category
            : 'Other') as FactorCategory,
          impact: (Math.min(Math.max(p.impact || 3, 1), 5)) as any,
          rationale: p.rationale,
          isUserAdded: true,
        })
      );

      const formattedCons: ProConItem[] = (hiddenCons || []).map(
        (c: any, idx: number) => ({
          id: `ai-brainstorm-c-${Date.now()}-${idx}`,
          text: c.text,
          category: (CATEGORIES.includes(c.category)
            ? c.category
            : 'Other') as FactorCategory,
          impact: (Math.min(Math.max(c.impact || 3, 1), 5)) as any,
          rationale: c.rationale,
          isUserAdded: true,
        })
      );

      const updatedOptions = decision.options.map((opt) => {
        if (opt.id !== currentOption.id) return opt;
        return {
          ...opt,
          pros: [...opt.pros, ...formattedPros],
          cons: [...opt.cons, ...formattedCons],
        };
      });

      onUpdateDecision({
        ...decision,
        options: updatedOptions,
        updatedAt: new Date().toISOString(),
      });

      setBrainstormMessage(`Added ${formattedPros.length} hidden pros and ${formattedCons.length} hidden risks to this option.`);
    } catch (err: any) {
      console.error(err);
      setBrainstormMessage('Could not retrieve new factors. Try again.');
    } finally {
      setIsBrainstorming(false);
    }
  };

  const getImpactDescription = (impact: number, type: 'pro' | 'con') => {
    if (type === 'pro') {
      switch (impact) {
        case 5: return 'Transformative Upside';
        case 4: return 'High Upside';
        case 3: return 'Moderate Benefit';
        case 2: return 'Minor Perk';
        default: return 'Marginal Advantage';
      }
    } else {
      switch (impact) {
        case 5: return 'Critical Risk / Dealbreaker';
        case 4: return 'Severe Drag';
        case 3: return 'Moderate Friction';
        case 2: return 'Mild Nuisance';
        default: return 'Negligible Concern';
      }
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Option Selector Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="text-xs text-slate-500 font-medium">Active Option Evaluation</div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              {currentOption.name}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleBrainstormHiddenFactors}
              disabled={isBrainstorming}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-60 rounded-md transition-colors whitespace-nowrap shrink-0"
            >
              {isBrainstorming ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Uncovering Blind Spots...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Uncover Hidden Factors (AI)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {brainstormMessage && (
          <div className="mt-3 p-3 bg-indigo-50 border border-indigo-100 rounded text-xs text-indigo-900 flex items-center justify-between">
            <span>{brainstormMessage}</span>
            <button
              onClick={() => setBrainstormMessage(null)}
              className="text-indigo-600 hover:text-indigo-950 font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Options Switcher Bar */}
        <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {decision.options.map((opt) => {
            const isSelected = opt.id === currentOption.id;
            return (
              <button
                key={opt.id}
                onClick={() => setSelectedOptionId(opt.id)}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 border ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {opt.name}
              </button>
            );
          })}
        </div>

        <p className="mt-3 text-sm text-slate-600">
          {currentOption.summary}
        </p>

        {/* Weighted Impact Gauge */}
        <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="flex items-center justify-between p-3 bg-emerald-50/70 border border-emerald-100 rounded-lg">
            <div className="text-xs text-emerald-800 font-medium">Total Pros Weight</div>
            <div className="text-lg font-bold font-mono tabular-nums text-emerald-700">
              +{totalProsScore} pts
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-rose-50/70 border border-rose-100 rounded-lg">
            <div className="text-xs text-rose-800 font-medium">Total Cons Drag</div>
            <div className="text-lg font-bold font-mono tabular-nums text-rose-700">
              -{totalConsScore} pts
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-100 border border-slate-200 rounded-lg">
            <div className="text-xs text-slate-700 font-medium">Net Momentum Score</div>
            <div
              className={`text-lg font-bold font-mono tabular-nums ${
                netBalance > 0
                  ? 'text-emerald-700'
                  : netBalance < 0
                  ? 'text-rose-700'
                  : 'text-slate-700'
              }`}
            >
              {netBalance > 0 ? `+${netBalance}` : netBalance}
            </div>
          </div>
        </div>

        {/* Category Filter Controls */}
        <div className="mt-5 flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-slate-500 mr-2 flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3" /> Filter by:
          </span>
          {['All', ...CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategoryFilter(cat)}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
                activeCategoryFilter === cat
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Side-by-side Pros and Cons columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* PROS COLUMN */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 md:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-bold text-slate-900">
                Advantages & Upsides
              </h3>
              <span className="text-xs font-mono tabular-nums text-slate-400">
                ({filteredPros.length})
              </span>
            </div>
            <button
              onClick={() => setIsAddingItem({ type: 'pro' })}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded transition-colors"
            >
              <Plus className="w-3 h-3" /> Add Pro
            </button>
          </div>

          {filteredPros.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No advantages found for the selected filter.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPros.map((pro) => (
                <div
                  key={pro.id}
                  className="p-4 rounded-lg border border-slate-200/80 bg-slate-50/40 hover:bg-white hover:border-slate-300 transition-all space-y-2 group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-sm font-semibold text-slate-900 leading-snug">
                      {pro.text}
                    </div>
                    <button
                      onClick={() => handleDeleteItem(pro.id, 'pro')}
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 p-1 transition-opacity shrink-0"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {pro.rationale}
                  </p>

                  {/* Clean unboxed metadata line per anti-slop guidelines */}
                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-700">{pro.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{getImpactDescription(pro.impact, 'pro')}</span>
                    </div>

                    <div className="flex items-center gap-1 font-mono tabular-nums font-semibold text-emerald-700">
                      <span>Impact:</span>
                      <span className="text-sm">+{pro.impact}</span>
                      <span className="text-slate-400 font-normal">/5</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CONS COLUMN */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 md:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-rose-600" />
              <h3 className="text-base font-bold text-slate-900">
                Hazards, Costs & Risks
              </h3>
              <span className="text-xs font-mono tabular-nums text-slate-400">
                ({filteredCons.length})
              </span>
            </div>
            <button
              onClick={() => setIsAddingItem({ type: 'con' })}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded transition-colors"
            >
              <Plus className="w-3 h-3" /> Add Con
            </button>
          </div>

          {filteredCons.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No hazards found for the selected filter.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredCons.map((con) => (
                <div
                  key={con.id}
                  className="p-4 rounded-lg border border-slate-200/80 bg-slate-50/40 hover:bg-white hover:border-slate-300 transition-all space-y-2 group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-sm font-semibold text-slate-900 leading-snug">
                      {con.text}
                    </div>
                    <button
                      onClick={() => handleDeleteItem(con.id, 'con')}
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 p-1 transition-opacity shrink-0"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {con.rationale}
                  </p>

                  {/* Clean unboxed metadata line per anti-slop guidelines */}
                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-700">{con.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{getImpactDescription(con.impact, 'con')}</span>
                    </div>

                    <div className="flex items-center gap-1 font-mono tabular-nums font-semibold text-rose-700">
                      <span>Severity:</span>
                      <span className="text-sm">-{con.impact}</span>
                      <span className="text-slate-400 font-normal">/5</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Custom Item Modal / Inline Box */}
      {isAddingItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-lg w-full shadow-lg space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              {isAddingItem.type === 'pro'
                ? 'Add an Advantage (Pro)'
                : 'Add a Hazard or Cost (Con)'}
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Point Title
                </label>
                <input
                  type="text"
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder="e.g. Higher commute time of 45 mins"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Deep Rationale / Why it matters
                </label>
                <textarea
                  rows={2}
                  value={newRationale}
                  onChange={(e) => setNewRationale(e.target.value)}
                  placeholder="Explain why this factor significantly influences your life..."
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as FactorCategory)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Impact Weight (1 to 5)
                  </label>
                  <select
                    value={newImpact}
                    onChange={(e) => setNewImpact(Number(e.target.value) as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900 font-mono"
                  >
                    <option value={1}>1 - Marginal</option>
                    <option value={2}>2 - Minor</option>
                    <option value={3}>3 - Moderate</option>
                    <option value={4}>4 - High</option>
                    <option value={5}>5 - Critical / Transformative</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAddingItem(null)}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleAddItem(isAddingItem.type)}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors"
              >
                Save {isAddingItem.type === 'pro' ? 'Pro' : 'Con'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
