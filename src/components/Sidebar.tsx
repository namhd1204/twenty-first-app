import { LayoutDashboard, Target, History, Settings, Plus, ChevronRight } from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { cn, getProgressPercentage } from '../lib/utils';

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
    <aside className="w-64 h-screen bg-surface border-r border-border flex flex-col shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-sm bg-accent flex items-center justify-center text-white shrink-0">
            <Target className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm font-bold text-foreground tracking-tight leading-none">TwentyFirst</h1>
            <p className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground mt-1">20 Giờ Làm Chủ</p>
          </div>
        </div>
      </div>

      {/* Primary Navigation */}
      <nav className="p-2 space-y-0.5">
        {navItems.map(item => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={cn(
                'w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors duration-150 text-left',
                isActive
                  ? 'bg-surface-hover text-foreground font-semibold shadow-xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-surface-hover'
              )}
            >
              <item.icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-accent' : 'text-muted-foreground')} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Skills Section */}
      <div className="flex-1 px-2 py-3 overflow-y-auto border-t border-border">
        <div className="flex items-center justify-between px-2 mb-1.5">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Kỹ năng đang luyện</span>
          <button
            onClick={() => {
              setCurrentView('dashboard');
              window.dispatchEvent(new CustomEvent('open-new-skill'));
            }}
            className="p-1 rounded-xs text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-colors"
            title="Thêm kỹ năng mới"
            aria-label="Thêm kỹ năng mới"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="space-y-0.5">
          {skills.length === 0 ? (
            <p className="text-[11px] text-muted-foreground px-2 py-3 italic">Chưa có kỹ năng nào.</p>
          ) : (
            skills.map(skill => {
              const progress = getProgressPercentage(skill.logged_hours, skill.target_hours);
              const isActive = activeSkillId === skill.id && currentView === 'skill';
              return (
                <button
                  key={skill.id}
                  onClick={() => handleSkillClick(skill.id)}
                  className={cn(
                    'w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-left transition-colors duration-150 group',
                    isActive
                      ? 'bg-surface-hover text-foreground font-semibold'
                      : 'text-muted-foreground hover:text-foreground hover:bg-surface-hover'
                  )}
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: skill.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate leading-tight text-foreground">{skill.name}</p>
                    <div className="mt-1 h-1 bg-border rounded-xs overflow-hidden">
                      <div
                        className="h-full rounded-xs transition-all duration-300"
                        style={{ width: `${progress}%`, backgroundColor: skill.color }}
                      />
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 text-muted-foreground" />
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border text-center">
        <p className="text-[10px] font-medium tracking-wider uppercase text-muted-foreground">
          Cục bộ • Bảo mật • Offline
        </p>
      </div>
    </aside>
  );
}
