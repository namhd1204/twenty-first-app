import { useEffect, useState } from 'react';
import { ArrowLeft, Layers, BookOpen, Shield, Timer, Play, CheckCircle } from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { cn, getProgressPercentage, formatHours } from '../lib/utils';
import { ProgressRing } from '../components/ProgressRing';
import { DeconstructTab } from '../components/tabs/DeconstructTab';
import { ResourcesTab } from '../components/tabs/ResourcesTab';
import { BarriersTab } from '../components/tabs/BarriersTab';
import { PracticeTab } from '../components/tabs/PracticeTab';
import { FocusTimer } from '../components/FocusTimer';
import { motion } from 'framer-motion';

export function SkillDetail() {
  const { activeSkillId, skills, skillTab, setSkillTab, setCurrentView, loadSkillData } = useAppStore();
  const [showTimer, setShowTimer] = useState(false);

  const skill = skills.find(s => s.id === activeSkillId);

  useEffect(() => {
    if (activeSkillId) {
      loadSkillData(activeSkillId);
    }
  }, [activeSkillId, loadSkillData]);

  if (!skill) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <p className="text-muted-foreground mb-4 text-xs">Chưa chọn kỹ năng nào.</p>
        <button
          onClick={() => setCurrentView('dashboard')}
          className="px-4 py-2 rounded-md bg-accent hover:bg-accent/90 text-white text-xs font-semibold transition-colors"
        >
          Quay lại Bảng Điều Khiển
        </button>
      </div>
    );
  }

  const progress = getProgressPercentage(skill.logged_hours, skill.target_hours);
  const remaining = Math.max(0, skill.target_hours - skill.logged_hours);
  const isCompleted = skill.logged_hours >= skill.target_hours;

  const tabs = [
    { id: 'deconstruct' as const, icon: Layers, label: '1. Phân Rã Kỹ Năng', subtitle: 'Nguyên lý 80/20' },
    { id: 'resources' as const, icon: BookOpen, label: '2. Tự Sửa Sai', subtitle: '3-5 tài liệu' },
    { id: 'barriers' as const, icon: Shield, label: '3. Loại Bỏ Rào Cản', subtitle: 'Môi trường tập' },
    { id: 'practice' as const, icon: Timer, label: '4. Đếm Giờ & Cột Mốc', subtitle: 'Thực hành 20h' },
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-5xl mx-auto p-6 sm:p-8 space-y-6">
        {/* Top Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentView('dashboard')}
            className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground px-2.5 py-1.5 rounded-md hover:bg-surface-hover transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Quay lại Bảng điều khiển</span>
          </button>
        </div>

        {/* Hero Banner - Swiss Typographic Structure */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface border border-border rounded-md p-6 sm:p-7 relative overflow-hidden shadow-card"
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Progress Circular Dial */}
            <ProgressRing progress={progress} size={96} strokeWidth={6} color={skill.color}>
              <div className="text-center font-mono">
                <span className="text-lg font-bold text-foreground">{Math.round(progress)}%</span>
                <span className="block text-[10px] text-muted-foreground">/ 20h</span>
              </div>
            </ProgressRing>

            {/* Campaign Meta */}
            <div className="flex-1 text-center md:text-left min-w-0">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1.5">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: skill.color }} />
                <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight truncate">
                  {skill.name}
                </h1>
                {isCompleted && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-success px-2 py-0.5 rounded-xs bg-success/10 border border-success/20">
                    <CheckCircle className="w-3 h-3" /> Thuần Thục (20h)
                  </span>
                )}
              </div>

              {skill.description ? (
                <p className="text-xs text-muted-foreground max-w-xl line-clamp-2 mb-3 leading-relaxed">
                  {skill.description}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground italic mb-3">
                  Quy trình 20 giờ thực hành tập trung có chủ đích theo Josh Kaufman
                </p>
              )}

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs">
                <div className="bg-background px-3 py-1 rounded-md border border-border text-muted-foreground font-mono">
                  Đã tập:{' '}
                  <strong className="text-foreground ml-1">
                    {formatHours(skill.logged_hours)}
                  </strong>
                </div>
                <div className="bg-background px-3 py-1 rounded-md border border-border text-muted-foreground font-mono">
                  Còn lại:{' '}
                  <strong className="text-foreground ml-1">
                    {formatHours(remaining)}
                  </strong>
                </div>
                <div className="text-muted-foreground text-xs font-mono hidden sm:block">
                  Mục tiêu: {skill.target_hours}h
                </div>
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="shrink-0 w-full md:w-auto">
              <button
                onClick={() => setShowTimer(true)}
                className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-md font-semibold text-xs text-white bg-accent hover:bg-accent/90 transition-colors shadow-xs"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Bắt đầu Luyện tập</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* 4 Pillars Tab Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 bg-surface p-1.5 border border-border rounded-md">
          {tabs.map((tab) => {
            const isActive = skillTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSkillTab(tab.id)}
                className={cn(
                  'flex flex-col items-start px-3.5 py-2.5 rounded-md text-left transition-colors',
                  isActive
                    ? 'bg-surface-hover text-foreground font-semibold border-b-2 border-accent'
                    : 'text-muted-foreground hover:text-foreground hover:bg-surface-hover'
                )}
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <tab.icon className={cn('w-3.5 h-3.5', isActive ? 'text-accent' : 'text-muted-foreground')} />
                  <span className="text-xs font-semibold">{tab.label}</span>
                </div>
                <span className="text-[10px] text-muted-foreground font-mono truncate max-w-full">
                  {tab.subtitle}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Panes */}
        <motion.div
          key={skillTab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.12 }}
        >
          {skillTab === 'deconstruct' && <DeconstructTab />}
          {skillTab === 'resources' && <ResourcesTab />}
          {skillTab === 'barriers' && <BarriersTab />}
          {skillTab === 'practice' && <PracticeTab />}
        </motion.div>
      </div>

      {/* Focus Timer Modal */}
      {showTimer && (
        <FocusTimer
          isOpen={showTimer}
          skillId={skill.id}
          skillName={skill.name}
          skillColor={skill.color}
          onClose={() => setShowTimer(false)}
        />
      )}
    </div>
  );
}
