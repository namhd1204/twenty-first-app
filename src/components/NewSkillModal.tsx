import { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
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

  const handleClose = () => {
    setName('');
    setDescription('');
    setColor(SKILL_COLORS[0]);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const id = await addSkill(name.trim(), description.trim(), color);
    setActiveSkill(id);
    await loadSkillData(id);
    setCurrentView('skill');
    handleClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 8 }}
            transition={{ duration: 0.15 }}
            className="w-full max-w-md bg-surface border border-border rounded-lg p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className="flex items-center justify-between pb-4 border-b border-border mb-5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent" />
                <h2 id="modal-title" className="text-base font-bold text-foreground tracking-tight">Chiến dịch Kỹ năng mới</h2>
              </div>
              <button
                onClick={handleClose}
                className="p-1.5 rounded-xs text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-colors"
                aria-label="Đóng cửa sổ"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Bạn muốn học kỹ năng gì? <span className="text-accent">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ví dụ: Đàn Ukulele, Thuyết trình, Code Rust..."
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground text-xs focus-visible:outline-2 focus-visible:outline-accent transition-colors"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Mục tiêu cụ thể / Lý do học (Tùy chọn)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ví dụ: Đệm hát được 3 bài yêu thích một cách trôi chảy..."
                  rows={3}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground text-xs focus-visible:outline-2 focus-visible:outline-accent transition-colors resize-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  Màu sắc đại diện
                </label>
                <div className="flex gap-2">
                  {SKILL_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      aria-label={`Chọn màu ${c}`}
                      className="w-7 h-7 rounded-sm transition-all duration-150 relative"
                      style={{
                        backgroundColor: c,
                        outline: color === c ? '2px solid var(--foreground)' : 'none',
                        outlineOffset: '2px',
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-border flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 rounded-md bg-surface-hover hover:bg-surface-active text-foreground text-xs font-semibold transition-colors border border-border"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={!name.trim()}
                  className="px-5 py-2 rounded-md bg-accent hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold transition-colors"
                >
                  Bắt đầu Chiến dịch →
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
