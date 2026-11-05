import { create } from 'zustand';
import * as db from '../lib/database';

function generateId(): string {
  return crypto.randomUUID();
}

export type ThemeMode = 'dark' | 'light' | 'system';

export function applyTheme(theme: ThemeMode) {
  if (typeof window === 'undefined') return;
  const root = document.documentElement;
  const isDark =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  if (isDark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

function getInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'dark';
  const saved = localStorage.getItem('twentyfirst-theme') as ThemeMode | null;
  if (saved && ['dark', 'light', 'system'].includes(saved)) {
    applyTheme(saved);
    return saved;
  }
  applyTheme('dark');
  return 'dark';
}

interface AppState {
  // Skills
  skills: db.Skill[];
  activeSkillId: string | null;
  loading: boolean;

  // Current skill detail data
  subSkills: db.SubSkill[];
  resources: db.Resource[];
  barriers: db.Barrier[];
  sessions: db.Session[];
  milestones: db.Milestone[];

  // Timer state
  timerActive: boolean;
  timerSkillId: string | null;
  timerStartedAt: string | null;
  timerDurationMinutes: number;
  showReflection: boolean;
  lastSessionDuration: number;

  // Navigation
  currentView: 'dashboard' | 'skill' | 'history' | 'settings';
  skillTab: 'deconstruct' | 'resources' | 'barriers' | 'practice';
  theme: ThemeMode;

  // Actions
  loadSkills: () => Promise<void>;
  loadSkillData: (skillId: string) => Promise<void>;
  setActiveSkill: (skillId: string | null) => void;
  setCurrentView: (view: AppState['currentView']) => void;
  setSkillTab: (tab: AppState['skillTab']) => void;
  setTheme: (theme: ThemeMode) => void;

  // Skill CRUD
  addSkill: (name: string, description: string, color: string) => Promise<string>;
  removeSkill: (id: string) => Promise<void>;
  editSkill: (id: string, updates: Partial<db.Skill>) => Promise<void>;

  // SubSkill CRUD
  addSubSkill: (name: string, description?: string, parentId?: string | null) => Promise<void>;
  toggleSubSkillPriority: (id: string) => Promise<void>;
  toggleSubSkillComplete: (id: string) => Promise<void>;
  removeSubSkill: (id: string) => Promise<void>;

  // Resource CRUD
  addResource: (title: string, url?: string, notes?: string, type?: string) => Promise<void>;
  toggleResourceConsumed: (id: string) => Promise<void>;
  removeResource: (id: string) => Promise<void>;

  // Barrier CRUD
  addBarrier: (label: string) => Promise<void>;
  toggleBarrier: (id: string) => Promise<void>;
  removeBarrier: (id: string) => Promise<void>;
  resetBarriers: () => Promise<void>;

  // Timer & Session
  startTimer: (skillId: string, durationMinutes: number) => void;
  stopTimer: () => void;
  completeSession: (confidenceScore: number, notes: string, emotion: string) => Promise<void>;
  dismissReflection: () => void;

  // Milestones
  addMilestone: (hourMark: number, title: string) => Promise<void>;
  updateMilestoneProof: (id: string, notes: string, proofType: string, proofData: string) => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  skills: [],
  activeSkillId: null,
  loading: true,
  subSkills: [],
  resources: [],
  barriers: [],
  sessions: [],
  milestones: [],
  timerActive: false,
  timerSkillId: null,
  timerStartedAt: null,
  timerDurationMinutes: 45,
  showReflection: false,
  lastSessionDuration: 0,
  currentView: 'dashboard',
  skillTab: 'deconstruct',
  theme: getInitialTheme(),

  loadSkills: async () => {
    set({ loading: true });
    const skills = await db.getAllSkills();
    set({ skills, loading: false });
  },

  loadSkillData: async (skillId: string) => {
    const [subSkills, resources, barriers, sessions, milestones] = await Promise.all([
      db.getSubSkills(skillId),
      db.getResources(skillId),
      db.getBarriers(skillId),
      db.getSessions(skillId),
      db.getMilestones(skillId),
    ]);
    set({ subSkills, resources, barriers, sessions, milestones, activeSkillId: skillId });
  },

  setActiveSkill: (skillId) => set({ activeSkillId: skillId }),
  setCurrentView: (view) => set({ currentView: view }),
  setSkillTab: (tab) => set({ skillTab: tab }),
  setTheme: (theme) => {
    localStorage.setItem('twentyfirst-theme', theme);
    applyTheme(theme);
    set({ theme });
  },

  addSkill: async (name, description, color) => {
    const id = generateId();
    await db.createSkill({
      id,
      name,
      description,
      target_hours: 20,
      status: 'active',
      color,
      icon: 'target',
    });
    // Create default milestones in Vietnamese
    const milestoneConfigs = [
      { hour: 1, title: 'Vượt qua sự ngượng ngùng và lúng túng ban đầu' },
      { hour: 5, title: 'Nắm vững các kỹ thuật cơ bản cốt lõi' },
      { hour: 10, title: 'Tự nhận biết và sửa sai độc lập' },
      { hour: 15, title: 'Hình thành phản xạ và sự trôi chảy tự nhiên' },
      { hour: 20, title: 'Làm chủ kỹ năng thực tế — Hoàn thành 20 giờ!' },
    ];
    for (const m of milestoneConfigs) {
      await db.createMilestone({
        id: generateId(),
        skill_id: id,
        hour_mark: m.hour,
        title: m.title,
        notes: '',
        proof_type: '',
        proof_data: '',
        achieved_at: null,
      });
    }
    // Create default barriers in Vietnamese
    const defaultBarriers = [
      'Điện thoại đã tắt thông báo / Bật chế độ Không làm phiền',
      'Không gian luyện tập yên tĩnh, bàn làm việc dọn dẹp gọn gàng',
      'Dụng cụ / Giáo trình đã mở sẵn trên bàn',
      'Nước uống đã chuẩn bị, tinh thần thoải mái',
    ];
    for (let i = 0; i < defaultBarriers.length; i++) {
      await db.createBarrier({
        id: generateId(),
        skill_id: id,
        label: defaultBarriers[i],
        is_checked: false,
        sort_order: i,
      });
    }
    await get().loadSkills();
    return id;
  },

  removeSkill: async (id) => {
    await db.deleteSkill(id);
    const state = get();
    if (state.activeSkillId === id) {
      set({ activeSkillId: null, currentView: 'dashboard' });
    }
    await get().loadSkills();
  },

  editSkill: async (id, updates) => {
    await db.updateSkill(id, updates);
    await get().loadSkills();
    if (get().activeSkillId === id) {
      await get().loadSkillData(id);
    }
  },

  addSubSkill: async (name, description = '', parentId = null) => {
    const skillId = get().activeSkillId;
    if (!skillId) return;
    const sub: Omit<db.SubSkill, 'created_at'> = {
      id: generateId(),
      skill_id: skillId,
      name,
      description,
      is_priority: false,
      is_completed: false,
      sort_order: get().subSkills.length,
      parent_id: parentId || null,
    };
    await db.createSubSkill(sub);
    await get().loadSkillData(skillId);
  },

  toggleSubSkillPriority: async (id) => {
    const sub = get().subSkills.find(s => s.id === id);
    if (!sub) return;
    await db.updateSubSkill(id, { is_priority: !sub.is_priority });
    await get().loadSkillData(get().activeSkillId!);
  },

  toggleSubSkillComplete: async (id) => {
    const sub = get().subSkills.find(s => s.id === id);
    if (!sub) return;
    await db.updateSubSkill(id, { is_completed: !sub.is_completed });
    await get().loadSkillData(get().activeSkillId!);
  },

  removeSubSkill: async (id) => {
    await db.deleteSubSkill(id);
    await get().loadSkillData(get().activeSkillId!);
  },

  addResource: async (title, url = '', notes = '', type = 'link') => {
    const skillId = get().activeSkillId;
    if (!skillId) return;
    const res: Omit<db.Resource, 'created_at'> = {
      id: generateId(),
      skill_id: skillId,
      title,
      url,
      notes,
      resource_type: type,
      is_consumed: false,
      sort_order: get().resources.length,
    };
    await db.createResource(res);
    await get().loadSkillData(skillId);
  },

  toggleResourceConsumed: async (id) => {
    const res = get().resources.find(r => r.id === id);
    if (!res) return;
    await db.updateResource(id, { is_consumed: !res.is_consumed });
    await get().loadSkillData(get().activeSkillId!);
  },

  removeResource: async (id) => {
    await db.deleteResource(id);
    await get().loadSkillData(get().activeSkillId!);
  },

  addBarrier: async (label) => {
    const skillId = get().activeSkillId;
    if (!skillId) return;
    await db.createBarrier({
      id: generateId(),
      skill_id: skillId,
      label,
      is_checked: false,
      sort_order: get().barriers.length,
    });
    await get().loadSkillData(skillId);
  },

  toggleBarrier: async (id) => {
    const barrier = get().barriers.find(b => b.id === id);
    if (!barrier) return;
    await db.updateBarrier(id, { is_checked: !barrier.is_checked });
    await get().loadSkillData(get().activeSkillId!);
  },

  removeBarrier: async (id) => {
    await db.deleteBarrier(id);
    await get().loadSkillData(get().activeSkillId!);
  },

  resetBarriers: async () => {
    const skillId = get().activeSkillId;
    if (!skillId) return;
    for (const barrier of get().barriers) {
      if (barrier.is_checked) {
        await db.updateBarrier(barrier.id, { is_checked: false });
      }
    }
    await get().loadSkillData(skillId);
  },

  startTimer: (skillId, durationMinutes) => {
    set({
      timerActive: true,
      timerSkillId: skillId,
      timerStartedAt: new Date().toISOString(),
      timerDurationMinutes: durationMinutes,
    });
  },

  stopTimer: () => {
    set({
      timerActive: false,
      timerSkillId: null,
      timerStartedAt: null,
    });
  },

  completeSession: async (confidenceScore, notes, emotion) => {
    const state = get();
    if (!state.timerSkillId || !state.timerStartedAt) return;

    const now = new Date().toISOString();
    const startTime = new Date(state.timerStartedAt);
    const endTime = new Date(now);
    const actualMinutes = (endTime.getTime() - startTime.getTime()) / 60000;

    const session: Omit<db.Session, 'created_at'> = {
      id: generateId(),
      skill_id: state.timerSkillId,
      duration_minutes: Math.round(actualMinutes * 100) / 100,
      started_at: state.timerStartedAt,
      ended_at: now,
      confidence_score: confidenceScore,
      notes,
      emotion,
    };

    await db.createSession(session);

    set({
      timerActive: false,
      timerSkillId: null,
      timerStartedAt: null,
      showReflection: false,
      lastSessionDuration: 0,
    });

    await get().loadSkills();
    if (state.activeSkillId) {
      await get().loadSkillData(state.activeSkillId);
    }
  },

  dismissReflection: () => set({ showReflection: false }),

  addMilestone: async (hourMark, title) => {
    const skillId = get().activeSkillId;
    if (!skillId) return;
    await db.createMilestone({
      id: generateId(),
      skill_id: skillId,
      hour_mark: hourMark,
      title,
      notes: '',
      proof_type: '',
      proof_data: '',
      achieved_at: null,
    });
    await get().loadSkillData(skillId);
  },

  updateMilestoneProof: async (id, notes, proofType, proofData) => {
    await db.updateMilestone(id, {
      notes,
      proof_type: proofType,
      proof_data: proofData,
      achieved_at: new Date().toISOString(),
    });
    await get().loadSkillData(get().activeSkillId!);
  },
}));
