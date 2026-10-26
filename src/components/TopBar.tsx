import React from 'react';
import { ActiveTab } from '../types/decision';
import { Scale, Plus, Bookmark } from 'lucide-react';

interface TopBarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onNewDecision: () => void;
  onOpenSaved: () => void;
  savedCount: number;
  currentTitle?: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  onTabChange,
  onNewDecision,
  onOpenSaved,
  savedCount,
  currentTitle,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text wordmark with subtle brand icon */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <Scale className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">
                The Tiebreaker
              </span>
            </div>
          </div>

          {/* Zone 2: 5 clean, single-line navigation links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => onTabChange('ruling')}
              className={`px-3.5 py-2 text-sm font-medium transition-colors whitespace-nowrap shrink-0 rounded-md ${
                activeTab === 'ruling'
                  ? 'text-indigo-600 bg-indigo-50/70 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              The Ruling
            </button>
            <button
              onClick={() => onTabChange('pros-cons')}
              className={`px-3.5 py-2 text-sm font-medium transition-colors whitespace-nowrap shrink-0 rounded-md ${
                activeTab === 'pros-cons'
                  ? 'text-indigo-600 bg-indigo-50/70 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              Pros & Cons
            </button>
            <button
              onClick={() => onTabChange('comparison')}
              className={`px-3.5 py-2 text-sm font-medium transition-colors whitespace-nowrap shrink-0 rounded-md ${
                activeTab === 'comparison'
                  ? 'text-indigo-600 bg-indigo-50/70 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              Comparison Matrix
            </button>
            <button
              onClick={() => onTabChange('swot')}
              className={`px-3.5 py-2 text-sm font-medium transition-colors whitespace-nowrap shrink-0 rounded-md ${
                activeTab === 'swot'
                  ? 'text-indigo-600 bg-indigo-50/70 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              SWOT Analysis
            </button>
            <button
              onClick={() => onTabChange('psychology')}
              className={`px-3.5 py-2 text-sm font-medium transition-colors whitespace-nowrap shrink-0 rounded-md ${
                activeTab === 'psychology'
                  ? 'text-indigo-600 bg-indigo-50/70 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              Decision Lab
            </button>
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={onOpenSaved}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-md transition-colors whitespace-nowrap shrink-0"
              title="Saved decisions"
            >
              <Bookmark className="w-3.5 h-3.5 text-slate-500" />
              <span>Decisions</span>
              <span className="font-mono tabular-nums text-slate-500">
                ({savedCount})
              </span>
            </button>

            <button
              onClick={onNewDecision}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md shadow-xs transition-colors whitespace-nowrap shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>New Decision</span>
            </button>
          </div>
        </div>

        {/* Mobile secondary tab strip */}
        <div className="flex md:hidden overflow-x-auto py-2 gap-1 border-t border-slate-100 scrollbar-none">
          {(
            [
              ['ruling', 'The Ruling'],
              ['pros-cons', 'Pros & Cons'],
              ['comparison', 'Comparison'],
              ['swot', 'SWOT'],
              ['psychology', 'Decision Lab'],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => onTabChange(key)}
              className={`px-3 py-1 text-xs font-medium rounded whitespace-nowrap shrink-0 transition-colors ${
                activeTab === key
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
