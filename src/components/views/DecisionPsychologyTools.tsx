import React, { useState } from 'react';
import { Decision } from '../../types/decision';
import {
  Coins,
  Skull,
  HeartHandshake,
  RotateCw,
  Sparkles,
  CheckCircle,
  HelpCircle,
  AlertTriangle,
} from 'lucide-react';

interface DecisionPsychologyToolsProps {
  decision: Decision;
}

export const DecisionPsychologyTools: React.FC<DecisionPsychologyToolsProps> = ({
  decision,
}) => {
  const [activeTool, setActiveTool] = useState<'coin' | 'premortem' | 'values'>(
    'coin'
  );

  // Coin toss state
  const [isFlipping, setIsFlipping] = useState(false);
  const [coinResult, setCoinResult] = useState<'heads' | 'tails' | null>(null);
  const [gutReaction, setGutReaction] = useState<string | null>(null);
  const [flipCount, setFlipCount] = useState(0);

  const option1 = decision.options[0]?.name || 'Option A';
  const option2 = decision.options[1]?.name || 'Option B';

  const handleFlipCoin = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    setCoinResult(null);
    setGutReaction(null);

    setTimeout(() => {
      const outcome = Math.random() > 0.5 ? 'heads' : 'tails';
      setCoinResult(outcome);
      setIsFlipping(false);
      setFlipCount((prev) => prev + 1);
    }, 1200);
  };

  // Values alignment state
  const [valuesScores, setValuesScores] = useState<
    Record<string, Record<string, number>>
  >({
    'Autonomy & Freedom': {
      [option1]: 8,
      [option2]: 5,
    },
    'Financial Security & Peace': {
      [option1]: 4,
      [option2]: 9,
    },
    'Intellectual Growth & Mastery': {
      [option1]: 9,
      [option2]: 6,
    },
    'Work-Life & Mental Well-being': {
      [option1]: 5,
      [option2]: 8,
    },
    'Family, Relationships & Presence': {
      [option1]: 6,
      [option2]: 8,
    },
  });

  const handleValueChange = (valueName: string, optionName: string, score: number) => {
    setValuesScores((prev) => ({
      ...prev,
      [valueName]: {
        ...prev[valueName],
        [optionName]: score,
      },
    }));
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Navigation Strip */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Behavioral Science & Intuition Engine</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              The Decision Psychology Lab
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              When analytical spreadsheets leave you deadlocked, bypass conscious overthinking with psychological frameworks:
            </p>
          </div>

          {/* Tool Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg self-start shrink-0">
            <button
              onClick={() => setActiveTool('coin')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                activeTool === 'coin'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              The Coin Toss Test
            </button>
            <button
              onClick={() => setActiveTool('premortem')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                activeTool === 'premortem'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pre-Mortem
            </button>
            <button
              onClick={() => setActiveTool('values')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                activeTool === 'values'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Values Alignment
            </button>
          </div>
        </div>

        {/* TOOL 1: THE FREUD COIN TOSS GUT REVEALER */}
        {activeTool === 'coin' && (
          <div className="mt-6 space-y-6">
            <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                The Sigmund Freud Paradox
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                "When you are faced with two alternatives, toss a coin. Not because the coin can make the right decision for you, but because in the split second the coin is in the air, you suddenly realize what your heart is secretly hoping for."
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border border-slate-200 bg-white">
                <div className="text-xs font-bold text-indigo-600 uppercase mb-1">
                  HEADS MAPS TO:
                </div>
                <div className="text-sm font-bold text-slate-900">{option1}</div>
              </div>
              <div className="p-4 rounded-lg border border-slate-200 bg-white">
                <div className="text-xs font-bold text-amber-600 uppercase mb-1">
                  TAILS MAPS TO:
                </div>
                <div className="text-sm font-bold text-slate-900">{option2}</div>
              </div>
            </div>

            {/* Interactive Coin Flip Arena */}
            <div className="flex flex-col items-center justify-center py-10 bg-gradient-to-b from-slate-50 to-white rounded-xl border border-slate-200 text-center">
              <div
                className={`w-28 h-28 rounded-full border-4 border-amber-400 bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 shadow-md flex items-center justify-center transition-transform duration-700 ${
                  isFlipping ? 'animate-bounce scale-110 rotate-180' : ''
                }`}
              >
                <div className="text-amber-950 font-black text-sm tracking-wider uppercase font-mono">
                  {isFlipping
                    ? '???'
                    : coinResult === 'heads'
                    ? 'HEADS'
                    : coinResult === 'tails'
                    ? 'TAILS'
                    : 'FLIP ME'}
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={handleFlipCoin}
                  disabled={isFlipping}
                  className="px-6 py-2.5 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-60 rounded-lg shadow-xs transition-colors inline-flex items-center gap-2"
                >
                  <RotateCw
                    className={`w-4 h-4 ${isFlipping ? 'animate-spin' : ''}`}
                  />
                  <span>
                    {isFlipping
                      ? 'Coin in the air...'
                      : flipCount > 0
                      ? 'Flip Again'
                      : 'Flip the Decision Coin'}
                  </span>
                </button>
              </div>

              {coinResult && !isFlipping && (
                <div className="mt-8 max-w-md w-full px-4 animate-in fade-in duration-300">
                  <div className="p-4 rounded-lg bg-indigo-50 border border-indigo-100 text-center mb-4">
                    <span className="text-xs text-indigo-700 font-semibold uppercase tracking-wider block mb-1">
                      The Coin Landed On:
                    </span>
                    <span className="text-lg font-bold text-indigo-950">
                      {coinResult === 'heads' ? option1 : option2}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="text-xs font-semibold text-slate-700">
                      Check your physiological gut response right now:
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() =>
                          setGutReaction(
                            `Relief! Your gut genuinely wants: ${
                              coinResult === 'heads' ? option1 : option2
                            }. Honor that feeling.`
                          )
                        }
                        className="px-3 py-2 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md transition-colors"
                      >
                        I felt Relief / Joy
                      </button>
                      <button
                        onClick={() =>
                          setGutReaction(
                            `Disappointment! Your gut actually secretly wants: ${
                              coinResult === 'heads' ? option2 : option1
                            }. The coin helped you realize it!`
                          )
                        }
                        className="px-3 py-2 text-xs font-medium text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-md transition-colors"
                      >
                        I felt Disappointed / Want Re-roll
                      </button>
                    </div>
                  </div>

                  {gutReaction && (
                    <div className="mt-4 p-4 rounded-lg bg-slate-900 text-white text-xs leading-relaxed text-left">
                      <strong className="block text-indigo-300 mb-1">
                        Intuitive Verdict:
                      </strong>
                      {gutReaction}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TOOL 2: PRE-MORTEM SIMULATOR */}
        {activeTool === 'premortem' && (
          <div className="mt-6 space-y-6">
            <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                Gary Klein's Prospective Hindsight (The Pre-Mortem)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Rather than asking "What might go wrong?", assume you already made the decision and it failed catastrophically 2 years later. By working backwards from a known failure, you uncover risks that wishful thinking hid.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Worst Case */}
              <div className="p-6 rounded-xl border border-rose-200 bg-rose-50/40 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-800 uppercase tracking-wider">
                  <Skull className="w-4 h-4 text-rose-600" />
                  <span>The Catastrophic Failure Pre-Mortem</span>
                </div>
                <h4 className="text-base font-bold text-slate-900">
                  If this choice went up in flames, why did it happen?
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed bg-white p-4 rounded-lg border border-rose-100">
                  {decision.ruling.preMortem.worstCaseScenario}
                </p>
              </div>

              {/* Best Case */}
              <div className="p-6 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>The Decennial Triumph Scenario</span>
                </div>
                <h4 className="text-base font-bold text-slate-900">
                  If this was the crowning decision of your decade, what sparked it?
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed bg-white p-4 rounded-lg border border-emerald-100">
                  {decision.ruling.preMortem.bestCaseScenario}
                </p>
              </div>
            </div>

            {/* Preventative Hedge */}
            <div className="p-6 rounded-xl border border-slate-900 bg-slate-900 text-white space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>The Concrete Pre-Mortem Preventative Hedge</span>
              </div>
              <h4 className="text-base font-bold text-white">
                What safeguard should you put in place today to neutralize the worst-case?
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                {decision.ruling.preMortem.preventativeStep}
              </p>
            </div>
          </div>
        )}

        {/* TOOL 3: CORE VALUES ALIGNMENT */}
        {activeTool === 'values' && (
          <div className="mt-6 space-y-6">
            <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                Core Human Values Alignment Check
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Decisions fail when we pick an option that looks brilliant on paper but contradicts our unshakeable personal values. Rate each option (1 to 10) against these foundational pillars:
              </p>
            </div>

            <div className="space-y-4">
              {Object.entries(valuesScores).map(([valueName, scores]) => (
                <div
                  key={valueName}
                  className="p-5 rounded-lg border border-slate-200 bg-white space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900">{valueName}</h4>
                    <span className="text-xs text-slate-500 font-medium">Value Pillar</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {decision.options.map((opt) => {
                      const score = scores[opt.name] ?? 6;
                      return (
                        <div key={opt.id} className="p-3 bg-slate-50 rounded-md space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-slate-800 truncate max-w-[200px]">
                              {opt.name}
                            </span>
                            <span className="font-mono tabular-nums font-bold text-indigo-600">
                              {score}/10
                            </span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="10"
                            value={score}
                            onChange={(e) =>
                              handleValueChange(
                                valueName,
                                opt.name,
                                Number(e.target.value)
                              )
                            }
                            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
