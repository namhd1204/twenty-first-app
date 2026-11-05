import { useState } from 'react';
import { Clock, TrendingUp, MessageSquare, Award, ChevronDown, ChevronUp, CheckCircle, Sparkles } from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function PracticeTab() {
  const { sessions, milestones, activeSkillId, skills, updateMilestoneProof } = useAppStore();
  const skill = skills.find(s => s.id === activeSkillId);

  return (
    <div className="space-y-6">
      {/* Session History & Reflection Logs */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              ⏱️ Practice Sessions & Emotional Feedback
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Review your deliberate practice duration, post-session confidence, and self-correction notes.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-400">
            {sessions.length} sessions logged
          </span>
        </div>

        {sessions.length === 0 ? (
          <div className="text-center py-12 px-4 bg-slate-950/40 rounded-xl border border-dashed border-slate-800">
            <Clock className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm text-slate-400 font-medium">No sessions logged yet</p>
            <p className="text-xs text-slate-600 mt-1">
              Click the "Practice Now" button above to launch your first focus session.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        )}
      </div>

      {/* 20-Hour Milestone Proof */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              🏆 Kaufman 20-Hour Milestone Proof of Work
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Milestone checkpoints at Hour 1, 5, 10, 15, and 20. Log audio/video URLs or reflection summaries to document your breakthrough.
            </p>
          </div>
        </div>

        <div className="space-y-3 mt-4">
          {milestones.map((milestone) => {
            const isUnlocked = skill && skill.logged_hours >= milestone.hour_mark;
            return (
              <MilestoneCard
                key={milestone.id}
                milestone={milestone}
                isUnlocked={!!isUnlocked}
                onSave={(notes, proofType, proofData) =>
                  updateMilestoneProof(milestone.id, notes, proofType, proofData)
                }
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SessionCard({
  session,
}: {
  session: {
    id: string;
    duration_minutes: number;
    started_at: string;
    confidence_score: number | null;
    notes: string;
    emotion: string;
  };
}) {
  const [expanded, setExpanded] = useState(false);
  const date = new Date(session.started_at);

  return (
    <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-4 transition-all hover:border-slate-700">
      <div
        className="flex items-center justify-between cursor-pointer select-none"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white">
                {Math.round(session.duration_minutes)} min Practice
              </span>
              {session.emotion && (
                <span className="text-xs px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-slate-300">
                  {session.emotion}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} at{' '}
              {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {session.confidence_score !== null && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">{session.confidence_score}/10</span>
              <span className="text-slate-400 hidden sm:inline">confidence</span>
            </div>
          )}
          {session.notes && (
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5" />
              Notes
            </span>
          )}
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-slate-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-500" />
          )}
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 pt-3 border-t border-slate-800 text-xs text-slate-300 space-y-2">
              <div>
                <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                  Self-Correction & Insights:
                </span>
                <p className="mt-1 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 text-slate-200 leading-relaxed">
                  {session.notes || 'No specific notes recorded for this session.'}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MilestoneCard({
  milestone,
  isUnlocked,
  onSave,
}: {
  milestone: {
    id: string;
    hour_mark: number;
    title: string;
    notes: string;
    achieved_at: string | null;
    proof_data: string;
  };
  isUnlocked: boolean;
  onSave: (notes: string, proofType: string, proofData: string) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [notes, setNotes] = useState(milestone.notes);
  const isAchieved = !!milestone.achieved_at;

  const handleSave = async () => {
    await onSave(notes, 'text', notes);
    setEditing(false);
  };

  return (
    <div
      className={cn(
        'p-4 rounded-xl border transition-all',
        isAchieved
          ? 'bg-emerald-500/5 border-emerald-500/30'
          : isUnlocked
          ? 'bg-slate-900/90 border-slate-700/80 hover:border-emerald-500/50'
          : 'bg-slate-900/40 border-slate-800/50 opacity-60'
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div
            className={cn(
              'w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 border',
              isAchieved
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                : isUnlocked
                ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40'
                : 'bg-slate-800 text-slate-500 border-slate-700'
            )}
          >
            {isAchieved ? <Award className="w-5 h-5" /> : `${milestone.hour_mark}h`}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white">
                Milestone: Hour {milestone.hour_mark}
              </span>
              {isAchieved && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <CheckCircle className="w-3 h-3" /> Done
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {milestone.title || `Milestone Checkpoint at ${milestone.hour_mark} hours`}
            </p>
          </div>
        </div>

        <div>
          {isUnlocked && (
            <button
              onClick={() => setEditing(true)}
              className={cn(
                'px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors',
                isAchieved
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              )}
            >
              {isAchieved ? 'Update Proof' : 'Log Proof of Work'}
            </button>
          )}
          {!isUnlocked && (
            <span className="text-xs text-slate-500 font-medium">Locked</span>
          )}
        </div>
      </div>

      {milestone.notes && (
        <div className="mt-3 pt-3 border-t border-slate-800/80 text-xs text-slate-300 flex items-start gap-2 bg-slate-950/40 p-2.5 rounded-lg">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
          <p className="leading-relaxed">{milestone.notes}</p>
        </div>
      )}

      {/* Proof Editor Modal */}
      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setEditing(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-white mb-1">
                Hour {milestone.hour_mark} Proof of Work
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Record what you can execute now that you couldn't at Hour 0. You can also paste audio/video links or audio clip references.
              </p>

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g., Can play 4 chords fluently at 60 bpm. Recorded video link: https://youtube.com/..."
                rows={4}
                className="w-full px-4 py-3 bg-slate-800/90 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 transition-colors resize-none mb-4"
                autoFocus
              />

              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setEditing(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors"
                >
                  Save Milestone Proof
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
