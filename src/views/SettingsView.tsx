import { Palette, Sparkles, HardDrive, Sun, Moon, Monitor } from 'lucide-react';
import { useAppStore, type ThemeMode } from '../stores/appStore';
import { cn } from '../lib/utils';

export function SettingsView() {
  const { theme, setTheme } = useAppStore();

  const themeOptions: { mode: ThemeMode; label: string; icon: typeof Sun }[] = [
    { mode: 'dark', label: 'Tối (Dark)', icon: Moon },
    { mode: 'light', label: 'Sáng (Light)', icon: Sun },
    { mode: 'system', label: 'Hệ thống (System)', icon: Monitor },
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto p-6 sm:p-8 space-y-6">
        <div className="pb-4 border-b border-border">
          <span className="text-[10px] font-bold uppercase tracking-widest text-accent">Tùy biến & Cấu hình</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mt-1">Cài Đặt & Phương Pháp Luận</h1>
          <p className="text-muted-foreground mt-1 text-xs sm:text-sm">
            Thông tin hệ thống cục bộ và cốt lõi triết lý tiếp thu kỹ năng nhanh của Josh Kaufman.
          </p>
        </div>

        <div className="space-y-4">
          {/* Theme & Aesthetics Switcher */}
          <div className="bg-surface border border-border rounded-md p-5 sm:p-6 shadow-card">
            <h2 className="text-sm sm:text-base font-bold text-foreground mb-1.5 flex items-center gap-2">
              <Palette className="w-4 h-4 text-accent" />
              <span>Giao Diện & Chế Độ Màu (Minimalism & Swiss Style)</span>
            </h2>
            <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
              Thiết kế theo chuẩn Quốc tế Thụy Sĩ (Swiss Style): hệ thống lưới kỷ luật, tương phản thị giác cao, độ phân giải chữ nét và điểm nhấn màu Vermilion.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 max-w-md">
              {themeOptions.map((opt) => {
                const isActive = theme === opt.mode;
                return (
                  <button
                    key={opt.mode}
                    type="button"
                    onClick={() => setTheme(opt.mode)}
                    className={cn(
                      'flex items-center justify-center gap-2 px-3 py-2.5 rounded-md text-xs font-semibold transition-colors border',
                      isActive
                        ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                        : 'bg-background hover:bg-surface-hover text-muted-foreground hover:text-foreground border-border'
                    )}
                  >
                    <opt.icon className="w-3.5 h-3.5" />
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-border flex items-center gap-2">
              <span className="text-[11px] text-muted-foreground font-mono">Bảng màu hệ thống:</span>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-xs bg-background border border-border" title="Nền" />
                <div className="w-4 h-4 rounded-xs bg-surface border border-border" title="Bề mặt" />
                <div className="w-4 h-4 rounded-xs bg-foreground" title="Chữ chính" />
                <div className="w-4 h-4 rounded-xs bg-accent" title="Điểm nhấn Swiss Vermilion" />
                <div className="w-4 h-4 rounded-xs bg-border" title="Đường kẻ lưới" />
              </div>
            </div>
          </div>

          {/* Josh Kaufman Principle Box */}
          <div className="bg-surface border border-border rounded-md p-5 sm:p-6 shadow-card">
            <h2 className="text-sm sm:text-base font-bold text-foreground mb-1.5 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-warning" />
              <span>Quy tắc 20 Giờ Đầu Tiên (Josh Kaufman)</span>
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed mb-4">
              "Quy tắc 10.000 giờ" của Malcolm Gladwell áp dụng cho việc vươn tới đẳng cấp <strong>chuyên gia thế giới</strong>. Ngược lại, Josh Kaufman đã chứng minh rằng để đi từ <strong>hoàn toàn không biết gì</strong> đến <strong>thực hiện tương đối thành thạo</strong> một kỹ năng mới, bạn chỉ cần đúng <strong>20 giờ thực hành tập trung có chủ đích</strong> (khoảng 45 phút mỗi ngày trong 1 tháng).
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-background rounded-md border border-border">
                <span className="font-bold text-foreground block mb-0.5">1. Phân rã kỹ năng:</span>
                <p className="text-muted-foreground leading-relaxed">Xác định 20% thao tác cốt lõi mang lại 80% kết quả để tập trung rèn luyện trước.</p>
              </div>
              <div className="p-3 bg-background rounded-md border border-border">
                <span className="font-bold text-foreground block mb-0.5">2. Học đủ để tự sửa sai:</span>
                <p className="text-muted-foreground leading-relaxed">Chỉ tìm 3–5 tài liệu thực chiến, vừa đủ để tự nhận biết lỗi sai khi thực hành, tránh bẫy trì hoãn.</p>
              </div>
              <div className="p-3 bg-background rounded-md border border-border">
                <span className="font-bold text-foreground block mb-0.5">3. Loại bỏ mọi rào cản:</span>
                <p className="text-muted-foreground leading-relaxed">Dọn dẹp thiết bị, tắt điện thoại, triệt tiêu mọi phiền nhiễu trước khi bắt đầu bấm giờ.</p>
              </div>
              <div className="p-3 bg-background rounded-md border border-border">
                <span className="font-bold text-foreground block mb-0.5">4. Kiên trì luyện đủ 20 giờ:</span>
                <p className="text-muted-foreground leading-relaxed">Vượt qua "rào cản tâm lý vụng về" ban đầu trong 5 giờ đầu tiên để tạo đà tiến bộ vượt bậc.</p>
              </div>
            </div>
          </div>

          {/* Local SQLite Database Info */}
          <div className="bg-surface border border-border rounded-md p-5 sm:p-6 shadow-card">
            <h2 className="text-sm sm:text-base font-bold text-foreground mb-1.5 flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-accent" />
              <span>Lưu Trữ & Cơ Sở Dữ Liệu Cục Bộ (Local-First)</span>
            </h2>
            <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
              TwentyFirst cam kết bảo mật 100% dữ liệu của bạn trên máy tính cá nhân qua tệp tin SQLite nhúng (<code>twentyfirst.db</code>). Không cần tài khoản, không đẩy dữ liệu lên máy chủ đám mây, sử dụng hoàn toàn ngoại tuyến.
            </p>
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="px-2.5 py-1 rounded-sm bg-background border border-border text-foreground">
                Engine: SQLite 3 qua Tauri SQL Plugin
              </span>
              <span className="px-2.5 py-1 rounded-sm bg-success-subtle border border-success-border text-success font-semibold">
                100% Hoạt động Offline
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
