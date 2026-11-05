import { Play, Trash2, Clock, CheckCircle } from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { formatHours, getProgressPercentage } from '../lib/utils';
import { ProgressRing } from './ProgressRing';
import { motion } from 'framer-motion';
import type { Skill } from '../lib/database';

interface SkillCardProps {
  skill: Skill;
  onStart: () => void;
}

export function SkillCard({ skill, onStart }: SkillCardProps) {
  const { setActiveSkill, setCurrentView, removeSkill } = useAppStore();
  const progress = getProgressPercentage(skill.logged_hours, skill.target_hours);
  const remaining = Math.max(0, skill.target_hours - skill.logged_hours);
  const isCompleted = skill.logged_hours >= skill.target_hours;

  const handleOpen = () => {
    setActiveSkill(skill.id);
    setCurrentView('skill');
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Bạn có chắc chắn muốn xóa chiến dịch "${skill.name}" không?`)) {
      removeSkill(skill.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-surface border border-border rounded-md p-5 hover:border-border-strong transition-colors group cursor-pointer shadow-card flex flex-col justify-between"
      onClick={handleOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleOpen();
        }
      }}
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: skill.color }} />
              <h3 className="text-base font-bold text-foreground truncate tracking-tight">{skill.name}</h3>
            </div>
            {skill.description ? (
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{skill.description}</p>
            ) : (
              <p className="text-xs text-muted-foreground italic">Chưa có mục tiêu chi tiết</p>
            )}
          </div>
          <button
            onClick={handleDelete}
            className="p-1.5 rounded-xs text-muted-foreground hover:text-danger hover:bg-surface-hover transition-colors opacity-0 group-hover:opacity-100 shrink-0"
            title="Xóa kỹ năng này"
            aria-label={`Xóa kỹ năng ${skill.name}`}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 pt-3 border-t border-border">
        <ProgressRing progress={progress} size={70} strokeWidth={6} color={skill.color}>
          <span className="text-xs font-bold text-foreground font-mono">{Math.round(progress)}%</span>
        </ProgressRing>

        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span className="text-foreground font-medium">
              {formatHours(skill.logged_hours)}
            </span>
            <span>/</span>
            <span>{formatHours(skill.target_hours)}</span>
          </div>

          <div className="text-xs text-muted-foreground">
            {isCompleted ? (
              <span className="inline-flex items-center gap-1 text-success font-semibold">
                <CheckCircle className="w-3.5 h-3.5" /> Đã hoàn thành 20h
              </span>
            ) : (
              <span>Còn lại: <strong className="text-foreground font-mono font-medium">{formatHours(remaining)}</strong></span>
            )}
          </div>

          <div className="pt-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStart();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-surface-hover hover:bg-accent hover:text-white text-foreground transition-colors border border-border"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Luyện tập</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
