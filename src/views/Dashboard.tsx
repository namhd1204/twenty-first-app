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
    { icon: Target, label: 'Đang rèn luyện', value: String(activeCount), tag: 'Mục tiêu' },
    { icon: Clock, label: 'Tổng giờ tích lũy', value: formatHours(totalHours), tag: 'Tích lũy' },
    { icon: TrendingUp, label: 'Đã hoàn thành 20h', value: String(completedCount), tag: 'Thuần thục' },
    { icon: Flame, label: 'Tổng chiến dịch', value: String(skills.length), tag: 'Chiến dịch' },
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-5xl mx-auto p-6 sm:p-8">
        {/* Swiss Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-6 border-b border-border">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-accent">Tổng quan thực hành</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mt-1">Bảng Điều Khiển</h1>
            <p className="text-muted-foreground mt-1 text-xs sm:text-sm max-w-xl">
              20 giờ thực hành tập trung có chủ đích theo phương pháp Josh Kaufman
            </p>
          </div>
          <button
            onClick={() => setShowNewSkill(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-accent hover:bg-accent/90 text-white font-semibold text-xs transition-colors shrink-0 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Kỹ năng mới</span>
          </button>
        </div>

        {/* Structured Metric Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-surface border border-border rounded-md p-4 relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  {stat.tag}
                </span>
                <stat.icon className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-foreground font-mono tracking-tight">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Section Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Danh sách chiến dịch</h2>
          <span className="text-xs text-muted-foreground font-mono">{skills.length} kỹ năng</span>
        </div>

        {/* Skills Grid */}
        {skills.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 px-4 bg-surface border border-dashed border-border rounded-md"
          >
            <div className="w-12 h-12 rounded-md bg-surface-hover border border-border flex items-center justify-center mx-auto mb-3">
              <Target className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-sm font-bold text-foreground mb-1">Chưa có kỹ năng nào</h3>
            <p className="text-muted-foreground text-xs mb-5 max-w-sm mx-auto leading-relaxed">
              Bạn có thể tiếp thu bất kỳ kỹ năng mới nào sau 20 giờ thực hành tập trung. Hãy tạo mục tiêu đầu tiên ngay hôm nay!
            </p>
            <button
              onClick={() => setShowNewSkill(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-accent hover:bg-accent/90 text-white font-semibold text-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
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
