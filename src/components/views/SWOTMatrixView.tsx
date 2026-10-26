import React, { useState } from 'react';
import { Decision } from '../../types/decision';
import {
  ShieldCheck,
  AlertCircle,
  TrendingUp,
  AlertOctagon,
  Key,
  Layers,
  Sparkles,
} from 'lucide-react';

interface SWOTMatrixViewProps {
  decision: Decision;
}

export const SWOTMatrixView: React.FC<SWOTMatrixViewProps> = ({ decision }) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string>(
    decision.options[0]?.id || ''
  );
  const [isCompareMode, setIsCompareMode] = useState<boolean>(false);

  const currentOption =
    decision.options.find((o) => o.id === selectedOptionId) ||
    decision.options[0];

  if (!currentOption) {
    return <div className="p-8 text-center text-slate-500">No option data available.</div>;
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header and Option Selector */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              <Layers className="w-4 h-4 text-indigo-500" />
              <span>Strategic Environmental Scan</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              SWOT Analysis Matrix
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Evaluate internal capabilities against external market forces for each strategic option:
            </p>
          </div>

          <div className="flex items-center gap-2 self-start shrink-0">
            <button
              onClick={() => setIsCompareMode(!isCompareMode)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md border transition-colors whitespace-nowrap shrink-0 ${
                isCompareMode
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
            >
              {isCompareMode ? 'Single Option Focus' : 'Side-by-Side Compare'}
            </button>
          </div>
        </div>

        {/* Option Selection Tabs */}
        {!isCompareMode && (
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
        )}
      </section>

      {/* SWOT Content */}
      {isCompareMode ? (
        /* Side by Side Comparison Grid */
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {decision.options.map((opt) => (
            <div key={opt.id} className="space-y-4">
              <div className="bg-slate-900 text-white p-4 rounded-lg flex items-center justify-between">
                <span className="font-bold text-sm truncate">{opt.name}</span>
                <span className="text-xs text-indigo-300 font-medium">SWOT Scan</span>
              </div>
              <SingleOptionSWOT option={opt} />
            </div>
          ))}
        </div>
      ) : (
        /* Single Option 4-Quadrant Matrix */
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 shadow-xs">
            <div className="mb-6">
              <div className="text-xs font-semibold text-indigo-600 mb-1">
                Deep Dive:
              </div>
              <h3 className="text-xl font-bold text-slate-900">{currentOption.name}</h3>
              <p className="text-sm text-slate-600 mt-1">{currentOption.summary}</p>
            </div>

            <SingleOptionSWOT option={currentOption} />
          </div>

          {/* Key Hidden Assumptions Section */}
          <div className="bg-slate-900 text-white rounded-xl p-6 md:p-8 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2">
              <Key className="w-4 h-4 text-indigo-400" />
              <span>Underlying Hypotheses & Fragility Check</span>
            </div>
            <h4 className="text-lg font-bold text-white mb-2">
              Key Assumptions Required for this Option to Succeed
            </h4>
            <p className="text-sm text-slate-300 mb-6">
              If any of these foundational assumptions prove invalid, the viability of "{currentOption.name}" breaks down:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentOption.keyAssumptions.map((assumption, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg bg-slate-800/80 border border-slate-700 text-xs sm:text-sm text-slate-200 leading-relaxed flex items-start gap-3"
                >
                  <span className="font-mono text-indigo-400 font-bold shrink-0">
                    0{idx + 1}.
                  </span>
                  <span>{assumption}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface SingleOptionSWOTProps {
  option: {
    swot: {
      strengths: string[];
      weaknesses: string[];
      opportunities: string[];
      threats: string[];
    };
  };
}

const SingleOptionSWOT: React.FC<SingleOptionSWOTProps> = ({ option }) => {
  const { strengths, weaknesses, opportunities, threats } = option.swot;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Strengths */}
      <div className="p-5 rounded-lg border border-emerald-200 bg-emerald-50/30 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-emerald-200/60">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <h4 className="text-sm font-bold text-emerald-950 uppercase tracking-wider">
              Strengths (Internal)
            </h4>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-700">
            {strengths.length}
          </span>
        </div>
        <ul className="space-y-2">
          {strengths.map((s, idx) => (
            <li
              key={idx}
              className="text-xs sm:text-sm text-emerald-900 leading-relaxed flex items-start gap-2"
            >
              <span className="text-emerald-500 font-bold mt-0.5">•</span>
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Weaknesses */}
      <div className="p-5 rounded-lg border border-amber-200 bg-amber-50/30 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-amber-200/60">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-700" />
            <h4 className="text-sm font-bold text-amber-950 uppercase tracking-wider">
              Weaknesses (Internal)
            </h4>
          </div>
          <span className="text-xs font-mono font-bold text-amber-700">
            {weaknesses.length}
          </span>
        </div>
        <ul className="space-y-2">
          {weaknesses.map((w, idx) => (
            <li
              key={idx}
              className="text-xs sm:text-sm text-amber-900 leading-relaxed flex items-start gap-2"
            >
              <span className="text-amber-500 font-bold mt-0.5">•</span>
              <span>{w}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Opportunities */}
      <div className="p-5 rounded-lg border border-sky-200 bg-sky-50/30 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-sky-200/60">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-sky-700" />
            <h4 className="text-sm font-bold text-sky-950 uppercase tracking-wider">
              Opportunities (External)
            </h4>
          </div>
          <span className="text-xs font-mono font-bold text-sky-700">
            {opportunities.length}
          </span>
        </div>
        <ul className="space-y-2">
          {opportunities.map((o, idx) => (
            <li
              key={idx}
              className="text-xs sm:text-sm text-sky-900 leading-relaxed flex items-start gap-2"
            >
              <span className="text-sky-500 font-bold mt-0.5">•</span>
              <span>{o}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Threats */}
      <div className="p-5 rounded-lg border border-rose-200 bg-rose-50/30 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-rose-200/60">
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-rose-700" />
            <h4 className="text-sm font-bold text-rose-950 uppercase tracking-wider">
              Threats (External)
            </h4>
          </div>
          <span className="text-xs font-mono font-bold text-rose-700">
            {threats.length}
          </span>
        </div>
        <ul className="space-y-2">
          {threats.map((t, idx) => (
            <li
              key={idx}
              className="text-xs sm:text-sm text-rose-900 leading-relaxed flex items-start gap-2"
            >
              <span className="text-rose-500 font-bold mt-0.5">•</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
