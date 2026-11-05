import { useState } from 'react';
import { Clock, TrendingUp, MessageSquare, Award, ChevronDown, ChevronUp, CheckCircle, Sparkles } from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function PracticeTab() {
  const { sessions, milestones, activeSkillId, skills, updateMilestoneProof } = useAppStore();
  const skill = skills.find(s => s.id === activeSkillId);

  return (
    <div className="space-y-5">
      {/* Session History & Reflection Logs */}
      <div className="bg-surface border border-border rounded-md p-5 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-foreground flex items-center gap-2">
              Lịch Sử Thực Hành & Nhật Ký Cảm Xúc
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              Theo dõi thời lượng từng buổi, mức độ tự tin sau mỗi phiên và ghi chú tự sửa sai để cải thiện liên tục.
            </p>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-sm bg-surface-hover border border-border text-muted-foreground shrink-0 self-start sm:self-auto">
            {sessions.length} phiên đã lưu
          </span>
        </div>

        {sessions.length === 0 ? (
          <div className="text-center py-10 px-4 bg-background rounded-md border border-dashed border-border">
            <Clock className="w-6 h-6 text-muted-foreground mx-auto mb-1.5 opacity-60" />
            <p className="text-xs font-semibold text-foreground">Chưa có phiên luyện tập nào được lưu</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Nhấn nút "Bắt đầu Luyện tập" ở trên để khởi động đồng hồ bấm giờ đầu tiên.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {sessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        )}
      </div>

      {/* 20-Hour Milestone Proof */}
      <div className="bg-surface border border-border rounded-md p-5 shadow-card">
        <div className="mb-4">
          <h2 className="text-sm sm:text-base font-bold text-foreground flex items-center gap-2">
            Bằng Chứng Cột Mốc 20 Giờ (Proof of Work)
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
            Các mốc kiểm định tại Giờ 1, 5, 10, 15 và 20. Lưu lại kết quả, bài thu hoạch minh chứng cho sự bứt phá của bạn.
          </p>
        </div>

        <div className="space-y-2.5">
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
    <div className="bg-background border border-border rounded-md p-3.5 transition-colors hover:border-border-strong">
      <div
        className="flex items-center justify-between cursor-pointer select-none"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-sm bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4 text-accent" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-semibold text-foreground font-mono">
                {Math.round(session.duration_minutes)} phút
              </span>
              {session.emotion && (
                <span className="text-[11px] px-1.5 py-0.5 rounded-xs bg-surface-hover border border-border text-foreground">
                  {session.emotion}
                </span>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">
              {date.toLocaleDateString('vi-VN', { month: 'numeric', day: 'numeric', year: 'numeric' })} lúc{' '}
              {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {session.confidence_score !== null && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-xs bg-accent/10 border border-accent/20 text-xs font-mono">
              <TrendingUp className="w-3 h-3 text-accent" />
              <span className="text-accent font-bold">{session.confidence_score}/10</span>
            </div>
          )}
          {session.notes && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5" />
            </span>
          )}
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
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
            <div className="mt-3 pt-3 border-t border-border text-xs space-y-1.5">
              <span className="font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                Tự sửa sai & Đúc kết kinh nghiệm:
              </span>
              <p className="p-2.5 rounded-md bg-surface border border-border text-foreground leading-relaxed">
                {session.notes || 'Không có ghi chú thêm cho phiên này.'}
              </p>
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
        'p-3.5 rounded-md border transition-colors',
        isAchieved
          ? 'bg-success-subtle border-success-border'
          : isUnlocked
          ? 'bg-surface border-border hover:border-border-strong'
          : 'bg-surface/40 border-border opacity-50'
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'w-9 h-9 rounded-sm flex items-center justify-center font-bold text-xs shrink-0 border font-mono',
              isAchieved
                ? 'bg-success/20 text-success border-success/40'
                : isUnlocked
                ? 'bg-accent/20 text-accent border-accent/40'
                : 'bg-surface-hover text-muted-foreground border-border'
            )}
          >
            {isAchieved ? <Award className="w-4 h-4" /> : `${milestone.hour_mark}h`}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-foreground">
                Cột mốc: Giờ {milestone.hour_mark}
              </span>
              {isAchieved && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-success px-1.5 py-0.5 rounded-xs bg-success/15 border border-success/25">
                  <CheckCircle className="w-3 h-3" /> Đạt được
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {milestone.title || `Kiểm tra cột mốc tại mốc ${milestone.hour_mark} giờ`}
            </p>
          </div>
        </div>

        <div className="shrink-0 self-start sm:self-auto">
          {isUnlocked && (
            <button
              onClick={() => setEditing(true)}
              className={cn(
                'px-3 py-1.5 rounded-md text-xs font-semibold transition-colors',
                isAchieved
                  ? 'bg-surface-hover hover:bg-surface-active text-foreground border border-border'
                  : 'bg-accent hover:bg-accent/90 text-white'
              )}
            >
              {isAchieved ? 'Cập nhật bằng chứng' : 'Ghi nhận bằng chứng'}
            </button>
          )}
          {!isUnlocked && (
            <span className="text-xs text-muted-foreground font-mono">Đang khóa</span>
          )}
        </div>
      </div>

      {milestone.notes && (
        <div className="mt-2.5 pt-2.5 border-t border-border text-xs text-foreground flex items-start gap-2 bg-background p-2.5 rounded-md">
          <Sparkles className="w-3.5 h-3.5 text-warning mt-0.5 shrink-0" />
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            onClick={() => setEditing(false)}
          >
            <motion.div
              initial={{ scale: 0.98, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.98, y: 10 }}
              className="bg-surface border border-border rounded-lg p-5 w-full max-w-lg shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-base font-bold text-foreground mb-1">
                Bằng chứng Cột mốc Giờ thứ {milestone.hour_mark}
              </h3>
              <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                Ghi chép lại những gì bạn có thể thực hiện được mà trước đây không làm được.
              </p>

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ví dụ: Đã đánh trọn vẹn bài hát ở tempo 80 mà không vấp..."
                rows={4}
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground text-xs focus-visible:outline-2 focus-visible:outline-accent transition-colors resize-none mb-3 leading-relaxed"
                autoFocus
              />

              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setEditing(false)}
                  className="px-3.5 py-1.5 rounded-md bg-surface-hover hover:bg-surface-active text-muted-foreground hover:text-foreground text-xs font-semibold transition-colors border border-border"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-1.5 rounded-md bg-accent hover:bg-accent/90 text-white text-xs font-semibold transition-colors"
                >
                  Lưu bằng chứng
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
