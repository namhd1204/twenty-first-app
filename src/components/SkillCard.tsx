import { Play, Trash2, Clock } from 'lucide-react';
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
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all duration-200 group cursor-pointer"
      onClick={handleOpen}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: skill.color }} />
            <h3 className="text-lg font-bold text-white truncate">{skill.name}</h3>
          </div>
          {skill.description ? (
            <p className="text-sm text-slate-400 line-clamp-2 mt-1">{skill.description}</p>
          ) : (
            <p className="text-xs text-slate-500 italic mt-1">Chưa có mục tiêu chi tiết</p>
          )}
        </div>
        <button
          onClick={handleDelete}
          className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors opacity-0 group-hover:opacity-100"
          title="Xóa kỹ năng này"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-5">
        <ProgressRing progress={progress} size={80} strokeWidth={6} color={skill.color}>
          <span className="text-sm font-bold text-white">{Math.round(progress)}%</span>
        </ProgressRing>
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-slate-500" />
            <span className="text-slate-300 font-medium">
              {formatHours(skill.logged_hours)} / {formatHours(skill.target_hours)}
            </span>
          </div>
          <div className="text-xs text-slate-400">
            {isCompleted ? (
              <span className="text-emerald-400 font-semibold">🎉 Đã hoàn thành 20 giờ!</span>
            ) : (
              <span>Còn lại: <strong className="text-slate-200">{formatHours(remaining)}</strong></span>
            )}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onStart(); }}
            className="mt-2 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200"
            style={{
              backgroundColor: `${skill.color}20`,
              color: skill.color,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = `${skill.color}35`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = `${skill.color}20`;
            }}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Bắt đầu luyện tập
          </button>
        </div>
      </div>
    </motion.div>
  );
}
