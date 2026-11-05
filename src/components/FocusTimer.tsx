import { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, Square, Clock } from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { formatTimerDisplay, cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface FocusTimerProps {
  isOpen: boolean;
  skillId: string;
  skillName: string;
  skillColor: string;
  onClose: () => void;
}

export function FocusTimer({ isOpen, skillId, skillName, skillColor, onClose }: FocusTimerProps) {
  const { startTimer, completeSession } = useAppStore();
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [secondsLeft, setSecondsLeft] = useState(45 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Reflection state
  const [confidence, setConfidence] = useState(5);
  const [notes, setNotes] = useState('');
  const [emotion, setEmotion] = useState('');

  const audioRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const playChime = useCallback(() => {
    try {
      const ctx = new AudioContext();
      audioRef.current = ctx;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      oscillator.frequency.setValueAtTime(800, ctx.currentTime);
      oscillator.frequency.setValueAtTime(1000, ctx.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(1200, ctx.currentTime + 0.2);
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.2);
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 1.2);
    } catch {
      // Audio not supported in environment
    }
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setIsRunning(false);
      setIsPaused(false);
      setIsComplete(false);
      setSecondsLeft(durationMinutes * 60);
      setConfidence(5);
      setNotes('');
      setEmotion('');
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  }, [isOpen, durationMinutes]);

  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsComplete(true);
            playChime();
            if (intervalRef.current) clearInterval(intervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, isPaused, playChime]);

  const handleStart = () => {
    setSecondsLeft(durationMinutes * 60);
    setIsRunning(true);
    setIsPaused(false);
    startTimer(skillId, durationMinutes);
  };

  const handlePause = () => setIsPaused(!isPaused);

  const handleStop = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsComplete(true);
    setIsRunning(false);
  };

  const handleSaveReflection = async () => {
    await completeSession(confidence, notes, emotion);
    onClose();
  };

  const { minutes, seconds } = formatTimerDisplay(secondsLeft);
  const totalSeconds = durationMinutes * 60;
  const progressPercent = totalSeconds > 0 ? ((totalSeconds - secondsLeft) / totalSeconds) * 100 : 0;

  const presetDurations = [15, 25, 30, 45, 60];

  const emotions = [
    { emoji: '😤', label: 'Bối rối / Ức chế' },
    { emoji: '😐', label: 'Bình thường' },
    { emoji: '🙂', label: 'Khá ổn' },
    { emoji: '😊', label: 'Bớt lóng ngóng' },
    { emoji: '🤩', label: 'Rất trôi chảy' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 15 }}
            className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl p-7 sm:p-8 shadow-2xl relative overflow-hidden"
          >
            {!isComplete ? (
              <>
                {/* Header */}
                <div className="text-center mb-8">
                  <div
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-3 border border-current/20"
                    style={{ backgroundColor: `${skillColor}15`, color: skillColor }}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    {skillName}
                  </div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">Phiên Tập Trung Sâu</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Thực hành có chủ đích (Deliberate Practice) — Không xao nhãng
                  </p>
                </div>

                {/* Timer Display */}
                <div className="text-center mb-8">
                  <div className="relative inline-block">
                    <div
                      className={cn(
                        "text-7xl font-mono font-extrabold tracking-wider text-white",
                        isRunning && !isPaused && "timer-glow"
                      )}
                    >
                      {minutes}:{seconds}
                    </div>

                    {/* Progress bar under timer */}
                    <div className="mt-5 h-2 w-72 max-w-full mx-auto bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full transition-all duration-300"
                        style={{ backgroundColor: skillColor }}
                        animate={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Duration presets */}
                {!isRunning && (
                  <div className="flex justify-center gap-2 mb-8">
                    {presetDurations.map((d) => (
                      <button
                        key={d}
                        onClick={() => { setDurationMinutes(d); setSecondsLeft(d * 60); }}
                        className={cn(
                          'px-4 py-2 rounded-xl text-xs font-bold transition-all',
                          durationMinutes === d
                            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                            : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                        )}
                      >
                        {d} phút
                      </button>
                    ))}
                  </div>
                )}

                {/* Controls */}
                <div className="flex justify-center gap-3">
                  {!isRunning ? (
                    <>
                      <button
                        onClick={handleStart}
                        className="px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-600/25 transition-all hover:scale-105"
                      >
                        <Play className="w-4 h-4 fill-white" />
                        Bắt đầu tính giờ
                      </button>
                      <button
                        onClick={onClose}
                        className="px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition-colors"
                      >
                        Đóng
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handlePause}
                        className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm flex items-center gap-2 transition-colors border border-slate-700"
                      >
                        {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                        {isPaused ? 'Tiếp tục' : 'Tạm dừng'}
                      </button>
                      <button
                        onClick={handleStop}
                        className="px-6 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-semibold text-sm flex items-center gap-2 transition-colors"
                      >
                        <Square className="w-4 h-4" />
                        Dừng & Ghi nhận
                      </button>
                    </>
                  )}
                </div>
              </>
            ) : (
              /* ===== REFLECTION VIEW (VIỆT HÓA) ===== */
              <div>
                <div className="text-center mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-3 text-3xl">
                    🎉
                  </div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">Hoàn Thành Phiên Luyện!</h2>
                  <p className="text-slate-400 text-xs mt-1">
                    Xuất sắc! Dành 1 phút để đúc kết và tự sửa sai (Theo phương pháp Kaufman).
                  </p>
                </div>

                {/* Emotional / Clumsy Tracker */}
                <div className="mb-5">
                  <label className="block text-xs font-semibold text-slate-300 mb-2.5">
                    Hôm nay bạn cảm thấy thế nào? Đã bớt lóng ngóng/vụng về hơn chưa?
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {emotions.map((e) => (
                      <button
                        key={e.label}
                        type="button"
                        onClick={() => setEmotion(e.label)}
                        className={cn(
                          'flex flex-col items-center gap-1.5 p-2.5 rounded-xl transition-all border text-center',
                          emotion === e.label
                            ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-sm'
                            : 'bg-slate-800/80 border-slate-700/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                        )}
                      >
                        <span className="text-2xl">{e.emoji}</span>
                        <span className="text-[10px] font-medium leading-tight">{e.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Confidence Slider */}
                <div className="mb-5 bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-300">
                      Mức độ tự tin với kỹ năng này:
                    </span>
                    <span className="text-emerald-400 font-extrabold text-sm px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                      {confidence} / 10
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={confidence}
                    onChange={(e) => setConfidence(parseInt(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-medium">
                    <span>1 (Còn ngượng ngùng)</span>
                    <span>5 (Bắt đầu quen tay)</span>
                    <span>10 (Rất tự tin)</span>
                  </div>
                </div>

                {/* Self-Correction Notes */}
                <div className="mb-6">
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Điều gì chưa ổn hôm nay? Cần khắc phục gì cho lần tập tới?
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ví dụ: Chuyển ngón từ C sang G còn chậm, lần tới cần luyện riêng 5 phút chỉ bấm 2 hợp âm này..."
                    rows={3}
                    className="w-full px-4 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500 transition-colors resize-none leading-relaxed"
                  />
                </div>

                {/* Save Buttons */}
                <div className="flex gap-2.5">
                  <button
                    onClick={handleSaveReflection}
                    className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Lưu Nhật Ký & Hoàn Tất
                  </button>
                  <button
                    onClick={onClose}
                    className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 font-semibold text-xs transition-colors"
                  >
                    Bỏ qua
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
