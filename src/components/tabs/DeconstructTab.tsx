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
    <div className="space-y-5">
      {/* Header card */}
      <div className="bg-surface border border-border rounded-md p-5 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-foreground flex items-center gap-2">
              Trụ cột 1: Phân Rã Kỹ Năng (Skill Deconstruction)
            </h2>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Chia nhỏ kỹ năng thành các thành phần vi mô. Đánh dấu sao (★) cho 20% kỹ năng mang lại 80% hiệu quả để ưu tiên luyện trước.
            </p>
          </div>
          <button
            onClick={() => setShowInput(!showInput)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-surface-hover hover:bg-surface-active text-xs text-foreground font-semibold transition-colors border border-border shrink-0 self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5 text-accent" />
            <span>Thêm kỹ năng con</span>
          </button>
        </div>

        {/* Input form */}
        <AnimatePresence>
          {showInput && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mt-4 pt-4 border-t border-border"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ví dụ: Đàn Ukulele: 4 hợp âm cơ bản (C, G, Am, F)..."
                  className="flex-1 px-3 py-2 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground text-xs focus-visible:outline-2 focus-visible:outline-accent transition-colors"
                  autoFocus
                />
                <button
                  onClick={handleAdd}
                  disabled={!newName.trim()}
                  className="px-4 py-2 rounded-md bg-accent hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-xs transition-colors shrink-0"
                >
                  Thêm
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 80/20 Priority Section */}
      {prioritySkills.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 px-1">
            <Star className="w-3.5 h-3.5 text-warning fill-warning" />
            <h3 className="text-[11px] font-bold text-warning uppercase tracking-wider">
              Trọng tâm 80/20 (Ưu tiên hàng đầu)
            </h3>
            <span className="text-[11px] text-muted-foreground font-mono">
              — Luyện trước để thấy tiến bộ rõ nhất
            </span>
          </div>
          <div className="space-y-1.5">
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
        <div className="space-y-2">
          {prioritySkills.length > 0 && (
            <div className="flex items-center gap-2 px-1">
              <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Kỹ năng phụ trợ khác
              </h3>
              <span className="text-[11px] text-muted-foreground font-mono">({otherSkills.length})</span>
            </div>
          )}
          <div className="space-y-1.5">
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
        <div className="text-center py-12 px-4 bg-surface border border-dashed border-border rounded-md">
          <p className="text-xs font-bold text-foreground mb-1">Chưa có kỹ năng con nào</p>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto mb-4 leading-relaxed">
            Phân tách kỹ năng lớn thành các thao tác nhỏ nhất có thể để loại bỏ sự choáng ngợp.
          </p>
          <button
            onClick={() => setShowInput(true)}
            className="px-3.5 py-1.5 rounded-md bg-accent hover:bg-accent/90 text-white text-xs font-semibold transition-colors"
          >
            Thêm kỹ năng con đầu tiên
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
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -10 }}
      className={cn(
        'flex items-center gap-3 px-3.5 py-2.5 rounded-md border transition-colors group',
        sub.is_completed
          ? 'bg-surface/50 border-border opacity-60'
          : isPriority
          ? 'bg-warning-subtle border-warning-border'
          : 'bg-surface border-border hover:border-border-strong'
      )}
    >
      <button
        onClick={onToggleComplete}
        className="shrink-0 p-0.5 rounded text-muted-foreground hover:text-success transition-colors"
        title={sub.is_completed ? 'Đánh dấu chưa xong' : 'Đánh dấu đã thuần thục'}
        aria-label={sub.is_completed ? 'Đánh dấu chưa xong' : 'Đánh dấu đã thuần thục'}
      >
        {sub.is_completed ? (
          <CheckCircle2 className="w-4 h-4 text-success" />
        ) : (
          <Circle className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0 opacity-40" />

      <span
        className={cn(
          'flex-1 text-xs font-medium',
          sub.is_completed ? 'text-muted-foreground line-through' : 'text-foreground'
        )}
      >
        {sub.name}
      </span>

      <button
        onClick={onTogglePriority}
        className={cn(
          'shrink-0 flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold transition-colors',
          sub.is_priority
            ? 'bg-warning/15 text-warning'
            : 'text-muted-foreground hover:text-warning hover:bg-surface-hover'
        )}
        title="Bật/Tắt nhãn ưu tiên 80/20"
      >
        <Star
          className={cn(
            'w-3 h-3',
            sub.is_priority ? 'fill-warning text-warning' : 'text-muted-foreground'
          )}
        />
        <span className="hidden sm:inline font-mono">{sub.is_priority ? '80/20' : 'Ưu tiên'}</span>
      </button>

      <button
        onClick={onRemove}
        className="shrink-0 p-1 rounded text-muted-foreground hover:text-danger opacity-0 group-hover:opacity-100 transition-opacity"
        title="Xóa kỹ năng con này"
        aria-label="Xóa kỹ năng con"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
}
