import React, { useState } from 'react';
import { Decision } from '../types/decision';
import {
  X,
  Search,
  Trash2,
  Download,
  Upload,
  Calendar,
  CheckCircle,
  FileText,
  ExternalLink,
} from 'lucide-react';

interface SavedDecisionsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  decisions: Decision[];
  activeDecisionId: string;
  onSelectDecision: (id: string) => void;
  onDeleteDecision: (id: string) => void;
  onImportDecisions: (imported: Decision[]) => void;
}

export const SavedDecisionsDrawer: React.FC<SavedDecisionsDrawerProps> = ({
  isOpen,
  onClose,
  decisions,
  activeDecisionId,
  onSelectDecision,
  onDeleteDecision,
  onImportDecisions,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState('All');

  if (!isOpen) return null;

  const filteredDecisions = decisions.filter((d) => {
    const matchesSearch =
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.context.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = filterTag === 'All' || d.tag === filterTag;
    return matchesSearch && matchesTag;
  });

  const allTags = ['All', ...Array.from(new Set(decisions.map((d) => d.tag).filter(Boolean)))];

  const handleExportAll = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(decisions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `the-tiebreaker-decisions-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          onImportDecisions(parsed);
        } else if (parsed.id && parsed.title) {
          onImportDecisions([parsed]);
        }
      } catch (err) {
        alert('Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Saved Decisions
            </h2>
            <p className="text-xs text-slate-500">
              History preserved in your local workspace.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 border-b border-slate-100 space-y-3 bg-slate-50/50">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search decisions..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-md bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setFilterTag(tag as string)}
                className={`px-2 py-1 text-xs font-medium rounded whitespace-nowrap shrink-0 transition-colors ${
                  filterTag === tag
                    ? 'bg-slate-800 text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Decisions List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-slate-100">
          {filteredDecisions.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No matching decisions found.
            </div>
          ) : (
            filteredDecisions.map((d) => {
              const isActive = d.id === activeDecisionId;
              return (
                <div
                  key={d.id}
                  onClick={() => {
                    onSelectDecision(d.id);
                    onClose();
                  }}
                  className={`pt-3 first:pt-0 p-3 rounded-lg cursor-pointer transition-all border ${
                    isActive
                      ? 'border-indigo-500 bg-indigo-50/40'
                      : 'border-transparent hover:border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      {d.title}
                    </h3>
                    {decisions.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('Delete this decision record?')) {
                            onDeleteDecision(d.id);
                          }
                        }}
                        className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                    {d.context}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1 font-mono">
                      <Calendar className="w-3 h-3" />
                      {new Date(d.createdAt).toLocaleDateString()}
                    </span>
                    <span className="font-medium text-indigo-600">
                      {d.options.length} options
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer actions: Import / Export */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-2">
          <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-md transition-colors">
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            <span>Import JSON</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
          </label>

          <button
            onClick={handleExportAll}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-md transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Backup</span>
          </button>
        </div>
      </div>
    </div>
  );
};
