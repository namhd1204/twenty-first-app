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
    { icon: Target, label: 'Đang rèn luyện', value: String(activeCount), color: '#10b981' },
    { icon: Clock, label: 'Tổng giờ tích lũy', value: formatHours(totalHours), color: '#6366f1' },
    { icon: TrendingUp, label: 'Đã hoàn thành 20h', value: String(completedCount), color: '#f59e0b' },
    { icon: Flame, label: 'Tổng chiến dịch', value: String(skills.length), color: '#ef4444' },
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-5xl mx-auto p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Bảng Điều Khiển</h1>
            <p className="text-slate-400 mt-1 text-sm">
              Quản lý và tối ưu hóa 20 giờ thực hành có chủ đích theo phương pháp Josh Kaufman
            </p>
          </div>
          <button
            onClick={() => setShowNewSkill(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            Kỹ năng mới
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4.5"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl" style={{ backgroundColor: `${stat.color}15` }}>
                  <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-extrabold text-white">{stat.value}</p>
                  <p className="text-[11px] text-slate-400 font-medium">{stat.label}</p>
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
            className="text-center py-20 px-4 bg-slate-900/30 border border-dashed border-slate-800 rounded-3xl"
          >
            <div className="w-20 h-20 rounded-3xl bg-slate-800/80 flex items-center justify-center mx-auto mb-5 shadow-inner">
              <Target className="w-10 h-10 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-200 mb-2">Chưa có kỹ năng nào</h3>
            <p className="text-slate-400 text-xs mb-6 max-w-md mx-auto leading-relaxed">
              Bạn có thể làm chủ bất kỳ kỹ năng mới nào (Đàn, Ngoại ngữ, Code, Vẽ, Diễn thuyết) chỉ sau 20 giờ thực hành tập trung. Hãy tạo mục tiêu đầu tiên ngay hôm nay!
            </p>
            <button
              onClick={() => setShowNewSkill(true)}
              className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4 inline mr-2" />
              Tạo Chiến Dịch Đầu Tiên
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
