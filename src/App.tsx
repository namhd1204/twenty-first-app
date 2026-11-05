import { useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './views/Dashboard';
import { SkillDetail } from './views/SkillDetail';
import { HistoryView } from './views/HistoryView';
import { SettingsView } from './views/SettingsView';
import { useAppStore } from './stores/appStore';
import { Analytics } from '@vercel/analytics/react';

export function App() {
  const { currentView, loadSkills, loading } = useAppStore();

  useEffect(() => {
    loadSkills();
  }, [loadSkills]);

  return (
    <div className="flex h-screen w-screen bg-background text-foreground overflow-hidden font-sans selection:bg-accent selection:text-white">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-background">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-7 h-7 border-2 border-accent border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-muted-foreground font-medium tracking-tight">Đang tải TwentyFirst (20 Giờ)...</p>
            </div>
          </div>
        ) : (
          <>
            {currentView === 'dashboard' && <Dashboard />}
            {currentView === 'skill' && <SkillDetail />}
            {currentView === 'history' && <HistoryView />}
            {currentView === 'settings' && <SettingsView />}
          </>
        )}
      </main>
      <Analytics />
    </div>
  );
}

export default App;
