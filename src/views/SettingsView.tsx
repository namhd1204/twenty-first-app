import { Palette, Sparkles, HardDrive } from 'lucide-react';

export function SettingsView() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Cài Đặt & Phương Pháp Luận</h1>
          <p className="text-slate-400 mt-1 text-sm">
            Thông tin hệ thống cục bộ và cốt lõi triết lý tiếp thu kỹ năng nhanh của Josh Kaufman.
          </p>
        </div>

        <div className="space-y-4">
          {/* Josh Kaufman Principle Box */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-7">
            <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Quy tắc 20 Giờ Đầu Tiên (Josh Kaufman)
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              "Quy tắc 10.000 giờ" của Malcolm Gladwell áp dụng cho việc vươn tới đẳng cấp <strong>chuyên gia thế giới</strong>. Ngược lại, Josh Kaufman đã chứng minh rằng để đi từ <strong>hoàn toàn không biết gì</strong> đến <strong>thực hiện tương đối thành thạo</strong> một kỹ năng mới, bạn chỉ cần đúng <strong>20 giờ thực hành tập trung có chủ đích</strong> (khoảng 45 phút mỗi ngày trong 1 tháng).
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div className="p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800">
                <span className="font-bold text-emerald-400">1. Phân rã kỹ năng:</span>
                <p className="text-slate-400 mt-1 leading-relaxed">Xác định 20% thao tác cốt lõi mang lại 80% kết quả để tập trung rèn luyện trước.</p>
              </div>
              <div className="p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800">
                <span className="font-bold text-indigo-400">2. Học đủ để tự sửa sai:</span>
                <p className="text-slate-400 mt-1 leading-relaxed">Chỉ tìm 3–5 tài liệu thực chiến, vừa đủ để tự nhận biết lỗi sai khi thực hành, tránh bẫy trì hoãn.</p>
              </div>
              <div className="p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800">
                <span className="font-bold text-amber-400">3. Loại bỏ mọi rào cản:</span>
                <p className="text-slate-400 mt-1 leading-relaxed">Dọn dẹp thiết bị, tắt điện thoại, triệt tiêu mọi phiền nhiễu trước khi bắt đầu bấm giờ.</p>
              </div>
              <div className="p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800">
                <span className="font-bold text-rose-400">4. Kiên trì luyện đủ 20 giờ:</span>
                <p className="text-slate-400 mt-1 leading-relaxed">Vượt qua "rào cản tâm lý vụng về" ban đầu trong 5 giờ đầu tiên để tạo đà tiến bộ vượt bậc.</p>
              </div>
            </div>
          </div>

          {/* Local SQLite Database Info */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-7">
            <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-emerald-400" />
              Lưu Trữ & Cơ Sở Dữ Liệu Cục Bộ (Local-First)
            </h2>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              TwentyFirst cam kết bảo mật 100% dữ liệu của bạn trên máy tính cá nhân qua tệp tin SQLite nhúng (<code>twentyfirst.db</code>). Không cần tài khoản, không đẩy dữ liệu lên máy chủ đám mây, sử dụng hoàn toàn ngoại tuyến.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 font-mono">
                Engine: SQLite 3 qua Tauri SQL Plugin
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold">
                100% Hoạt động Offline
              </span>
            </div>
          </div>

          {/* Theme & Aesthetics */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-7">
            <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Palette className="w-5 h-5 text-indigo-400" />
              Giao Diện & Màu Sắc
            </h2>
            <p className="text-xs text-slate-400 mb-3">
              Mặc định chuẩn Dark Mode hiện đại (tông màu nền <code>slate-950</code> / <code>slate-900</code>) giảm mỏi mắt và tối đa hóa khả năng tập trung sâu.
            </p>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-slate-950 border border-slate-700"></div>
              <div className="w-6 h-6 rounded-full bg-slate-900 border border-slate-700"></div>
              <div className="w-6 h-6 rounded-full bg-emerald-500"></div>
              <div className="w-6 h-6 rounded-full bg-indigo-500"></div>
              <div className="w-6 h-6 rounded-full bg-amber-500"></div>
              <span className="text-xs text-slate-500 ml-2">Bảng màu tối giản Sleek Dark</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
