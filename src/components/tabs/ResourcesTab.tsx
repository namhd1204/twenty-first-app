import { useState } from 'react';
import { Plus, ExternalLink, Check, Trash2, AlertTriangle, BookOpen, Video, FileText, Link as LinkIcon, Info } from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const RESOURCE_TYPES = [
  { id: 'link', icon: LinkIcon, label: 'Liên kết / Bài viết' },
  { id: 'video', icon: Video, label: 'Video hướng dẫn' },
  { id: 'book', icon: BookOpen, label: 'Sách / Giáo trình' },
  { id: 'note', icon: FileText, label: 'Ghi chú / Tra cứu' },
];

export function ResourcesTab() {
  const { resources, addResource, toggleResourceConsumed, removeResource } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [type, setType] = useState('link');

  const handleAdd = async () => {
    if (!title.trim()) return;
    await addResource(title.trim(), url.trim(), notes.trim(), type);
    setTitle('');
    setUrl('');
    setNotes('');
    setType('link');
    setShowForm(false);
  };

  const showWarning = resources.length >= 5;

  return (
    <div className="space-y-5">
      {/* Header Box */}
      <div className="bg-surface border border-border rounded-md p-5 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-foreground flex items-center gap-2">
              Trụ cột 2: Học Đủ Để Tự Sửa Sai (Learn Enough to Self-Correct)
            </h2>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Chỉ thu thập từ 3 đến 5 nguồn tài liệu uy tín để nhận biết khi nào mình làm sai và cách sửa lại. Tránh sa đà vào việc sưu tầm quá nhiều.
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-surface-hover hover:bg-surface-active text-xs text-foreground font-semibold transition-colors border border-border shrink-0 self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5 text-accent" />
            <span>Thêm tài liệu</span>
          </button>
        </div>

        {/* Anti-Procrastination Rule Badge / Warning */}
        {showWarning && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3.5 rounded-md bg-warning-subtle border border-warning-border flex items-start gap-3"
          >
            <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-warning uppercase tracking-wider">
                Quy tắc Chống Trì Hoãn: Đã lưu {resources.length} / 5 tài liệu!
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                Nghiên cứu tài liệu không phải là luyện tập. Bạn đã có đủ kiến thức lý thuyết để bắt đầu — hãy dừng việc đọc thêm và chuyển sang bấm giờ thực hành ngay!
              </p>
            </div>
          </motion.div>
        )}

        {/* Info tip if less than 5 */}
        {!showWarning && (
          <div className="mt-4 p-3 rounded-md bg-surface-hover border border-border flex items-center gap-2.5 text-xs text-muted-foreground">
            <Info className="w-4 h-4 text-accent shrink-0" />
            <span>Khuyến nghị Kaufman: Giới hạn tối đa 3–5 tài liệu để tránh bẫy trì hoãn (Hiện có: <strong className="text-foreground font-mono">{resources.length}/5</strong>).</span>
          </div>
        )}

        {/* Add Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mt-4 pt-4 border-t border-border"
            >
              <div className="space-y-3 bg-background p-4 rounded-md border border-border">
                <div className="flex flex-wrap gap-1.5">
                  {RESOURCE_TYPES.map((rt) => (
                    <button
                      key={rt.id}
                      type="button"
                      onClick={() => setType(rt.id)}
                      className={cn(
                        'flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition-colors',
                        type === rt.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-surface-hover text-muted-foreground hover:text-foreground border border-border'
                      )}
                    >
                      <rt.icon className="w-3.5 h-3.5" />
                      <span>{rt.label}</span>
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Tên tài liệu (Ví dụ: Video 10 phút luyện bấm hợp âm sạch...)"
                  className="w-full px-3 py-2 bg-surface border border-border rounded-md text-foreground placeholder:text-muted-foreground text-xs focus-visible:outline-2 focus-visible:outline-accent transition-colors"
                  autoFocus
                />

                {(type === 'link' || type === 'video') && (
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://youtube.com/... hoặc liên kết web"
                    className="w-full px-3 py-2 bg-surface border border-border rounded-md text-foreground placeholder:text-muted-foreground text-xs focus-visible:outline-2 focus-visible:outline-accent transition-colors font-mono"
                  />
                )}

                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ghi chú điểm mấu chốt để tự nhận diện lỗi sai khi tập..."
                  rows={2}
                  className="w-full px-3 py-2 bg-surface border border-border rounded-md text-foreground placeholder:text-muted-foreground text-xs focus-visible:outline-2 focus-visible:outline-accent transition-colors resize-none leading-relaxed"
                />

                <div className="flex gap-2 justify-end pt-1">
                  <button
                    onClick={() => setShowForm(false)}
                    className="px-3.5 py-1.5 rounded-md bg-surface-hover hover:bg-surface-active text-muted-foreground hover:text-foreground text-xs font-semibold transition-colors border border-border"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleAdd}
                    disabled={!title.trim()}
                    className="px-4 py-1.5 rounded-md bg-accent hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-xs transition-colors"
                  >
                    Lưu tài liệu
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Resources List */}
      <div className="space-y-1.5">
        <AnimatePresence>
          {resources.map((res) => {
            const typeInfo = RESOURCE_TYPES.find(rt => rt.id === res.resource_type) || RESOURCE_TYPES[0];
            return (
              <motion.div
                key={res.id}
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className={cn(
                  'flex items-center gap-3 px-3.5 py-3 rounded-md border transition-colors group',
                  res.is_consumed
                    ? 'bg-surface/50 border-border opacity-60'
                    : 'bg-surface border-border hover:border-border-strong'
                )}
              >
                <button
                  onClick={() => toggleResourceConsumed(res.id)}
                  className="shrink-0 p-1 rounded hover:bg-surface-hover text-muted-foreground hover:text-success transition-colors"
                  title={res.is_consumed ? 'Đánh dấu chưa đọc' : 'Đánh dấu đã hiểu'}
                  aria-label={res.is_consumed ? 'Đánh dấu chưa đọc' : 'Đánh dấu đã hiểu'}
                >
                  {res.is_consumed ? (
                    <Check className="w-4 h-4 text-success" />
                  ) : (
                    <typeInfo.icon className="w-4 h-4 text-accent" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      'text-xs font-semibold truncate',
                      res.is_consumed ? 'text-muted-foreground line-through' : 'text-foreground'
                    )}
                  >
                    {res.title}
                  </p>
                  {res.notes && (
                    <p className="text-[11px] text-muted-foreground truncate mt-0.5">{res.notes}</p>
                  )}
                </div>

                {res.url && (
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-colors"
                    title="Mở liên kết trong trình duyệt"
                    aria-label={`Mở liên kết cho ${res.title}`}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}

                <button
                  onClick={() => removeResource(res.id)}
                  className="shrink-0 p-1.5 rounded text-muted-foreground hover:text-danger opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Xóa tài liệu"
                  aria-label="Xóa tài liệu"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {resources.length === 0 && !showForm && (
        <div className="text-center py-12 px-4 bg-surface border border-dashed border-border rounded-md">
          <p className="text-xs font-bold text-foreground mb-1">Chưa có tài liệu nào</p>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto mb-4 leading-relaxed">
            Thêm 3–5 cuốn sách, video hoặc bảng tra cứu cơ bản để tham chiếu khi mắc lỗi.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="px-3.5 py-1.5 rounded-md bg-accent hover:bg-accent/90 text-white text-xs font-semibold transition-colors"
          >
            Thêm tài liệu đầu tiên
          </button>
        </div>
      )}
    </div>
  );
}
