import React from 'react';
import { Decision } from '../../types/decision';
import {
  Compass,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Flame,
  Printer,
  Share2,
} from 'lucide-react';

interface VerdictRulingViewProps {
  decision: Decision;
  onOpenExport: () => void;
  onSwitchTab: (tab: any) => void;
}

export const VerdictRulingView: React.FC<VerdictRulingViewProps> = ({
  decision,
  onOpenExport,
  onSwitchTab,
}) => {
  const { ruling, options } = decision;

  const recommendedOption = options.find(
    (o) => o.name === ruling.recommendedOptionName
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Decision Banner */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <span>Decision Brief</span>
              <span aria-hidden="true">·</span>
              <span>Updated {new Date(decision.updatedAt).toLocaleDateString()}</span>
              {decision.tag && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{decision.tag}</span>
                </>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900" style={{ textWrap: 'balance' }}>
              {decision.title}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {decision.context}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start shrink-0">
            <button
              onClick={onOpenExport}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors whitespace-nowrap shrink-0"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share & Export</span>
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors whitespace-nowrap shrink-0"
              title="Print Clean Summary"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* The Official Ruling Card */}
        <div className="mt-6 pt-2">
          <div className="bg-slate-900 text-white rounded-lg p-6 md:p-8">
            <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-indigo-300">
                <Compass className="w-4 h-4 text-indigo-400" />
                <span>The Tiebreaker Official Ruling</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <span>Confidence Assessment:</span>
                <span className="font-semibold text-emerald-400">
                  {ruling.confidenceLevel}
                </span>
              </div>
            </div>

            <div className="mb-4">
              <div className="text-xs text-slate-400 mb-1">Recommended Course of Action:</div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {ruling.bottomLineVerdict}
              </h2>
            </div>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {ruling.rulingRationale}
            </p>

            {/* Quick jump to detailed views */}
            <div className="mt-6 pt-5 border-t border-slate-800 flex items-center gap-4 flex-wrap">
              <span className="text-xs text-slate-400">Explore supporting evidence:</span>
              <button
                onClick={() => onSwitchTab('pros-cons')}
                className="text-xs text-indigo-300 hover:text-white font-medium inline-flex items-center gap-1 transition-colors"
              >
                Pros & Cons Breakdown <ArrowRight className="w-3 h-3" />
              </button>
              <span className="text-slate-700">·</span>
              <button
                onClick={() => onSwitchTab('comparison')}
                className="text-xs text-indigo-300 hover:text-white font-medium inline-flex items-center gap-1 transition-colors"
              >
                MCDA Comparison Matrix <ArrowRight className="w-3 h-3" />
              </button>
              <span className="text-slate-700">·</span>
              <button
                onClick={() => onSwitchTab('swot')}
                className="text-xs text-indigo-300 hover:text-white font-medium inline-flex items-center gap-1 transition-colors"
              >
                SWOT Matrix <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Heuristic Decision Rules: If-Then Triggers */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 shadow-xs">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Conditional Decision Heuristics</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            How to Choose Based on Your Dominant Priority
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            No single option wins across every dimension. Pick the rule that matches your personal life stage right now:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ruling.ifThenRules.map((rule, idx) => (
            <div
              key={idx}
              className="p-5 rounded-lg border border-slate-200 bg-slate-50/50 flex flex-col justify-between hover:border-slate-300 transition-colors"
            >
              <div className="space-y-3">
                <div className="text-xs font-semibold text-slate-500">
                  Priority Scenario {idx + 1}
                </div>
                <p className="text-sm text-slate-700 font-medium leading-snug">
                  "{rule.condition}"
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200/80">
                <div className="text-xs text-slate-500 mb-0.5">Clear Decision:</div>
                <div className="text-sm font-bold text-indigo-600">
                  {rule.recommendedOption}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* The 10-10-10 Rule Reflection */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 shadow-xs">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <Clock className="w-4 h-4 text-indigo-500" />
            <span>Temporal Reality Check</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            The 10-10-10 Rule (Suzy Welch Framework)
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            Decisions feel overwhelming because short-term discomfort eclipses long-term compounding. Here is how each timeframe unfolds:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-lg border border-slate-200 bg-slate-50">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase mb-2">
              <span>In 10 Minutes</span>
              <span className="text-slate-400 font-normal">(Immediate Reaction)</span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              {ruling.tenTenTen.inTenMinutes}
            </p>
          </div>

          <div className="p-5 rounded-lg border border-slate-200 bg-slate-50">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase mb-2">
              <span>In 10 Months</span>
              <span className="text-slate-400 font-normal">(Operational Grind)</span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              {ruling.tenTenTen.inTenMonths}
            </p>
          </div>

          <div className="p-5 rounded-lg border border-slate-200 bg-slate-50">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase mb-2">
              <span>In 10 Years</span>
              <span className="text-slate-400 font-normal">(Regret Minimization)</span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              {ruling.tenTenTen.inTenYears}
            </p>
          </div>
        </div>
      </section>

      {/* Cognitive Biases & Blind Spot Audit */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 shadow-xs">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 uppercase tracking-wider mb-1">
            <ShieldAlert className="w-4 h-4 text-rose-500" />
            <span>Psychological Blind Spots Detected</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            Cognitive Biases Threatening This Choice
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            The human brain instinctively misjudges risk, change, and sunk costs. Audit your own thought process:
          </p>
        </div>

        <div className="space-y-4">
          {ruling.cognitiveBiases.map((bias, idx) => (
            <div
              key={idx}
              className="p-5 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-colors"
            >
              <div className="flex items-center justify-between gap-3 mb-2">
                <span className="text-sm font-bold text-slate-900">
                  {bias.biasName}
                </span>
                <span className="text-xs text-rose-600 font-medium">Potential Distortion</span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mb-3">
                {bias.description}
              </p>
              <div className="p-3 bg-slate-50 rounded border border-slate-100 text-xs text-slate-800">
                <strong className="font-semibold text-slate-900">Interrogating Question: </strong>
                {bias.reflectionQuestion}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Actionable Next Step: 48-Hour Low Stakes Test */}
      <section className="bg-gradient-to-br from-indigo-50/80 via-white to-slate-50 rounded-xl border border-indigo-100 p-6 md:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Flame className="w-5 h-5 text-amber-300" />
          </div>
          <div className="space-y-2 flex-1">
            <div className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
              Recommended 48-Hour De-Risking Experiment
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Gather Real Signal Before Final Commitment
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              {ruling.lowStakesTest}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
