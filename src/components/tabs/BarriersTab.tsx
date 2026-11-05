import { useState } from 'react';
import { Plus, Trash2, CheckSquare, Square, RotateCcw, ShieldCheck, Sparkles } from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function BarriersTab() {
  const { barriers, addBarrier, toggleBarrier, removeBarrier, resetBarriers } = useAppStore();
  const [newLabel, setNewLabel] = useState('');
  const [showInput, setShowInput] = useState(false);

  const handleAdd = async () => {
    if (!newLabel.trim()) return;
    await addBarrier(newLabel.trim());
    setNewLabel('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAdd();
    if (e.key === 'Escape') { setShowInput(false); setNewLabel(''); }
  };

  const allChecked = barriers.length > 0 && barriers.every(b => b.is_checked);
  const checkedCount = barriers.filter(b => b.is_checked).length;

  return (
    <div className="space-y-5">
      {/* Header Info */}
      <div className="bg-surface border border-border rounded-md p-5 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-foreground flex items-center gap-2">
              Trụ cột 3: Loại Bỏ Rào Cản (Barrier Removal Checklist)
            </h2>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Triệt tiêu mọi lực ma sát về môi trường, thiết bị và tâm lý trước khi ngồi vào bàn luyện tập.
            </p>
          </div>
          <div className="flex gap-1.5 shrink-0 self-start sm:self-auto">
            <button
              onClick={resetBarriers}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-surface-hover hover:bg-surface-active text-xs text-muted-foreground hover:text-foreground transition-colors border border-border font-medium"
              title="Đặt lại toàn bộ danh sách về trạng thái chưa đánh dấu"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Đặt lại</span>
            </button>
            <button
              onClick={() => setShowInput(!showInput)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-surface-hover hover:bg-surface-active text-xs text-foreground font-semibold transition-colors border border-border"
            >
              <Plus className="w-3.5 h-3.5 text-accent" />
              <span>Thêm mục</span>
            </button>
          </div>
        </div>

        {/* Readiness Alert */}
        {allChecked && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3.5 rounded-md bg-success-subtle border border-success-border flex items-center gap-3"
          >
            <ShieldCheck className="w-5 h-5 text-success shrink-0" />
            <div>
              <p className="text-xs font-bold text-success uppercase tracking-wider">
                Môi trường sẵn sàng 100%!
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Mọi rào cản và yếu tố xao nhãng đã được dọn sạch. Bạn có thể bắt đầu tính giờ thực hành ngay!
              </p>
            </div>
          </motion.div>
        )}

        {/* Progress indicator */}
        {barriers.length > 0 && !allChecked && (
          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground bg-background px-3 py-2 rounded-md border border-border">
            <span>Tiến độ dọn dẹp trước phiên:</span>
            <span className="font-semibold text-foreground font-mono">{checkedCount} / {barriers.length} sẵn sàng</span>
          </div>
        )}

        {/* Add input */}
        <AnimatePresence>
          {showInput && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mt-4 pt-4 border-t border-border"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder='Ví dụ: "Điện thoại bật chế độ Không làm phiền", "Đàn đã chỉnh dây"...'
                  className="flex-1 px-3 py-2 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground text-xs focus-visible:outline-2 focus-visible:outline-accent transition-colors"
                  autoFocus
                />
                <button
                  onClick={handleAdd}
                  disabled={!newLabel.trim()}
                  className="px-4 py-2 rounded-md bg-accent hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-xs transition-colors shrink-0"
                >
                  Thêm
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Checklist items */}
      <div className="space-y-1.5">
        <AnimatePresence>
          {barriers.map((barrier) => (
            <motion.div
              key={barrier.id}
              layout
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              onClick={() => toggleBarrier(barrier.id)}
              className={cn(
                'flex items-center gap-3 px-3.5 py-3 rounded-md border transition-colors cursor-pointer group select-none',
                barrier.is_checked
                  ? 'bg-success-subtle border-success-border'
                  : 'bg-surface border-border hover:border-border-strong'
              )}
            >
              <button
                type="button"
                className="shrink-0 text-muted-foreground hover:text-success transition-colors"
                aria-label={barrier.is_checked ? 'Đánh dấu chưa hoàn thành' : 'Đánh dấu đã hoàn thành'}
              >
                {barrier.is_checked ? (
                  <CheckSquare className="w-4 h-4 text-success" />
                ) : (
                  <Square className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
                )}
              </button>

              <span
                className={cn(
                  'flex-1 text-xs font-medium transition-colors',
                  barrier.is_checked ? 'text-success line-through' : 'text-foreground'
                )}
              >
                {barrier.label}
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeBarrier(barrier.id);
                }}
                className="shrink-0 p-1 rounded text-muted-foreground hover:text-danger opacity-0 group-hover:opacity-100 transition-opacity"
                title="Xóa mục này"
                aria-label="Xóa mục kiểm tra"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {barriers.length === 0 && !showInput && (
        <div className="text-center py-12 px-4 bg-surface border border-dashed border-border rounded-md">
          <Sparkles className="w-8 h-8 text-accent mx-auto mb-2 opacity-60" />
          <p className="text-xs font-bold text-foreground mb-1">Chưa có danh mục rào cản</p>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto mb-4 leading-relaxed">
            Tạo các danh mục chuẩn bị trước giờ tập như "Uống đủ nước", "Đóng cửa phòng", "Tắt thông báo".
          </p>
          <button
            onClick={() => setShowInput(true)}
            className="px-3.5 py-1.5 rounded-md bg-accent hover:bg-accent/90 text-white text-xs font-semibold transition-colors"
          >
            Thêm mục kiểm tra đầu tiên
          </button>
        </div>
      )}
    </div>
  );
}
