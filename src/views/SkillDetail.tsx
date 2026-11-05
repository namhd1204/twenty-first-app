import { useEffect, useState } from 'react';
import { ArrowLeft, Layers, BookOpen, Shield, Timer, Play } from 'lucide-react';
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
        <p className="text-slate-400 mb-4">No active skill selected.</p>
        <button
          onClick={() => setCurrentView('dashboard')}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const progress = getProgressPercentage(skill.logged_hours, skill.target_hours);
  const remaining = Math.max(0, skill.target_hours - skill.logged_hours);
  const isCompleted = skill.logged_hours >= skill.target_hours;

  const tabs = [
    { id: 'deconstruct' as const, icon: Layers, label: '1. Deconstruct', subtitle: '80/20 Sub-skills' },
    { id: 'resources' as const, icon: BookOpen, label: '2. Resources', subtitle: 'Self-correct (≤5)' },
    { id: 'barriers' as const, icon: Shield, label: '3. Barriers', subtitle: 'Pre-flight check' },
    { id: 'practice' as const, icon: Timer, label: '4. Practice Log', subtitle: 'Timer & Milestones' },
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-5xl mx-auto p-8 space-y-6">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentView('dashboard')}
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </div>

        {/* Campaign Hero Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden"
        >
          {/* Subtle colored glow background */}
          <div
            className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none"
            style={{ backgroundColor: skill.color }}
          />

          <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
            {/* Progress Circular Dial */}
            <ProgressRing progress={progress} size={110} strokeWidth={8} color={skill.color}>
              <div className="text-center">
                <span className="text-xl font-extrabold text-white">{Math.round(progress)}%</span>
                <span className="block text-[10px] text-slate-400 font-medium">of 20h</span>
              </div>
            </ProgressRing>

            {/* Campaign Meta */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-1.5">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: skill.color }} />
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {skill.name}
                </h1>
                {isCompleted && (
                  <span className="text-xs bg-emerald-500/20 text-emerald-400 font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Mastered (20h)
                  </span>
                )}
              </div>

              {skill.description ? (
                <p className="text-sm text-slate-400 max-w-xl line-clamp-2 mb-3">
                  {skill.description}
                </p>
              ) : (
                <p className="text-sm text-slate-500 italic mb-3">
                  Josh Kaufman 20-Hour Deliberate Practice Protocol
                </p>
              )}

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs">
                <div className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 text-slate-300">
                  Logged:{' '}
                  <span className="font-bold text-white ml-1">
                    {formatHours(skill.logged_hours)}
                  </span>
                </div>
                <div className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 text-slate-300">
                  Remaining:{' '}
                  <span className="font-bold text-white ml-1">
                    {formatHours(remaining)}
                  </span>
                </div>
                <div className="text-slate-500 text-xs hidden sm:block">
                  Target: {skill.target_hours} Hours
                </div>
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="shrink-0 w-full md:w-auto">
              <button
                onClick={() => setShowTimer(true)}
                className="w-full md:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl font-bold text-white shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: skill.color,
                  boxShadow: `0 8px 24px ${skill.color}33`,
                }}
              >
                <Play className="w-5 h-5 fill-white" />
                <span>Start Practice Session</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* 4 Pillars Tab Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-slate-900/60 p-1.5 border border-slate-800 rounded-2xl">
          {tabs.map((tab) => {
            const isActive = skillTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSkillTab(tab.id)}
                className={cn(
                  'flex flex-col items-start px-4 py-3 rounded-xl text-left transition-all',
                  isActive
                    ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                )}
              >
                <div className="flex items-center gap-2 mb-0.5">
                  <tab.icon
                    className={cn(
                      'w-4 h-4',
                      isActive ? 'text-emerald-400' : 'text-slate-500'
                    )}
                  />
                  <span className="text-xs font-semibold">{tab.label}</span>
                </div>
                <span className="text-[10px] text-slate-500 truncate max-w-full font-medium">
                  {tab.subtitle}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Panes */}
        <motion.div
          key={skillTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
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
