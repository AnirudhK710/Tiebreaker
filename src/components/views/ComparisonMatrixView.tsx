import React, { useState } from 'react';
import { Decision, ComparisonCriterion } from '../../types/decision';
import { Sliders, RotateCcw, Plus, Info, Award, Check } from 'lucide-react';

interface ComparisonMatrixViewProps {
  decision: Decision;
  onUpdateDecision: (updated: Decision) => void;
}

export const ComparisonMatrixView: React.FC<ComparisonMatrixViewProps> = ({
  decision,
  onUpdateDecision,
}) => {
  const [selectedCell, setSelectedCell] = useState<{
    criterionName: string;
    optionName: string;
    score: number;
    rationale: string;
  } | null>(null);

  const [isAddingCriterion, setIsAddingCriterion] = useState(false);
  const [newCritName, setNewCritName] = useState('');
  const [newCritDesc, setNewCritDesc] = useState('');
  const [newCritWeight, setNewCritWeight] = useState(7);
  const [newCritScores, setNewCritScores] = useState<Record<string, number>>({});

  // Compute total weights and weighted composite scores for each option
  const totalWeight = decision.criteria.reduce((sum, c) => sum + c.weight, 0);

  const optionCompositeScores = decision.options.map((opt) => {
    let weightedSum = 0;
    decision.criteria.forEach((crit) => {
      const match = crit.scores.find((s) => s.optionName === opt.name);
      const score = match ? match.score : 5;
      weightedSum += score * crit.weight;
    });

    // Normalized to 100
    const normalizedScore = totalWeight > 0 ? (weightedSum / (totalWeight * 10)) * 100 : 0;
    return {
      optionId: opt.id,
      optionName: opt.name,
      score: Math.round(normalizedScore * 10) / 10,
    };
  });

  // Sort leading option
  const leadingOption = [...optionCompositeScores].sort((a, b) => b.score - a.score)[0];

  const handleWeightChange = (criterionId: string, newWeight: number) => {
    const updatedCriteria = decision.criteria.map((c) => {
      if (c.id === criterionId) {
        return { ...c, weight: newWeight };
      }
      return c;
    });

    onUpdateDecision({
      ...decision,
      criteria: updatedCriteria,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleResetWeights = () => {
    // Reset all weights to 7
    const reset = decision.criteria.map((c) => ({ ...c, weight: 7 }));
    onUpdateDecision({
      ...decision,
      criteria: reset,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleAddCriterionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCritName.trim()) return;

    const newCriterion: ComparisonCriterion = {
      id: `crit-custom-${Date.now()}`,
      name: newCritName.trim(),
      description: newCritDesc.trim() || 'Custom evaluation factor.',
      weight: newCritWeight,
      scores: decision.options.map((opt) => ({
        optionName: opt.name,
        score: newCritScores[opt.name] ?? 6,
        rationale: 'User-specified rating.',
      })),
    };

    onUpdateDecision({
      ...decision,
      criteria: [...decision.criteria, newCriterion],
      updatedAt: new Date().toISOString(),
    });

    setNewCritName('');
    setNewCritDesc('');
    setIsAddingCriterion(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner: Real-time MCDA Leaderboard */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              <Sliders className="w-4 h-4 text-indigo-500" />
              <span>Multi-Criteria Decision Analysis (MCDA)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Weighted Comparison Matrix
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Adjust the weight sliders to reflect what you value most. The composite scores re-balance live:
            </p>
          </div>

          <div className="flex items-center gap-2 self-start shrink-0">
            <button
              onClick={handleResetWeights}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
              title="Reset weights to equal"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Equalize Weights</span>
            </button>
            <button
              onClick={() => setIsAddingCriterion(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Criterion</span>
            </button>
          </div>
        </div>

        {/* Live Leaderboard Composite Score Cards */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {optionCompositeScores.map((item) => {
            const isLeader = item.optionName === leadingOption?.optionName;
            return (
              <div
                key={item.optionId}
                className={`p-5 rounded-lg border transition-all ${
                  isLeader
                    ? 'border-indigo-500 bg-indigo-50/40 ring-1 ring-indigo-500/20'
                    : 'border-slate-200 bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-slate-500">
                    {isLeader ? 'CURRENT LEADER' : 'ALTERNATIVE'}
                  </span>
                  {isLeader && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600">
                      <Award className="w-3.5 h-3.5" /> Leading Option
                    </span>
                  )}
                </div>

                <div className="text-sm font-bold text-slate-900 truncate mb-3" title={item.optionName}>
                  {item.optionName}
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="text-slate-600 font-medium">Weighted Score</span>
                    <span className="font-mono tabular-nums text-lg font-bold text-slate-900">
                      {item.score} <span className="text-xs font-normal text-slate-400">/ 100</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isLeader ? 'bg-indigo-600' : 'bg-slate-500'
                      }`}
                      style={{ width: `${Math.min(item.score, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* The Matrix Table */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-600">
                <th className="py-4 px-6 min-w-[280px]">Evaluation Criterion</th>
                <th className="py-4 px-4 min-w-[170px]">Personal Weight</th>
                {decision.options.map((opt) => (
                  <th key={opt.id} className="py-4 px-6 min-w-[220px]">
                    <div className="font-bold text-slate-900">{opt.name}</div>
                    <div className="text-xs font-normal text-slate-500 truncate max-w-[220px]">
                      {opt.summary}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {decision.criteria.map((crit) => (
                <tr key={crit.id} className="hover:bg-slate-50/50 transition-colors">
                  {/* Criterion details */}
                  <td className="py-4 px-6 align-top">
                    <div className="font-semibold text-slate-900">{crit.name}</div>
                    <div className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {crit.description}
                    </div>
                  </td>

                  {/* Weight Slider */}
                  <td className="py-4 px-4 align-top">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-mono tabular-nums">
                        <span className="text-slate-500">Weight:</span>
                        <span className="font-bold text-indigo-600">{crit.weight}/10</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={crit.weight}
                        onChange={(e) =>
                          handleWeightChange(crit.id, Number(e.target.value))
                        }
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                      />
                    </div>
                  </td>

                  {/* Option Scores */}
                  {decision.options.map((opt) => {
                    const scoreObj = crit.scores.find(
                      (s) => s.optionName === opt.name
                    );
                    const score = scoreObj?.score ?? 5;
                    const rationale = scoreObj?.rationale ?? 'No rationale available.';

                    return (
                      <td
                        key={opt.id}
                        className="py-4 px-6 align-top cursor-pointer group"
                        onClick={() =>
                          setSelectedCell({
                            criterionName: crit.name,
                            optionName: opt.name,
                            score,
                            rationale,
                          })
                        }
                      >
                        <div className="p-3 rounded-lg border border-transparent group-hover:border-slate-200 group-hover:bg-white transition-all space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-sm font-bold font-mono tabular-nums px-2 py-0.5 rounded ${
                                score >= 8
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : score >= 5
                                  ? 'bg-slate-100 text-slate-800'
                                  : 'bg-rose-50 text-rose-700'
                              }`}
                            >
                              {score}/10
                            </span>
                            <Info className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500" />
                          </div>
                          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                            {rationale}
                          </p>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Cell Detail Modal */}
      {selectedCell && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-md w-full shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="text-xs text-slate-500 font-semibold uppercase">
                Score Analysis
              </div>
              <span className="text-sm font-bold font-mono tabular-nums text-indigo-600">
                {selectedCell.score} / 10
              </span>
            </div>

            <div>
              <div className="text-xs text-slate-500">Criterion:</div>
              <h3 className="text-base font-bold text-slate-900">
                {selectedCell.criterionName}
              </h3>
            </div>

            <div>
              <div className="text-xs text-slate-500">Option:</div>
              <div className="text-sm font-semibold text-slate-800">
                {selectedCell.optionName}
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-700 leading-relaxed">
              <strong className="block font-semibold text-slate-900 mb-1">
                Strategic Rationale:
              </strong>
              {selectedCell.rationale}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedCell(null)}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Criterion Modal */}
      {isAddingCriterion && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleAddCriterionSubmit}
            className="bg-white rounded-xl border border-slate-200 p-6 max-w-lg w-full shadow-lg space-y-4"
          >
            <h3 className="text-base font-bold text-slate-900">
              Add New Evaluation Criterion
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Criterion Name
                </label>
                <input
                  type="text"
                  required
                  value={newCritName}
                  onChange={(e) => setNewCritName(e.target.value)}
                  placeholder="e.g. Daily Commute Time, Psychological Autonomy"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description / Why it matters
                </label>
                <input
                  type="text"
                  value={newCritDesc}
                  onChange={(e) => setNewCritDesc(e.target.value)}
                  placeholder="Brief note on how this affects your life"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Importance Weight: <span className="font-mono">{newCritWeight}/10</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={newCritWeight}
                  onChange={(e) => setNewCritWeight(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-2">
                <label className="block text-xs font-semibold text-slate-700">
                  Rate Options for this Criterion (1 to 10):
                </label>
                {decision.options.map((opt) => (
                  <div key={opt.id} className="flex items-center justify-between gap-4">
                    <span className="text-xs text-slate-700 truncate max-w-[240px]">
                      {opt.name}
                    </span>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={newCritScores[opt.name] ?? 6}
                      onChange={(e) =>
                        setNewCritScores({
                          ...newCritScores,
                          [opt.name]: Number(e.target.value),
                        })
                      }
                      className="w-20 px-2 py-1 text-xs border border-slate-300 rounded font-mono text-center"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAddingCriterion(false)}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors"
              >
                Add to Matrix
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
