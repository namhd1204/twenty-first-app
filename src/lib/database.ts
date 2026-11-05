import Database from '@tauri-apps/plugin-sql';

// === INTERFACES ===

export interface Skill {
  id: string;
  name: string;
  description: string;
  target_hours: number;
  logged_hours: number;
  status: string;
  color: string;
  icon: string;
  created_at: string;
  updated_at: string;
}

export interface SubSkill {
  id: string;
  skill_id: string;
  name: string;
  description: string;
  is_priority: boolean;
  is_completed: boolean;
  sort_order: number;
  parent_id: string | null;
  created_at: string;
}

export interface Resource {
  id: string;
  skill_id: string;
  title: string;
  url: string;
  notes: string;
  resource_type: string;
  is_consumed: boolean;
  sort_order: number;
  created_at: string;
}

export interface Barrier {
  id: string;
  skill_id: string;
  label: string;
  is_checked: boolean;
  sort_order: number;
}

export interface Session {
  id: string;
  skill_id: string;
  duration_minutes: number;
  started_at: string;
  ended_at: string;
  confidence_score: number | null;
  notes: string;
  emotion: string;
  created_at: string;
}

export interface Milestone {
  id: string;
  skill_id: string;
  hour_mark: number;
  title: string;
  notes: string;
  proof_type: string;
  proof_data: string;
  achieved_at: string | null;
  created_at: string;
}

// === LOCAL-FIRST SQLITE WITH BROWSER FALLBACK ===

let dbInstance: Database | null = null;
let isTauriEnv: boolean | null = null;

function checkIsTauri(): boolean {
  if (isTauriEnv !== null) return isTauriEnv;
  isTauriEnv = typeof window !== 'undefined' && ('__TAURI_INTERNALS__' in window || '__TAURI__' in window);
  return isTauriEnv;
}

export async function getDb(): Promise<Database | null> {
  if (!checkIsTauri()) return null;
  if (!dbInstance) {
    try {
      dbInstance = await Database.load('sqlite:twentyfirst.db');
    } catch (e) {
      console.warn('Tauri SQL plugin load failed, falling back to local store:', e);
      return null;
    }
  }
  return dbInstance;
}

// Browser fallback storage
const LS_KEYS = {
  skills: 'tf_skills',
  subSkills: 'tf_sub_skills',
  resources: 'tf_resources',
  barriers: 'tf_barriers',
  sessions: 'tf_sessions',
  milestones: 'tf_milestones',
};

function getLocalStore<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setLocalStore<T>(key: string, data: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error('LocalStorage write error:', err);
  }
}

// === SKILLS CRUD ===

