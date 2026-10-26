import React, { useState } from 'react';
import { Decision } from '../types/decision';
import { SAMPLE_DECISIONS } from '../data/templates';
import {
  X,
  Plus,
  Trash2,
  Sparkles,
  Loader2,
  HelpCircle,
  Lightbulb,
  ArrowRight,
} from 'lucide-react';

interface NewDecisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (decision: Decision) => void;
}

export const NewDecisionModal: React.FC<NewDecisionModalProps> = ({
  isOpen,
  onClose,
  onCreated,
}) => {
  const [title, setTitle] = useState('');
  const [context, setContext] = useState('');
  const [options, setOptions] = useState<string[]>([
    'Option 1: ',
    'Option 2: ',
  ]);
  const [customCriteria, setCustomCriteria] = useState('');
  const [tag, setTag] = useState('Career');

  // AI brainstorming state
  const [isBrainstorming, setIsBrainstorming] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddOption = () => {
    if (options.length >= 5) return;
    setOptions([...options, `Option ${options.length + 1}: `]);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length <= 2) return;
    setOptions(options.filter((_, idx) => idx !== index));
  };

  const handleOptionChange = (index: number, val: string) => {
    const updated = [...options];
    updated[index] = val;
    setOptions(updated);
  };

  const handleAIBrainstorm = async () => {
    if (!title.trim()) {
      setErrorMessage('Please enter a decision question or dilemma first.');
      return;
    }
    setErrorMessage(null);
    setIsBrainstorming(true);

    try {
      const res = await fetch('/api/suggest-options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dilemma: title }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to suggest options');

      const { refinedTitle, contextSummary, options: suggestedOpts, suggestedCriteria } = data.data;

      if (refinedTitle) setTitle(refinedTitle);
      if (contextSummary) setContext(contextSummary);
      if (suggestedOpts && suggestedOpts.length >= 2) setOptions(suggestedOpts);
      if (suggestedCriteria && suggestedCriteria.length > 0) {
        setCustomCriteria(suggestedCriteria.join(', '));
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Could not brainstorm options. Please enter them manually.');
    } finally {
      setIsBrainstorming(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanTitle = title.trim();
    const cleanOptions = options.map((o) => o.trim()).filter(Boolean);

    if (!cleanTitle) {
      setErrorMessage('Please provide a decision title or question.');
      return;
    }

    if (cleanOptions.length < 2) {
      setErrorMessage('Please specify at least 2 distinct options to compare.');
      return;
    }

    setIsSubmitting(true);
    setLoadingStep('Analyzing dilemmas and trade-offs...');

    try {
      const criteriaList = customCriteria
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean);

      // Visual progress stages
      setTimeout(() => setLoadingStep('Drafting weighted Pros & Cons...'), 1500);
      setTimeout(() => setLoadingStep('Synthesizing 4-quadrant SWOT matrix...'), 3500);
      setTimeout(() => setLoadingStep('Delivering The Tiebreaker ruling & cognitive bias audit...'), 5500);

      const res = await fetch('/api/analyze-decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: cleanTitle,
          context: context.trim(),
          options: cleanOptions,
          customCriteria: criteriaList,
        }),
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || 'Decision analysis failed');

      const raw = resData.data;

      // Transform backend response into typed Decision item
      const transformedOptions = raw.optionsAnalysis.map((oa: any, idx: number) => ({
        id: `opt-${Date.now()}-${idx}`,
        name: oa.optionName,
        summary: oa.summary,
        pros: (oa.pros || []).map((p: any, pIdx: number) => ({
          id: `p-${Date.now()}-${idx}-${pIdx}`,
          text: p.text,
          category: p.category || 'Other',
          impact: p.impact || 3,
          rationale: p.rationale,
        })),
        cons: (oa.cons || []).map((c: any, cIdx: number) => ({
          id: `c-${Date.now()}-${idx}-${cIdx}`,
          text: c.text,
          category: c.category || 'Other',
          impact: c.impact || 3,
          rationale: c.rationale,
        })),
        swot: {
          strengths: oa.swot?.strengths || [],
          weaknesses: oa.swot?.weaknesses || [],
          opportunities: oa.swot?.opportunities || [],
          threats: oa.swot?.threats || [],
        },
        keyAssumptions: oa.keyAssumptions || [],
      }));

      const transformedCriteria = (raw.criteria || []).map((cr: any, cIdx: number) => ({
        id: `crit-${Date.now()}-${cIdx}`,
        name: cr.name,
        description: cr.description,
        weight: cr.defaultWeight || 7,
        scores: (cr.scores || []).map((sc: any) => ({
          optionName: sc.optionName,
          score: sc.score,
          rationale: sc.rationale,
        })),
      }));

      const newDecision: Decision = {
        id: `decision-${Date.now()}`,
        title: cleanTitle,
        context: context.trim() || 'No explicit context specified.',
        tag: tag || 'General',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        options: transformedOptions,
        criteria: transformedCriteria,
        ruling: raw.ruling,
      };

      onCreated(newDecision);
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Error running decision analysis. Please try again.');
    } finally {
      setIsSubmitting(false);
      setLoadingStep('');
    }
  };

  const loadSample = (sample: Decision) => {
    onCreated(sample);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl border border-slate-200 max-w-2xl w-full shadow-2xl my-8 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Create New Decision Analysis
            </h2>
            <p className="text-xs text-slate-500">
              Provide your dilemma and let The Tiebreaker construct a multi-layered evaluation.
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-md text-xs text-rose-800">
              {errorMessage}
            </div>
          )}

          {/* Quick Sample Prompts */}
          <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-lg">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-2">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>Or explore an immediate real-world case study:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_DECISIONS.map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => loadSample(sample)}
                  className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded transition-colors whitespace-nowrap shrink-0"
                >
                  {sample.title.split(' vs ')[0]}...
                </button>
              ))}
            </div>
          </div>

          {/* Decision Title */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                What is the decision to make? *
              </label>
              <button
                type="button"
                onClick={handleAIBrainstorm}
                disabled={isBrainstorming || !title.trim()}
                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 disabled:opacity-40"
              >
                {isBrainstorming ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Sparkles className="w-3 h-3" />
                )}
                <span>AI Auto-Formulate Options</span>
              </button>
            </div>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Relocate to Chicago for new job vs Stay in Austin"
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900"
            />
          </div>

          {/* Options */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                Options Under Consideration (Min 2) *
              </label>
              {options.length < 5 && (
                <button
                  type="button"
                  onClick={handleAddOption}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-900"
                >
                  <Plus className="w-3 h-3" /> Add Alternative
                </button>
              )}
            </div>
            <div className="space-y-2">
              {options.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-400 w-6 text-right">
                    0{idx + 1}.
                  </span>
                  <input
                    type="text"
                    required
                    value={opt}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                    placeholder={`e.g. Option ${idx + 1}`}
                    className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                  />
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(idx)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Context & Background */}
          <div>
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
              Personal Context, Values & Constraints (Optional)
            </label>
            <textarea
              rows={3}
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="e.g. I value work-life balance and family time; I have 6 months of savings; timeline is 30 days to decide..."
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900"
            />
          </div>

          {/* Criteria & Tag */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                Custom Criteria (Comma separated)
              </label>
              <input
                type="text"
                value={customCriteria}
                onChange={(e) => setCustomCriteria(e.target.value)}
                placeholder="e.g. Cash Comp, Stress, Upside, Location"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                Category Tag
              </label>
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900"
              >
                <option value="Career">Career & Professional</option>
                <option value="Finance">Personal Finance & Wealth</option>
                <option value="Real Estate">Real Estate & Living</option>
                <option value="Business">Business & Strategy</option>
                <option value="Relationships">Life & Relationships</option>
                <option value="Health">Health & Lifestyle</option>
              </select>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              {isSubmitting ? (
                <span className="flex items-center gap-2 text-indigo-600 font-medium">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{loadingStep}</span>
                </span>
              ) : (
                <span>Includes Pros & Cons, MCDA Matrix, and SWOT Analysis.</span>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 rounded-md shadow-xs transition-colors inline-flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <span>Generate Analysis</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
