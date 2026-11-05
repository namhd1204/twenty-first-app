import { useState } from 'react';
import { Plus, Trash2, CheckSquare, Square, RotateCcw, ShieldCheck, Sparkles } from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function BarriersTab() {
  const { barriers, addBarrier, toggleBarrier, removeBarrier, resetBarriers } = useAppStore();
  const [newLabel, setNewLabel] = useState('');
  const [showInput, setShowInput] = useState(false);

  const handleAdd = async () => {
    if (!newLabel.trim()) return;
    await addBarrier(newLabel.trim());
    setNewLabel('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAdd();
    if (e.key === 'Escape') { setShowInput(false); setNewLabel(''); }
  };

  const allChecked = barriers.length > 0 && barriers.every(b => b.is_checked);
  const checkedCount = barriers.filter(b => b.is_checked).length;

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              🛡️ Pillar 3: Barrier Removal Checklist
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Eliminate physical, mental, and environmental friction before sitting down to practice.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={resetBarriers}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-400 hover:text-white transition-colors"
              title="Reset all checklist items to unchecked for next session"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
            <button
              onClick={() => setShowInput(!showInput)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-medium transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-400" />
              Add Check
            </button>
          </div>
        </div>

        {/* Readiness Alert */}
        {allChecked && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3"
          >
            <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-emerald-300">
                Friction Removed: You are 100% Ready!
              </p>
              <p className="text-xs text-emerald-400/80 mt-0.5">
                Every barrier is cleared. Jump straight into the Focus Timer without excuses.
              </p>
            </div>
          </motion.div>
        )}

        {/* Progress indicator */}
        {barriers.length > 0 && !allChecked && (
          <div className="mt-4 flex items-center justify-between text-xs text-slate-400 bg-slate-950/40 px-3.5 py-2 rounded-xl border border-slate-800/60">
            <span>Pre-session checklist status:</span>
            <span className="font-semibold text-slate-200">{checkedCount} of {barriers.length} cleared</span>
          </div>
        )}

        {/* Add input */}
        <AnimatePresence>
          {showInput && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mt-4 pt-4 border-t border-slate-800"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder='e.g., "Phone on Do Not Disturb", "Guitar out of case on stand", "Tabs printed"'
                  className="flex-1 px-4 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                  autoFocus
                />
                <button
                  onClick={handleAdd}
                  disabled={!newLabel.trim()}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-medium text-xs transition-colors"
                >
                  Add
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Checklist items */}
      <div className="space-y-2">
        <AnimatePresence>
          {barriers.map((barrier) => (
            <motion.div
              key={barrier.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              onClick={() => toggleBarrier(barrier.id)}
              className={cn(
                'flex items-center gap-3.5 px-4 py-3.5 rounded-xl border transition-all cursor-pointer group select-none',
                barrier.is_checked
                  ? 'bg-emerald-500/10 border-emerald-500/30'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              )}
            >
              <button
                type="button"
                className="shrink-0 text-slate-500 hover:text-emerald-400 transition-colors"
              >
                {barrier.is_checked ? (
                  <CheckSquare className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Square className="w-5 h-5 text-slate-500 group-hover:text-slate-400" />
                )}
              </button>

              <span
                className={cn(
                  'flex-1 text-sm font-medium transition-colors',
                  barrier.is_checked ? 'text-emerald-300 font-normal' : 'text-slate-200'
                )}
              >
                {barrier.label}
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeBarrier(barrier.id);
                }}
                className="shrink-0 p-1.5 rounded-lg text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Delete item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {barriers.length === 0 && !showInput && (
        <div className="text-center py-16 px-4 bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl">
          <Sparkles className="w-10 h-10 text-emerald-400 mx-auto mb-3 opacity-60" />
          <h3 className="text-base font-semibold text-slate-300 mb-1">No barriers listed</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            List pre-flight checks like "Water bottle filled", "Door closed", "Laptop notifications muted".
          </p>
          <button
            onClick={() => setShowInput(true)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors"
          >
            Add Checklist Item
          </button>
        </div>
      )}
    </div>
  );
}
