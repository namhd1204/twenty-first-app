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
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1);
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 1);
    } catch {
      // Audio not supported
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
    { emoji: '😤', label: 'Frustrated' },
    { emoji: '😐', label: 'Neutral' },
    { emoji: '🙂', label: 'Okay' },
    { emoji: '😊', label: 'Good' },
    { emoji: '🤩', label: 'Amazing' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-8 shadow-2xl"
          >
            {!isComplete ? (
              <>
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-3"
                    style={{ backgroundColor: `${skillColor}20`, color: skillColor }}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    {skillName}
                  </div>
                  <h2 className="text-2xl font-bold text-white">Focus Session</h2>
                </div>

                {/* Timer Display */}
                <div className="text-center mb-8">
                  <div className="relative inline-block">
                    <div className={cn(
                      "text-7xl font-mono font-bold tracking-wider text-white",
                      isRunning && !isPaused && "timer-glow"
                    )}>
                      {minutes}:{seconds}
                    </div>
                    {/* Progress bar under timer */}
                    <div className="mt-4 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: skillColor }}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                </div>

                {/* Duration presets (only shown before starting) */}
                {!isRunning && (
                  <div className="flex justify-center gap-2 mb-8">
                    {presetDurations.map((d) => (
                      <button
                        key={d}
                        onClick={() => { setDurationMinutes(d); setSecondsLeft(d * 60); }}
                        className={cn(
                          'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                          durationMinutes === d
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                        )}
                      >
                        {d}m
                      </button>
                    ))}
                  </div>
                )}

                {/* Controls */}
                <div className="flex justify-center gap-4">
                  {!isRunning ? (
                    <>
                      <button
                        onClick={handleStart}
                        className="px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-2 transition-colors"
                      >
                        <Play className="w-5 h-5" />
                        Start
                      </button>
                      <button
                        onClick={onClose}
                        className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handlePause}
                        className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium flex items-center gap-2 transition-colors"
                      >
                        {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                        {isPaused ? 'Resume' : 'Pause'}
                      </button>
                      <button
                        onClick={handleStop}
                        className="px-6 py-3 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-400 font-medium flex items-center gap-2 transition-colors"
                      >
                        <Square className="w-5 h-5" />
                        End Early
                      </button>
                    </>
                  )}
                </div>
              </>
            ) : (
              /* ===== REFLECTION VIEW ===== */
              <div>
                <div className="text-center mb-6">
                  <div className="text-4xl mb-3">🎯</div>
                  <h2 className="text-2xl font-bold text-white mb-1">Session Complete!</h2>
                  <p className="text-slate-400 text-sm">
                    Great work! Take a moment to reflect.
                  </p>
                </div>

                {/* Emotion picker */}
                <div className="mb-5">
                  <label className="block text-sm font-medium text-slate-300 mb-3">
                    How do you feel? Do you feel less clumsy today?
                  </label>
                  <div className="flex justify-center gap-3">
                    {emotions.map((e) => (
                      <button
                        key={e.label}
                        onClick={() => setEmotion(e.label)}
                        className={cn(
                          'flex flex-col items-center gap-1 p-3 rounded-xl transition-all',
                          emotion === e.label
                            ? 'bg-slate-700 ring-2 ring-emerald-500'
                            : 'bg-slate-800 hover:bg-slate-700'
                        )}
                      >
                        <span className="text-2xl">{e.emoji}</span>
                        <span className="text-[10px] text-slate-400">{e.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Confidence Slider */}
                <div className="mb-5">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Confidence Score: <span className="text-emerald-400 font-bold">{confidence}/10</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={confidence}
                    onChange={(e) => setConfidence(parseInt(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-600 mt-1">
                    <span>Beginner</span>
                    <span>Confident</span>
                  </div>
                </div>

                {/* Notes */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    What went wrong? What to fix next time?
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Quick notes about this session..."
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                  />
                </div>

                {/* Save buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleSaveReflection}
                    className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors"
                  >
                    Save & Close
                  </button>
                  <button
                    onClick={onClose}
                    className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 font-medium transition-colors"
                  >
                    Skip
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
