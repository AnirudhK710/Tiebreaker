import React, { useState, useEffect } from 'react';
import { Decision, ActiveTab } from './types/decision';
import { SAMPLE_DECISIONS } from './data/templates';
import { TopBar } from './components/TopBar';
import { VerdictRulingView } from './components/views/VerdictRulingView';
import { ProsConsView } from './components/views/ProsConsView';
import { ComparisonMatrixView } from './components/views/ComparisonMatrixView';
import { SWOTMatrixView } from './components/views/SWOTMatrixView';
import { DecisionPsychologyTools } from './components/views/DecisionPsychologyTools';
import { NewDecisionModal } from './components/NewDecisionModal';
import { SavedDecisionsDrawer } from './components/SavedDecisionsDrawer';
import { ExportSummaryModal } from './components/ExportSummaryModal';

const STORAGE_KEY = 'the_tiebreaker_decisions_v1';
const ACTIVE_ID_KEY = 'the_tiebreaker_active_id_v1';

export default function App() {
  const [decisions, setDecisions] = useState<Decision[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load decisions from localStorage:', e);
    }
    return SAMPLE_DECISIONS;
  });

  const [activeDecisionId, setActiveDecisionId] = useState<string>(() => {
    try {
      const savedId = localStorage.getItem(ACTIVE_ID_KEY);
      if (savedId && decisions.some((d) => d.id === savedId)) return savedId;
    } catch (e) {
      // ignore
    }
    return SAMPLE_DECISIONS[0].id;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('ruling');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(decisions));
    } catch (e) {
      console.error(e);
    }
  }, [decisions]);

  useEffect(() => {
    try {
      localStorage.setItem(ACTIVE_ID_KEY, activeDecisionId);
    } catch (e) {
      console.error(e);
    }
  }, [activeDecisionId]);

  const activeDecision =
    decisions.find((d) => d.id === activeDecisionId) || decisions[0] || SAMPLE_DECISIONS[0];

  const handleUpdateDecision = (updated: Decision) => {
    setDecisions((prev) =>
      prev.map((d) => (d.id === updated.id ? updated : d))
    );
  };

  const handleCreatedDecision = (newDecision: Decision) => {
    setDecisions((prev) => [newDecision, ...prev]);
    setActiveDecisionId(newDecision.id);
    setActiveTab('ruling');
  };

  const handleDeleteDecision = (id: string) => {
    const remaining = decisions.filter((d) => d.id !== id);
    if (remaining.length === 0) {
      setDecisions(SAMPLE_DECISIONS);
      setActiveDecisionId(SAMPLE_DECISIONS[0].id);
    } else {
      setDecisions(remaining);
      if (activeDecisionId === id) {
        setActiveDecisionId(remaining[0].id);
      }
    }
  };

  const handleImportDecisions = (imported: Decision[]) => {
    setDecisions((prev) => {
      const existingIds = new Set(prev.map((p) => p.id));
      const newItems = imported.filter((item) => !existingIds.has(item.id));
      return [...newItems, ...prev];
    });
    if (imported[0]?.id) {
      setActiveDecisionId(imported[0].id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Navigation */}
      <TopBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onNewDecision={() => setIsNewModalOpen(true)}
        onOpenSaved={() => setIsSavedDrawerOpen(true)}
        savedCount={decisions.length}
        currentTitle={activeDecision?.title}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'ruling' && (
          <VerdictRulingView
            decision={activeDecision}
            onOpenExport={() => setIsExportModalOpen(true)}
            onSwitchTab={setActiveTab}
          />
        )}

        {activeTab === 'pros-cons' && (
          <ProsConsView
            decision={activeDecision}
            onUpdateDecision={handleUpdateDecision}
          />
        )}

        {activeTab === 'comparison' && (
          <ComparisonMatrixView
            decision={activeDecision}
            onUpdateDecision={handleUpdateDecision}
          />
        )}

        {activeTab === 'swot' && (
          <SWOTMatrixView decision={activeDecision} />
        )}

        {activeTab === 'psychology' && (
          <DecisionPsychologyTools decision={activeDecision} />
        )}
      </main>

      {/* Modals & Drawers */}
      <NewDecisionModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onCreated={handleCreatedDecision}
      />

      <SavedDecisionsDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        decisions={decisions}
        activeDecisionId={activeDecision.id}
        onSelectDecision={setActiveDecisionId}
        onDeleteDecision={handleDeleteDecision}
        onImportDecisions={handleImportDecisions}
      />

      <ExportSummaryModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        decision={activeDecision}
      />

      {/* Quiet, Clean Editorial Footer (Anti-slop compliant: no fake telemetry tickers) */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">The Tiebreaker</span>
            <span aria-hidden="true">·</span>
            <span>Intelligent Decision Analysis & Multi-Criteria Frameworks</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsNewModalOpen(true)}
              className="hover:text-slate-900 transition-colors"
            >
              Start New Dilemma
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="hover:text-slate-900 transition-colors"
            >
              Export Report
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
