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

  const handleCloseModal = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);
    setIsPaused(false);
    setIsComplete(false);
    onClose();
  };

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
    handleCloseModal();
  };

  const { minutes, seconds } = formatTimerDisplay(secondsLeft);
  const totalSeconds = durationMinutes * 60;
  const progressPercent = totalSeconds > 0 ? ((totalSeconds - secondsLeft) / totalSeconds) * 100 : 0;

  const presetDurations = [15, 25, 30, 45, 60];

  const emotions = [
    { emoji: '😤', label: 'Bối rối' },
    { emoji: '😐', label: 'Bình thường' },
    { emoji: '🙂', label: 'Khá ổn' },
    { emoji: '😊', label: 'Bớt lúng túng' },
    { emoji: '🤩', label: 'Trôi chảy' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            transition={{ duration: 0.15 }}
            className="w-full max-w-lg bg-surface border border-border rounded-lg p-6 sm:p-8 shadow-2xl relative overflow-hidden"
          >
            {!isComplete ? (
              <>
                {/* Header */}
                <div className="text-center mb-6">
                  <div
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm text-xs font-semibold mb-2.5 border"
                    style={{
                      borderColor: 'var(--border)',
                      backgroundColor: 'var(--surface-hover)',
                      color: skillColor,
                    }}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>{skillName}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">Phiên Tập Trung Sâu</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Thực hành có chủ đích (Deliberate Practice) — Không xao nhãng
                  </p>
                </div>

                {/* Swiss Tabular Timer Display */}
                <div className="text-center mb-6 py-4 bg-background border border-border rounded-md">
                  <div className="relative inline-block">
                    <div
                      className={cn(
                        "text-6xl sm:text-7xl font-mono font-bold tracking-tight text-foreground select-none",
                        isRunning && !isPaused && "timer-active"
                      )}
                    >
                      {minutes}:{seconds}
                    </div>

                    {/* Minimal Progress bar under timer */}
                    <div className="mt-4 h-1.5 w-64 max-w-full mx-auto bg-border rounded-xs overflow-hidden">
                      <motion.div
                        className="h-full rounded-xs transition-all duration-300"
                        style={{ backgroundColor: skillColor }}
                        animate={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Duration presets */}
                {!isRunning && (
                  <div className="flex justify-center gap-1.5 mb-6">
                    {presetDurations.map((d) => (
                      <button
                        key={d}
                        onClick={() => { setDurationMinutes(d); setSecondsLeft(d * 60); }}
                        className={cn(
                          'px-3 py-1.5 rounded-md text-xs font-semibold transition-colors',
                          durationMinutes === d
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-surface-hover text-muted-foreground hover:text-foreground border border-border'
                        )}
                      >
                        {d} phút
                      </button>
                    ))}
                  </div>
                )}

                {/* Controls */}
                <div className="flex justify-center gap-2 pt-2 border-t border-border">
                  {!isRunning ? (
                    <>
                      <button
                        onClick={handleStart}
                        className="px-6 py-2.5 rounded-md bg-accent hover:bg-accent/90 text-white font-semibold text-xs flex items-center gap-2 transition-colors"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        Bắt đầu tính giờ
                      </button>
                      <button
                        onClick={handleCloseModal}
                        className="px-4 py-2.5 rounded-md bg-surface-hover hover:bg-surface-active text-foreground font-semibold text-xs transition-colors border border-border"
                      >
                        Đóng
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handlePause}
                        className="px-5 py-2 rounded-md bg-surface-hover hover:bg-surface-active text-foreground font-semibold text-xs flex items-center gap-2 transition-colors border border-border"
                      >
                        {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                        {isPaused ? 'Tiếp tục' : 'Tạm dừng'}
                      </button>
                      <button
                        onClick={handleStop}
                        className="px-5 py-2 rounded-md bg-danger/10 hover:bg-danger/20 text-danger border border-danger/30 font-semibold text-xs flex items-center gap-2 transition-colors"
                      >
                        <Square className="w-3.5 h-3.5" />
                        Dừng & Ghi nhận
                      </button>
                    </>
                  )}
                </div>
              </>
            ) : (
              /* ===== REFLECTION VIEW ===== */
              <div>
                <div className="text-center mb-5 pb-4 border-b border-border">
                  <h2 className="text-xl font-bold text-foreground tracking-tight">Hoàn Thành Phiên Luyện!</h2>
                  <p className="text-muted-foreground text-xs mt-1">
                    Dành 1 phút để đúc kết và tự sửa sai theo phương pháp Josh Kaufman.
                  </p>
                </div>

                {/* Emotional / Clumsy Tracker */}
                <div className="mb-4">
                  <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                    Cảm nhận sau phiên tập:
                  </label>
                  <div className="grid grid-cols-5 gap-1.5">
                    {emotions.map((e) => (
                      <button
                        key={e.label}
                        type="button"
                        onClick={() => setEmotion(e.label)}
                        className={cn(
                          'flex flex-col items-center gap-1 p-2 rounded-md transition-colors border text-center',
                          emotion === e.label
                            ? 'bg-accent/10 border-accent text-foreground font-semibold'
                            : 'bg-background border-border text-muted-foreground hover:bg-surface-hover hover:text-foreground'
                        )}
                      >
                        <span className="text-xl">{e.emoji}</span>
                        <span className="text-[10px] leading-tight">{e.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Confidence Slider */}
                <div className="mb-4 bg-background p-3.5 rounded-md border border-border">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-foreground">
                      Mức độ tự tin với kỹ năng này:
                    </span>
                    <span className="text-accent font-mono font-bold text-xs px-2 py-0.5 rounded-xs bg-accent/10 border border-accent/20">
                      {confidence} / 10
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={confidence}
                    onChange={(e) => setConfidence(parseInt(e.target.value))}
                    className="w-full accent-accent cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground mt-1 font-mono">
                    <span>1 (Còn vụng về)</span>
                    <span>5 (Bắt đầu quen)</span>
                    <span>10 (Rất tự tin)</span>
                  </div>
                </div>

                {/* Self-Correction Notes */}
                <div className="mb-5">
                  <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                    Ghi chú tự sửa sai cho lần tập tới:
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ví dụ: Chuyển ngón từ C sang G còn chậm, lần tới cần luyện riêng 5 phút chỉ bấm 2 hợp âm này..."
                    rows={3}
                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground text-xs focus-visible:outline-2 focus-visible:outline-accent transition-colors resize-none leading-relaxed"
                  />
                </div>

                {/* Save Buttons */}
                <div className="flex gap-2 justify-end pt-3 border-t border-border">
                  <button
                    onClick={handleCloseModal}
                    className="px-4 py-2 rounded-md bg-surface-hover hover:bg-surface-active text-muted-foreground hover:text-foreground font-semibold text-xs transition-colors border border-border"
                  >
                    Bỏ qua
                  </button>
                  <button
                    onClick={handleSaveReflection}
                    className="px-5 py-2 rounded-md bg-accent hover:bg-accent/90 text-white font-semibold text-xs transition-colors"
                  >
                    Lưu Nhật Ký & Hoàn Tất
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
