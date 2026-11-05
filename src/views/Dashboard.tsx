import { useState, useEffect } from 'react';
import { Plus, Target, Clock, TrendingUp, Flame } from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { SkillCard } from '../components/SkillCard';
import { NewSkillModal } from '../components/NewSkillModal';
import { FocusTimer } from '../components/FocusTimer';
import { formatHours } from '../lib/utils';
import { motion } from 'framer-motion';

export function Dashboard() {
  const { skills } = useAppStore();
  const [showNewSkill, setShowNewSkill] = useState(false);
  const [timerSkill, setTimerSkill] = useState<{ id: string; name: string; color: string } | null>(null);

  useEffect(() => {
    const handler = () => setShowNewSkill(true);
    window.addEventListener('open-new-skill', handler);
    return () => window.removeEventListener('open-new-skill', handler);
  }, []);

  const totalHours = skills.reduce((sum, s) => sum + s.logged_hours, 0);
  const activeCount = skills.filter(s => s.status === 'active').length;
  const completedCount = skills.filter(s => s.logged_hours >= s.target_hours).length;

  const stats = [
    { icon: Target, label: 'Active Skills', value: String(activeCount), color: '#10b981' },
    { icon: Clock, label: 'Total Hours', value: formatHours(totalHours), color: '#6366f1' },
    { icon: TrendingUp, label: 'Completed', value: String(completedCount), color: '#f59e0b' },
    { icon: Flame, label: 'Skills Started', value: String(skills.length), color: '#ef4444' },
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-5xl mx-auto p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
            <p className="text-slate-400 mt-1">Your 20-hour skill acquisition campaigns</p>
          </div>
          <button
            onClick={() => setShowNewSkill(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors"
          >
            <Plus className="w-5 h-5" />
            New Skill
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-slate-900/80 border border-slate-800 rounded-xl p-4"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: `${stat.color}15` }}>
                  <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-slate-500">{stat.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Skills Grid */}
        {skills.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-6">
              <Target className="w-10 h-10 text-slate-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-300 mb-2">No skills yet</h3>
            <p className="text-slate-500 mb-6 max-w-sm mx-auto">
              Start your first 20-hour learning campaign. Break down a skill, remove barriers, and practice deliberately.
            </p>
            <button
              onClick={() => setShowNewSkill(true)}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors"
            >
              <Plus className="w-5 h-5 inline mr-2" />
              Create Your First Skill
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skills.map((skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                onStart={() => setTimerSkill({ id: skill.id, name: skill.name, color: skill.color })}
              />
            ))}
          </div>
        )}
      </div>

      <NewSkillModal isOpen={showNewSkill} onClose={() => setShowNewSkill(false)} />

      {timerSkill && (
        <FocusTimer
          isOpen={!!timerSkill}
          skillId={timerSkill.id}
          skillName={timerSkill.name}
          skillColor={timerSkill.color}
          onClose={() => setTimerSkill(null)}
        />
      )}
    </div>
  );
}
