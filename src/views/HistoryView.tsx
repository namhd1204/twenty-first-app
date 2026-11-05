import { useEffect, useState } from 'react';
import { History as HistoryIcon, Clock, TrendingUp, Target, Flame } from 'lucide-react';
import { getAllSessions, type Session } from '../lib/database';
import { formatHours } from '../lib/utils';
import { motion } from 'framer-motion';

type SessionWithSkill = Session & { skill_name: string };

export function HistoryView() {
  const [sessions, setSessions] = useState<SessionWithSkill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      try {
        const data = await getAllSessions();
        setSessions(data);
      } catch (err) {
        console.error('Failed to load sessions:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  const totalMinutes = sessions.reduce((sum, s) => sum + s.duration_minutes, 0);
  const avgConfidence = sessions.filter(s => s.confidence_score !== null);
  const avgScore = avgConfidence.length > 0
    ? (avgConfidence.reduce((sum, s) => sum + (s.confidence_score || 0), 0) / avgConfidence.length).toFixed(1)
    : 'N/A';

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-5xl mx-auto p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Practice History & Analytics</h1>
          <p className="text-slate-400 mt-1">
            Complete timeline of all your deliberate practice sessions and self-reflection logs.
          </p>
        </div>

        {/* Global Analytics Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Clock className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Total Practice Logged</p>
              <p className="text-2xl font-bold text-white">{formatHours(totalMinutes / 60)}</p>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <Flame className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Completed Sessions</p>
              <p className="text-2xl font-bold text-white">{sessions.length}</p>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Avg Post-Practice Confidence</p>
              <p className="text-2xl font-bold text-white">{avgScore} / 10</p>
            </div>
          </div>
        </div>

        {/* Session Timeline */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <HistoryIcon className="w-5 h-5 text-emerald-400" />
            Master Log Timeline
          </h2>

          {loading ? (
            <p className="text-slate-500 text-sm py-8 text-center">Loading session history...</p>
          ) : sessions.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-medium">No sessions recorded yet.</p>
              <p className="text-xs mt-1">Start a practice session from any skill card on the Dashboard.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.map((session) => {
                const date = new Date(session.started_at);
                return (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0">
                        <Target className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-white">
                            {session.skill_name}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-medium">
                            {Math.round(session.duration_minutes)} min
                          </span>
                          {session.emotion && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                              {session.emotion}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {date.toLocaleDateString(undefined, {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}{' '}
                          at {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {session.confidence_score !== null && (
                        <div className="text-xs bg-slate-800 px-2.5 py-1 rounded-lg text-emerald-400 font-medium">
                          Confidence: {session.confidence_score}/10
                        </div>
                      )}
                      {session.notes && (
                        <p className="text-xs text-slate-400 italic max-w-xs truncate">
                          "{session.notes}"
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
