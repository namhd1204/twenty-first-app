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
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              ⏱️ Lịch Sử Thực Hành & Nhật Ký Cảm Xúc
            </h2>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Theo dõi thời lượng từng buổi, mức độ tự tin sau mỗi phiên và ghi chú tự sửa sai để cải thiện liên tục.
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
            {sessions.length} phiên đã ghi nhận
          </span>
        </div>

        {sessions.length === 0 ? (
          <div className="text-center py-12 px-4 bg-slate-950/40 rounded-xl border border-dashed border-slate-800">
            <Clock className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-400">Chưa có phiên luyện tập nào được lưu</p>
            <p className="text-xs text-slate-600 mt-1">
              Nhấn nút "Bắt đầu phiên luyện tập" ở trên để khởi động đồng hồ bấm giờ đầu tiên.
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
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              🏆 Bằng Chứng Cột Mốc 20 Giờ (Proof of Work)
            </h2>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Các mốc kiểm định tại Giờ 1, 5, 10, 15 và 20. Lưu lại kết quả, đường dẫn video/audio minh chứng cho sự bứt phá của bạn.
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
                {Math.round(session.duration_minutes)} phút thực hành
              </span>
              {session.emotion && (
                <span className="text-xs px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-slate-300">
                  {session.emotion}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {date.toLocaleDateString('vi-VN', { month: 'numeric', day: 'numeric', year: 'numeric' })} lúc{' '}
              {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {session.confidence_score !== null && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-bold">{session.confidence_score}/10</span>
              <span className="text-slate-400 hidden sm:inline">tự tin</span>
            </div>
          )}
          {session.notes && (
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5" />
              Ghi chú
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
                  Tự sửa sai & Đúc kết kinh nghiệm:
                </span>
                <p className="mt-1 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 text-slate-200 leading-relaxed">
                  {session.notes || 'Không có ghi chú thêm cho phiên này.'}
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
              'w-11 h-11 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 border',
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
              <span className="text-sm font-bold text-white">
                Cột mốc: Giờ {milestone.hour_mark}
              </span>
              {isAchieved && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <CheckCircle className="w-3 h-3" /> Đạt được
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {milestone.title || `Kiểm tra cột mốc tại mốc ${milestone.hour_mark} giờ`}
            </p>
          </div>
        </div>

        <div>
          {isUnlocked && (
            <button
              onClick={() => setEditing(true)}
              className={cn(
                'px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors',
                isAchieved
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              )}
            >
              {isAchieved ? 'Cập nhật bằng chứng' : 'Ghi nhận bằng chứng'}
            </button>
          )}
          {!isUnlocked && (
            <span className="text-xs text-slate-500 font-medium">Đang khóa</span>
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
                Bằng chứng Cột mốc Giờ thứ {milestone.hour_mark}
              </h3>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Ghi chép lại những gì bạn có thể thực hiện được mà trước đây không làm được. Có thể đính kèm liên kết clip video hoặc ghi âm kết quả.
              </p>

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ví dụ: Đã đánh trọn vẹn bài hát ở tempo 80 mà không vấp. Link video clip: https://youtube.com/..."
                rows={4}
                className="w-full px-4 py-3 bg-slate-800/90 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500 transition-colors resize-none mb-4 leading-relaxed"
                autoFocus
              />

              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setEditing(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSave}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
                >
                  Lưu bằng chứng cột mốc
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