export async function getAllSkills(): Promise<Skill[]> {
  const db = await getDb();
  if (db) {
    return await db.select<Skill[]>('SELECT * FROM skills ORDER BY created_at DESC');
  }
  const skills = getLocalStore<Skill>(LS_KEYS.skills);
  return skills.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function getSkillById(id: string): Promise<Skill | null> {
  const db = await getDb();
  if (db) {
    const results = await db.select<Skill[]>('SELECT * FROM skills WHERE id = $1', [id]);
    return results[0] || null;
  }
  const skills = getLocalStore<Skill>(LS_KEYS.skills);
  return skills.find(s => s.id === id) || null;
}

export async function createSkill(skill: Omit<Skill, 'created_at' | 'updated_at' | 'logged_hours'>): Promise<void> {
  const now = new Date().toISOString();
  const db = await getDb();
  if (db) {
    await db.execute(
      `INSERT INTO skills (id, name, description, target_hours, status, color, icon, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [skill.id, skill.name, skill.description, skill.target_hours, skill.status, skill.color, skill.icon, now, now]
    );
    return;
  }
  const skills = getLocalStore<Skill>(LS_KEYS.skills);
  skills.unshift({
    ...skill,
    logged_hours: 0,
    created_at: now,
    updated_at: now,
  });
  setLocalStore(LS_KEYS.skills, skills);
}

export async function updateSkill(id: string, updates: Partial<Skill>): Promise<void> {
  const db = await getDb();
  if (db) {
    const fields = Object.keys(updates)
      .filter(k => k !== 'id')
      .map((k, i) => `${k} = $${i + 2}`)
      .join(', ');
    const values = Object.keys(updates)
      .filter(k => k !== 'id')
      .map(k => (updates as Record<string, unknown>)[k]);
    await db.execute(
      `UPDATE skills SET ${fields}, updated_at = datetime('now') WHERE id = $1`,
      [id, ...values]
    );
    return;
  }
  const skills = getLocalStore<Skill>(LS_KEYS.skills);
  const idx = skills.findIndex(s => s.id === id);
  if (idx !== -1) {
    skills[idx] = { ...skills[idx], ...updates, updated_at: new Date().toISOString() };
    setLocalStore(LS_KEYS.skills, skills);
  }
}

export async function deleteSkill(id: string): Promise<void> {
  const db = await getDb();
  if (db) {
    await db.execute('DELETE FROM skills WHERE id = $1', [id]);
    return;
  }
  setLocalStore(LS_KEYS.skills, getLocalStore<Skill>(LS_KEYS.skills).filter(s => s.id !== id));
  setLocalStore(LS_KEYS.subSkills, getLocalStore<SubSkill>(LS_KEYS.subSkills).filter(s => s.skill_id !== id));
  setLocalStore(LS_KEYS.resources, getLocalStore<Resource>(LS_KEYS.resources).filter(r => r.skill_id !== id));
  setLocalStore(LS_KEYS.barriers, getLocalStore<Barrier>(LS_KEYS.barriers).filter(b => b.skill_id !== id));
  setLocalStore(LS_KEYS.sessions, getLocalStore<Session>(LS_KEYS.sessions).filter(s => s.skill_id !== id));
  setLocalStore(LS_KEYS.milestones, getLocalStore<Milestone>(LS_KEYS.milestones).filter(m => m.skill_id !== id));
}

// === SUB-SKILLS CRUD ===

export async function getSubSkills(skillId: string): Promise<SubSkill[]> {
  const db = await getDb();
  if (db) {
    return await db.select<SubSkill[]>(
      'SELECT * FROM sub_skills WHERE skill_id = $1 ORDER BY sort_order ASC',
      [skillId]
    );
  }
  const items = getLocalStore<SubSkill>(LS_KEYS.subSkills);
  return items.filter(s => s.skill_id === skillId).sort((a, b) => a.sort_order - b.sort_order);
}

export async function createSubSkill(sub: Omit<SubSkill, 'created_at'>): Promise<void> {
  const now = new Date().toISOString();
  const db = await getDb();
  if (db) {
    await db.execute(
      `INSERT INTO sub_skills (id, skill_id, name, description, is_priority, is_completed, sort_order, parent_id, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [sub.id, sub.skill_id, sub.name, sub.description, sub.is_priority ? 1 : 0, sub.is_completed ? 1 : 0, sub.sort_order, sub.parent_id, now]
    );
    return;
  }
  const items = getLocalStore<SubSkill>(LS_KEYS.subSkills);
  items.push({ ...sub, created_at: now });
  setLocalStore(LS_KEYS.subSkills, items);
}

export async function updateSubSkill(id: string, updates: Partial<SubSkill>): Promise<void> {
  const db = await getDb();
  if (db) {
    const entries = Object.entries(updates).filter(([k]) => k !== 'id');
    const fields = entries.map(([k], i) => `${k} = $${i + 2}`).join(', ');
    const values = entries.map(([, v]) => typeof v === 'boolean' ? (v ? 1 : 0) : v);
    await db.execute(`UPDATE sub_skills SET ${fields} WHERE id = $1`, [id, ...values]);
    return;
  }
  const items = getLocalStore<SubSkill>(LS_KEYS.subSkills);
  const idx = items.findIndex(s => s.id === id);
  if (idx !== -1) {
    items[idx] = { ...items[idx], ...updates };
    setLocalStore(LS_KEYS.subSkills, items);
  }
}

export async function deleteSubSkill(id: string): Promise<void> {
  const db = await getDb();
  if (db) {
    await db.execute('DELETE FROM sub_skills WHERE id = $1', [id]);
    return;
  }
  setLocalStore(LS_KEYS.subSkills, getLocalStore<SubSkill>(LS_KEYS.subSkills).filter(s => s.id !== id));
}

// === RESOURCES CRUD ===

export async function getResources(skillId: string): Promise<Resource[]> {
  const db = await getDb();
  if (db) {
    return await db.select<Resource[]>(
      'SELECT * FROM resources WHERE skill_id = $1 ORDER BY sort_order ASC',
      [skillId]
    );
  }
  const items = getLocalStore<Resource>(LS_KEYS.resources);
  return items.filter(r => r.skill_id === skillId).sort((a, b) => a.sort_order - b.sort_order);
}

export async function createResource(res: Omit<Resource, 'created_at'>): Promise<void> {
  const now = new Date().toISOString();
  const db = await getDb();
  if (db) {
    await db.execute(
      `INSERT INTO resources (id, skill_id, title, url, notes, resource_type, is_consumed, sort_order, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [res.id, res.skill_id, res.title, res.url, res.notes, res.resource_type, res.is_consumed ? 1 : 0, res.sort_order, now]
    );
    return;
  }
  const items = getLocalStore<Resource>(LS_KEYS.resources);
  items.push({ ...res, created_at: now });
  setLocalStore(LS_KEYS.resources, items);
}

export async function updateResource(id: string, updates: Partial<Resource>): Promise<void> {
  const db = await getDb();
  if (db) {
    const entries = Object.entries(updates).filter(([k]) => k !== 'id');
    const fields = entries.map(([k], i) => `${k} = $${i + 2}`).join(', ');
    const values = entries.map(([, v]) => typeof v === 'boolean' ? (v ? 1 : 0) : v);
    await db.execute(`UPDATE resources SET ${fields} WHERE id = $1`, [id, ...values]);
    return;
  }
  const items = getLocalStore<Resource>(LS_KEYS.resources);
  const idx = items.findIndex(r => r.id === id);
  if (idx !== -1) {
    items[idx] = { ...items[idx], ...updates };
    setLocalStore(LS_KEYS.resources, items);
  }
}

export async function deleteResource(id: string): Promise<void> {
  const db = await getDb();
  if (db) {
    await db.execute('DELETE FROM resources WHERE id = $1', [id]);
    return;
  }
  setLocalStore(LS_KEYS.resources, getLocalStore<Resource>(LS_KEYS.resources).filter(r => r.id !== id));
}

// === BARRIERS CRUD ===

export async function getBarriers(skillId: string): Promise<Barrier[]> {
  const db = await getDb();
  if (db) {
    return await db.select<Barrier[]>(
      'SELECT * FROM barriers WHERE skill_id = $1 ORDER BY sort_order ASC',
      [skillId]
    );
  }
  const items = getLocalStore<Barrier>(LS_KEYS.barriers);
  return items.filter(b => b.skill_id === skillId).sort((a, b) => a.sort_order - b.sort_order);
}

export async function createBarrier(barrier: Barrier): Promise<void> {
  const db = await getDb();
  if (db) {
    await db.execute(
      `INSERT INTO barriers (id, skill_id, label, is_checked, sort_order)
       VALUES ($1, $2, $3, $4, $5)`,
      [barrier.id, barrier.skill_id, barrier.label, barrier.is_checked ? 1 : 0, barrier.sort_order]
    );
    return;
  }
  const items = getLocalStore<Barrier>(LS_KEYS.barriers);
  items.push(barrier);
  setLocalStore(LS_KEYS.barriers, items);
}

export async function updateBarrier(id: string, updates: Partial<Barrier>): Promise<void> {
  const db = await getDb();
  if (db) {
    const entries = Object.entries(updates).filter(([k]) => k !== 'id');
    const fields = entries.map(([k], i) => `${k} = $${i + 2}`).join(', ');
    const values = entries.map(([, v]) => typeof v === 'boolean' ? (v ? 1 : 0) : v);
    await db.execute(`UPDATE barriers SET ${fields} WHERE id = $1`, [id, ...values]);
    return;
  }
  const items = getLocalStore<Barrier>(LS_KEYS.barriers);
  const idx = items.findIndex(b => b.id === id);
  if (idx !== -1) {
    items[idx] = { ...items[idx], ...updates };
    setLocalStore(LS_KEYS.barriers, items);
  }
}

export async function deleteBarrier(id: string): Promise<void> {
  const db = await getDb();
  if (db) {
    await db.execute('DELETE FROM barriers WHERE id = $1', [id]);
    return;
  }
  setLocalStore(LS_KEYS.barriers, getLocalStore<Barrier>(LS_KEYS.barriers).filter(b => b.id !== id));
}

// === SESSIONS CRUD ===

export async function getSessions(skillId: string): Promise<Session[]> {
  const db = await getDb();
  if (db) {
    return await db.select<Session[]>(
      'SELECT * FROM sessions WHERE skill_id = $1 ORDER BY started_at DESC',
      [skillId]
    );
  }
  const items = getLocalStore<Session>(LS_KEYS.sessions);
  return items.filter(s => s.skill_id === skillId).sort((a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime());
}

export async function createSession(session: Omit<Session, 'created_at'>): Promise<void> {
  const now = new Date().toISOString();
  const db = await getDb();
  if (db) {
    await db.execute(
      `INSERT INTO sessions (id, skill_id, duration_minutes, started_at, ended_at, confidence_score, notes, emotion, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [session.id, session.skill_id, session.duration_minutes, session.started_at, session.ended_at, session.confidence_score, session.notes, session.emotion, now]
    );
    await db.execute(
      `UPDATE skills SET logged_hours = logged_hours + $1, updated_at = datetime('now') WHERE id = $2`,
      [session.duration_minutes / 60, session.skill_id]
    );
    return;
  }
  const items = getLocalStore<Session>(LS_KEYS.sessions);
  items.unshift({ ...session, created_at: now });
  setLocalStore(LS_KEYS.sessions, items);

  const skills = getLocalStore<Skill>(LS_KEYS.skills);
  const idx = skills.findIndex(s => s.id === session.skill_id);
  if (idx !== -1) {
    skills[idx].logged_hours = (skills[idx].logged_hours || 0) + (session.duration_minutes / 60);
    skills[idx].updated_at = now;
    setLocalStore(LS_KEYS.skills, skills);
  }
}

export async function getAllSessions(): Promise<(Session & { skill_name: string })[]> {
  const db = await getDb();
  if (db) {
    return await db.select<(Session & { skill_name: string })[]>(
      `SELECT s.*, sk.name as skill_name FROM sessions s
       JOIN skills sk ON s.skill_id = sk.id
       ORDER BY s.started_at DESC`
    );
  }
  const sessions = getLocalStore<Session>(LS_KEYS.sessions);
  const skills = getLocalStore<Skill>(LS_KEYS.skills);
  const skillMap = new Map(skills.map(s => [s.id, s.name]));
  return sessions.map(s => ({
    ...s,
    skill_name: skillMap.get(s.skill_id) || 'Unknown Skill',
  }));
}

// === MILESTONES CRUD ===

export async function getMilestones(skillId: string): Promise<Milestone[]> {
  const db = await getDb();
  if (db) {
    return await db.select<Milestone[]>(
      'SELECT * FROM milestones WHERE skill_id = $1 ORDER BY hour_mark ASC',
      [skillId]
    );
  }
  const items = getLocalStore<Milestone>(LS_KEYS.milestones);
  return items.filter(m => m.skill_id === skillId).sort((a, b) => a.hour_mark - b.hour_mark);
}

export async function createMilestone(milestone: Omit<Milestone, 'created_at'>): Promise<void> {
  const now = new Date().toISOString();
  const db = await getDb();
  if (db) {
    await db.execute(
      `INSERT INTO milestones (id, skill_id, hour_mark, title, notes, proof_type, proof_data, achieved_at, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [milestone.id, milestone.skill_id, milestone.hour_mark, milestone.title, milestone.notes, milestone.proof_type, milestone.proof_data, milestone.achieved_at, now]
    );
    return;
  }
  const items = getLocalStore<Milestone>(LS_KEYS.milestones);
  items.push({ ...milestone, created_at: now });
  setLocalStore(LS_KEYS.milestones, items);
}

export async function updateMilestone(id: string, updates: Partial<Milestone>): Promise<void> {
  const db = await getDb();
  if (db) {
    const entries = Object.entries(updates).filter(([k]) => k !== 'id');
    const fields = entries.map(([k], i) => `${k} = $${i + 2}`).join(', ');
    const values = entries.map(([, v]) => v);
    await db.execute(`UPDATE milestones SET ${fields} WHERE id = $1`, [id, ...values]);
    return;
  }
  const items = getLocalStore<Milestone>(LS_KEYS.milestones);
  const idx = items.findIndex(m => m.id === id);
  if (idx !== -1) {
    items[idx] = { ...items[idx], ...updates };
    setLocalStore(LS_KEYS.milestones, items);
  }
}
