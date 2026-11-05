import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { SKILL_COLORS } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface NewSkillModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewSkillModal({ isOpen, onClose }: NewSkillModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(SKILL_COLORS[0]);
  const { addSkill, setActiveSkill, setCurrentView, loadSkillData } = useAppStore();

  useEffect(() => {
    if (isOpen) {
      setName('');
      setDescription('');
      setColor(SKILL_COLORS[Math.floor(Math.random() * SKILL_COLORS.length)]);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const id = await addSkill(name.trim(), description.trim(), color);
    setActiveSkill(id);
    await loadSkillData(id);
    setCurrentView('skill');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">New Skill Campaign</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  What skill do you want to learn?
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Ukulele, Public Speaking, Drawing..."
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Description (optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Why do you want to learn this? What's your goal?"
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Color
                </label>
                <div className="flex gap-2">
                  {SKILL_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className="w-8 h-8 rounded-full transition-all duration-150"
                      style={{
                        backgroundColor: c,
                        outline: color === c ? `2px solid ${c}` : 'none',
                        outlineOffset: '3px',
                        transform: color === c ? 'scale(1.1)' : 'scale(1)',
                      }}
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={!name.trim()}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold transition-colors"
              >
                Start 20-Hour Campaign →
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
