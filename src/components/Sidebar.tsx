import { LayoutDashboard, Target, History, Settings, Plus, ChevronRight } from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { cn, getProgressPercentage } from '../lib/utils';
import { motion } from 'framer-motion';

export function Sidebar() {
  const { currentView, setCurrentView, skills, activeSkillId, setActiveSkill } = useAppStore();

  const navItems = [
    { id: 'dashboard' as const, icon: LayoutDashboard, label: 'Tổng quan' },
    { id: 'history' as const, icon: History, label: 'Lịch sử & Thống kê' },
    { id: 'settings' as const, icon: Settings, label: 'Cài đặt & Phương pháp' },
  ];

  const handleSkillClick = (skillId: string) => {
    setActiveSkill(skillId);
    setCurrentView('skill');
  };

  return (
    <aside className="w-64 h-screen bg-slate-900/60 border-r border-slate-800 flex flex-col shrink-0">
      {/* Logo */}
      <div className="p-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-md shadow-emerald-500/20">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight">TwentyFirst</h1>
            <p className="text-[11px] text-emerald-400 font-medium">20 Giờ Làm Chủ Kỹ Năng</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="px-3 py-4 space-y-1">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
              currentView === item.id
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            )}
          >
            <item.icon className="w-[18px] h-[18px]" />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Skills List */}
      <div className="flex-1 px-3 overflow-y-auto">
        <div className="flex items-center justify-between px-3 py-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Kỹ năng đang luyện</span>
          <button
            onClick={() => {
              setCurrentView('dashboard');
              window.dispatchEvent(new CustomEvent('open-new-skill'));
            }}
            className="p-1 rounded-md text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors"
            title="Thêm kỹ năng mới"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-1 mt-1">
          {skills.map(skill => {
            const progress = getProgressPercentage(skill.logged_hours, skill.target_hours);
            const isActive = activeSkillId === skill.id && currentView === 'skill';
            return (
              <motion.button
                key={skill.id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => handleSkillClick(skill.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 group',
                  isActive
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                )}
              >
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: skill.color }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{skill.name}</p>
                  <div className="mt-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${progress}%`, backgroundColor: skill.color }}
                    />
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 text-slate-500" />
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800 text-center">
        <p className="text-[11px] text-slate-500">
          Cục bộ • Bảo mật • Offline 100%
        </p>
      </div>
    </aside>
  );
}
