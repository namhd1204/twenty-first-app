import { useState } from 'react';
import { Plus, ExternalLink, Check, Trash2, AlertTriangle, BookOpen, Video, FileText, Link as LinkIcon, Info } from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const RESOURCE_TYPES = [
  { id: 'link', icon: LinkIcon, label: 'Liên kết / Bài viết' },
  { id: 'video', icon: Video, label: 'Video / Clip hướng dẫn' },
  { id: 'book', icon: BookOpen, label: 'Sách / Giáo trình' },
  { id: 'note', icon: FileText, label: 'Ghi chú / Cheat Sheet' },
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
    <div className="space-y-6">
      {/* Header Box */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              📚 Trụ cột 2: Học Đủ Để Tự Sửa Sai (Learn Enough to Self-Correct)
            </h2>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Chỉ thu thập từ 3 đến 5 nguồn tài liệu uy tín để nhận biết khi nào mình làm sai và cách sửa lại. Tránh sa đà vào việc sưu tầm quá nhiều.
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-semibold transition-colors border border-slate-700"
          >
            <Plus className="w-4 h-4 text-indigo-400" />
            Thêm tài liệu
          </button>
        </div>

        {/* Anti-Procrastination Rule Badge / Warning */}
        {showWarning && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3"
          >
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                Kích hoạt quy tắc Chống Trì Hoãn: Đã lưu {resources.length} / 5 tài liệu!
              </p>
              <p className="text-xs text-amber-300/80 mt-1 leading-relaxed">
                Nghiên cứu tài liệu không phải là luyện tập. Bạn đã có đủ kiến thức lý thuyết để bắt đầu rồi — hãy dừng việc đọc thêm và chuyển sang bấm giờ thực hành ngay!
              </p>
            </div>
          </motion.div>
        )}

        {/* Info tip if less than 5 */}
        {!showWarning && (
          <div className="mt-4 p-3 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center gap-2.5 text-xs text-slate-400">
            <Info className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>Khuyến nghị Kaufman: Giới hạn tối đa 3–5 tài liệu để tránh hội chứng "học lý thuyết quá đà" (Hiện có: {resources.length}/5).</span>
          </div>
        )}

        {/* Add Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mt-4 pt-4 border-t border-slate-800"
            >
              <div className="space-y-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <div className="flex flex-wrap gap-2">
                  {RESOURCE_TYPES.map((rt) => (
                    <button
                      key={rt.id}
                      type="button"
                      onClick={() => setType(rt.id)}
                      className={cn(
                        'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                        type === rt.id
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      )}
                    >
                      <rt.icon className="w-3.5 h-3.5" />
                      {rt.label}
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Tên tài liệu (Ví dụ: Video 10 phút luyện bấm hợp âm sạch, Sách nhập môn...)"
                  className="w-full px-4 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                  autoFocus
                />

                {(type === 'link' || type === 'video') && (
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://youtube.com/... hoặc liên kết web"
                    className="w-full px-4 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                )}

                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ghi chú điểm mấu chốt để tự nhận diện lỗi sai khi tập..."
                  rows={2}
                  className="w-full px-4 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                />

                <div className="flex gap-2">
                  <button
                    onClick={handleAdd}
                    disabled={!title.trim()}
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold text-xs transition-colors"
                  >
                    Lưu tài liệu
                  </button>
                  <button
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Resources List */}
      <div className="space-y-2">
        <AnimatePresence>
          {resources.map((res) => {
            const typeInfo = RESOURCE_TYPES.find(rt => rt.id === res.resource_type) || RESOURCE_TYPES[0];
            return (
              <motion.div
                key={res.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className={cn(
                  'flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all group',
                  res.is_consumed
                    ? 'bg-slate-900/40 border-slate-800/60 opacity-60'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                )}
              >
                <button
                  onClick={() => toggleResourceConsumed(res.id)}
                  className="shrink-0 p-1 rounded hover:bg-slate-800 text-slate-500 hover:text-emerald-400 transition-colors"
                  title={res.is_consumed ? 'Đánh dấu chưa đọc' : 'Đánh dấu đã hiểu'}
                >
                  {res.is_consumed ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <typeInfo.icon className="w-4 h-4 text-indigo-400" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      'text-xs font-semibold truncate',
                      res.is_consumed ? 'text-slate-500 line-through' : 'text-slate-200'
                    )}
                  >
                    {res.title}
                  </p>
                  {res.notes && (
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{res.notes}</p>
                  )}
                </div>

                {res.url && (
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 p-2 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition-colors"
                    title="Mở liên kết trong trình duyệt"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}

                <button
                  onClick={() => removeResource(res.id)}
                  className="shrink-0 p-2 rounded-lg text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                  title="Xóa tài liệu"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {resources.length === 0 && !showForm && (
        <div className="text-center py-16 px-4 bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl">
          <div className="w-12 h-12 rounded-xl bg-slate-800/80 flex items-center justify-center mx-auto mb-3 text-2xl">
            📚
          </div>
          <h3 className="text-sm font-bold text-slate-300 mb-1">Chưa có tài liệu nào</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4 leading-relaxed">
            Thêm 3–5 cuốn sách, video hoặc bảng tra cứu cơ bản để tham chiếu khi mắc lỗi.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors"
          >
            Thêm tài liệu đầu tiên
          </button>
        </div>
      )}
    </div>
  );
}
