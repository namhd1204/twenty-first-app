import { useState } from 'react';
import { Plus, Star, Trash2, CheckCircle2, Circle, ChevronRight } from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function DeconstructTab() {
  const { subSkills, addSubSkill, toggleSubSkillPriority, toggleSubSkillComplete, removeSubSkill } = useAppStore();
  const [newName, setNewName] = useState('');
  const [showInput, setShowInput] = useState(false);

  const handleAdd = async () => {
    if (!newName.trim()) return;
    await addSubSkill(newName.trim());
    setNewName('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAdd();
    if (e.key === 'Escape') { setShowInput(false); setNewName(''); }
  };

  const prioritySkills = subSkills.filter(s => s.is_priority);
  const otherSkills = subSkills.filter(s => !s.is_priority);

  return (
    <div className="space-y-6">
      {/* Header card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              🧩 Pillar 1: Skill Deconstructor
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Break down the target skill into micro-components. Star (★) sub-skills that deliver 80% of results.
            </p>
          </div>
          <button
            onClick={() => setShowInput(!showInput)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm text-slate-300 font-medium transition-colors"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            Add Sub-skill
          </button>
        </div>

        {/* Input form */}
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
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="e.g., Ukulele: 4 basic chords (C, G, Am, F) or Finger placement"
                  className="flex-1 px-4 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors text-sm"
                  autoFocus
                />
                <button
                  onClick={handleAdd}
                  disabled={!newName.trim()}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-medium text-sm transition-colors"
                >
                  Add
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 80/20 Priority Section */}
      {prioritySkills.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider">
              80/20 High-Impact Focus
            </h3>
            <span className="text-xs text-slate-500 font-normal">
              ({prioritySkills.length} prioritized micro-skills)
            </span>
          </div>
          <div className="space-y-2">
            <AnimatePresence>
              {prioritySkills.map((sub) => (
                <SubSkillItem
                  key={sub.id}
                  sub={sub}
                  onTogglePriority={() => toggleSubSkillPriority(sub.id)}
                  onToggleComplete={() => toggleSubSkillComplete(sub.id)}
                  onRemove={() => removeSubSkill(sub.id)}
                  isPriority
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Other Sub-skills */}
      {otherSkills.length > 0 && (
        <div className="space-y-3">
          {prioritySkills.length > 0 && (
            <div className="flex items-center gap-2 px-1">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                Additional Sub-skills
              </h3>
              <span className="text-xs text-slate-500">({otherSkills.length})</span>
            </div>
          )}
          <div className="space-y-2">
            <AnimatePresence>
              {otherSkills.map((sub) => (
                <SubSkillItem
                  key={sub.id}
                  sub={sub}
                  onTogglePriority={() => toggleSubSkillPriority(sub.id)}
                  onToggleComplete={() => toggleSubSkillComplete(sub.id)}
                  onRemove={() => removeSubSkill(sub.id)}
                  isPriority={false}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {subSkills.length === 0 && !showInput && (
        <div className="text-center py-16 px-4 bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl">
          <div className="w-12 h-12 rounded-xl bg-slate-800/80 flex items-center justify-center mx-auto mb-3 text-2xl">
            🧩
          </div>
          <h3 className="text-base font-semibold text-slate-300 mb-1">No sub-skills yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            Josh Kaufman advises breaking complex skills into tiny sub-skills so you can focus on the vital 20% first.
          </p>
          <button
            onClick={() => setShowInput(true)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors"
          >
            Add First Sub-skill
          </button>
        </div>
      )}
    </div>
  );
}

function SubSkillItem({
  sub,
  onTogglePriority,
  onToggleComplete,
  onRemove,
  isPriority,
}: {
  sub: { id: string; name: string; is_completed: boolean; is_priority: boolean };
  onTogglePriority: () => void;
  onToggleComplete: () => void;
  onRemove: () => void;
  isPriority: boolean;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -10 }}
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-xl border transition-all group',
        sub.is_completed
          ? 'bg-slate-900/40 border-slate-800/60 opacity-60'
          : isPriority
          ? 'bg-amber-500/5 border-amber-500/30'
          : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
      )}
    >
      <button
        onClick={onToggleComplete}
        className="shrink-0 p-0.5 rounded text-slate-500 hover:text-emerald-400 transition-colors"
        title={sub.is_completed ? 'Mark incomplete' : 'Mark completed'}
      >
        {sub.is_completed ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
        ) : (
          <Circle className="w-5 h-5 text-slate-600 hover:text-slate-400" />
        )}
      </button>

      <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />

      <span
        className={cn(
          'flex-1 text-sm font-medium',
          sub.is_completed ? 'text-slate-500 line-through' : 'text-slate-200'
        )}
      >
        {sub.name}
      </span>

      <button
        onClick={onTogglePriority}
        className={cn(
          'shrink-0 flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all',
          sub.is_priority
            ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'
            : 'text-slate-500 hover:text-amber-400 hover:bg-slate-800'
        )}
        title="Toggle 80/20 High-Impact Tag"
      >
        <Star
          className={cn(
            'w-3.5 h-3.5',
            sub.is_priority ? 'fill-amber-400 text-amber-400' : 'text-slate-500'
          )}
        />
        <span className="hidden sm:inline">{sub.is_priority ? '80/20' : 'Prioritize'}</span>
      </button>

      <button
        onClick={onRemove}
        className="shrink-0 p-1 rounded-lg text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
        title="Delete sub-skill"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
