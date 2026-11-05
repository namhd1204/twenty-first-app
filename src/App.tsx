import { useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './views/Dashboard';
import { SkillDetail } from './views/SkillDetail';
import { HistoryView } from './views/HistoryView';
import { SettingsView } from './views/SettingsView';
import { useAppStore } from './stores/appStore';

export function App() {
  const { currentView, loadSkills, loading } = useAppStore();

  useEffect(() => {
    loadSkills();
  }, [loadSkills]);

  return (
    <div className="flex h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-slate-950">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-slate-500 font-medium">Loading TwentyFirst...</p>
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
    </div>
  );
}

export default App;
