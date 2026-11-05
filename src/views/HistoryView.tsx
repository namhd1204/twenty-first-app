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
      <div className="max-w-5xl mx-auto p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Lịch Sử & Thống Kê</h1>
          <p className="text-slate-400 mt-1 text-sm">
            Dòng thời gian toàn diện về các phiên rèn luyện có chủ đích và chỉ số tiến bộ cảm xúc.
          </p>
        </div>

        {/* Global Analytics Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Clock className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Tổng Thời Gian Thực Hành</p>
              <p className="text-2xl font-bold text-white">{formatHours(totalMinutes / 60)}</p>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <Flame className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Số Phiên Đã Hoàn Thành</p>
              <p className="text-2xl font-bold text-white">{sessions.length} phiên</p>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Độ Tự Tin Trung Bình</p>
              <p className="text-2xl font-bold text-white">{avgScore} {avgScore !== 'Chưa có' && '/ 10'}</p>
            </div>
          </div>
        </div>

        {/* Session Timeline */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <HistoryIcon className="w-4 h-4 text-emerald-400" />
            Nhật Ký Chi Tiết Từng Phiên
          </h2>

          {loading ? (
            <p className="text-slate-500 text-xs py-8 text-center">Đang tải lịch sử phiên...</p>
          ) : sessions.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-semibold text-slate-400">Chưa ghi nhận phiên luyện tập nào.</p>
              <p className="text-xs text-slate-600 mt-1">Bắt đầu bấm giờ từ thẻ kỹ năng ở màn hình Tổng quan.</p>
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
                          <span className="text-sm font-bold text-white">
                            {session.skill_name}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                            {Math.round(session.duration_minutes)} phút
                          </span>
                          {session.emotion && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                              {session.emotion}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
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

                    <div className="flex items-center gap-3">
                      {session.confidence_score !== null && (
                        <div className="text-xs bg-slate-800/80 px-2.5 py-1 rounded-lg text-emerald-400 font-medium border border-slate-700">
                          Tự tin: {session.confidence_score}/10
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
