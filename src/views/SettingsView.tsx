import { Palette, Sparkles, HardDrive } from 'lucide-react';

export function SettingsView() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Application Settings</h1>
          <p className="text-slate-400 mt-1">
            Local-first configuration and framework insights for TwentyFirst (20Hours).
          </p>
        </div>

        <div className="space-y-4">
          {/* Josh Kaufman Principle Box */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              About Josh Kaufman's 20-Hour Rule
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              The "10,000-Hour Rule" applies to reaching elite world-class expert status. Josh Kaufman discovered that going from <strong>knowing nothing</strong> to <strong>performing noticeably well</strong> takes just <strong>20 hours</strong> of focused, deliberate practice.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <span className="font-semibold text-emerald-400">1. Deconstruct:</span>
                <p className="text-slate-400 mt-0.5">Identify the critical 20% of sub-skills that yield 80% of real results.</p>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <span className="font-semibold text-indigo-400">2. Learn Enough:</span>
                <p className="text-slate-400 mt-0.5">Collect 3–5 resources to self-correct during practice, not to procrastinate.</p>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <span className="font-semibold text-amber-400">3. Remove Barriers:</span>
                <p className="text-slate-400 mt-0.5">Pre-remove physical friction and emotional distractions before each session.</p>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <span className="font-semibold text-rose-400">4. Practice 20 Hours:</span>
                <p className="text-slate-400 mt-0.5">Commit to pushing through the initial frustration barrier without giving up.</p>
              </div>
            </div>
          </div>

          {/* Local SQLite Database Info */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-emerald-400" />
              Local-First Database & Storage
            </h2>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              TwentyFirst stores 100% of your data locally in an embedded SQLite database (`twentyfirst.db`). No servers, no accounts required, no tracking. Your practice history is completely private.
            </p>
            <div className="flex items-center gap-3 text-xs">
              <span className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 font-mono">
                Engine: SQLite 3 via Tauri Plugin SQL
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium">
                Offline Ready
              </span>
            </div>
          </div>

          {/* Theme & Aesthetics */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Palette className="w-5 h-5 text-indigo-400" />
              Display & Appearance
            </h2>
            <p className="text-xs text-slate-400 mb-3">
              Dark mode optimized by default (`slate-950` / `zinc-900` palette) with ambient glow indicators for deep focus.
            </p>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-slate-950 border border-slate-700"></div>
              <div className="w-6 h-6 rounded-full bg-slate-900 border border-slate-700"></div>
              <div className="w-6 h-6 rounded-full bg-emerald-500"></div>
              <div className="w-6 h-6 rounded-full bg-indigo-500"></div>
              <div className="w-6 h-6 rounded-full bg-amber-500"></div>
              <span className="text-xs text-slate-500 ml-2">Minimalist Modern Dark Palette</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
