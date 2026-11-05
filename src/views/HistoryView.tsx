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
        console.error('Không thể tải lịch sử phiên:', err);
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
    : 'Chưa có';

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-5xl mx-auto p-6 sm:p-8 space-y-6">
        <div className="pb-4 border-b border-border">
          <span className="text-[10px] font-bold uppercase tracking-widest text-accent">Thống kê tích lũy</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mt-1">Lịch Sử & Thống Kê</h1>
          <p className="text-muted-foreground mt-1 text-xs sm:text-sm">
            Dòng thời gian toàn diện về các phiên rèn luyện có chủ đích và chỉ số tiến bộ.
          </p>
        </div>

        {/* Global Analytics Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-surface border border-border rounded-md p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-sm bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Tổng Thời Gian</p>
              <p className="text-xl sm:text-2xl font-bold text-foreground font-mono">{formatHours(totalMinutes / 60)}</p>
            </div>
          </div>

          <div className="bg-surface border border-border rounded-md p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-sm bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
              <Flame className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Phiên Đã Hoàn Thành</p>
              <p className="text-xl sm:text-2xl font-bold text-foreground font-mono">{sessions.length} phiên</p>
            </div>
          </div>

          <div className="bg-surface border border-border rounded-md p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-sm bg-warning/10 border border-warning/20 flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Độ Tự Tin TB</p>
              <p className="text-xl sm:text-2xl font-bold text-foreground font-mono">{avgScore} {avgScore !== 'Chưa có' && '/ 10'}</p>
            </div>
          </div>
        </div>

        {/* Session Timeline */}
        <div className="bg-surface border border-border rounded-md p-5 shadow-card">
          <h2 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
            <HistoryIcon className="w-4 h-4 text-accent" />
            <span>Nhật Ký Chi Tiết Từng Phiên</span>
          </h2>

          {loading ? (
            <p className="text-muted-foreground text-xs py-8 text-center font-mono">Đang tải lịch sử phiên...</p>
          ) : sessions.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <Clock className="w-6 h-6 mx-auto mb-1.5 opacity-50" />
              <p className="text-xs font-semibold text-foreground">Chưa ghi nhận phiên luyện tập nào.</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Bắt đầu bấm giờ từ thẻ kỹ năng ở màn hình Tổng quan.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {sessions.map((session) => {
                const date = new Date(session.started_at);
                return (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 rounded-md bg-background border border-border flex flex-col md:flex-row md:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-sm bg-surface-hover border border-border flex items-center justify-center shrink-0">
                        <Target className="w-4 h-4 text-accent" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold text-foreground">
                            {session.skill_name}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-xs bg-accent/10 text-accent font-semibold border border-accent/20">
                            {Math.round(session.duration_minutes)} phút
                          </span>
                          {session.emotion && (
                            <span className="text-[10px] px-2 py-0.5 rounded-xs bg-surface-hover border border-border text-foreground">
                              {session.emotion}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">
                          {date.toLocaleDateString('vi-VN', {
                            weekday: 'short',
                            month: 'numeric',
                            day: 'numeric',
                            year: 'numeric',
                          })}{' '}
                          lúc {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {session.confidence_score !== null && (
                        <div className="text-xs bg-surface-hover px-2.5 py-0.5 rounded-xs text-foreground font-mono font-medium border border-border">
                          Tự tin: {session.confidence_score}/10
                        </div>
                      )}
                      {session.notes && (
                        <p className="text-xs text-muted-foreground italic max-w-xs truncate">
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
