use tauri_plugin_sql::{Migration, MigrationKind};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let migrations = vec![
        Migration {
            version: 1,
            description: "create_initial_tables",
            sql: r#"
                CREATE TABLE IF NOT EXISTS skills (
                    id TEXT PRIMARY KEY NOT NULL,
                    name TEXT NOT NULL,
                    description TEXT DEFAULT '',
                    target_hours REAL NOT NULL DEFAULT 20.0,
                    logged_hours REAL NOT NULL DEFAULT 0.0,
                    status TEXT NOT NULL DEFAULT 'active',
                    color TEXT NOT NULL DEFAULT '#10b981',
                    icon TEXT NOT NULL DEFAULT 'target',
                    created_at TEXT NOT NULL DEFAULT (datetime('now')),
                    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
                );

                CREATE TABLE IF NOT EXISTS sub_skills (
                    id TEXT PRIMARY KEY NOT NULL,
                    skill_id TEXT NOT NULL,
                    name TEXT NOT NULL,
                    description TEXT DEFAULT '',
                    is_priority BOOLEAN NOT NULL DEFAULT 0,
                    is_completed BOOLEAN NOT NULL DEFAULT 0,
                    sort_order INTEGER NOT NULL DEFAULT 0,
                    parent_id TEXT,
                    created_at TEXT NOT NULL DEFAULT (datetime('now')),
                    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
                    FOREIGN KEY (parent_id) REFERENCES sub_skills(id) ON DELETE SET NULL
                );

                CREATE TABLE IF NOT EXISTS resources (
                    id TEXT PRIMARY KEY NOT NULL,
                    skill_id TEXT NOT NULL,
                    title TEXT NOT NULL,
                    url TEXT DEFAULT '',
                    notes TEXT DEFAULT '',
                    resource_type TEXT NOT NULL DEFAULT 'link',
                    is_consumed BOOLEAN NOT NULL DEFAULT 0,
                    sort_order INTEGER NOT NULL DEFAULT 0,
                    created_at TEXT NOT NULL DEFAULT (datetime('now')),
                    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
                );

                CREATE TABLE IF NOT EXISTS barriers (
                    id TEXT PRIMARY KEY NOT NULL,
                    skill_id TEXT NOT NULL,
                    label TEXT NOT NULL,
                    is_checked BOOLEAN NOT NULL DEFAULT 0,
                    sort_order INTEGER NOT NULL DEFAULT 0,
                    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
                );

                CREATE TABLE IF NOT EXISTS sessions (
                    id TEXT PRIMARY KEY NOT NULL,
                    skill_id TEXT NOT NULL,
                    duration_minutes REAL NOT NULL,
                    started_at TEXT NOT NULL,
                    ended_at TEXT NOT NULL,
                    confidence_score INTEGER DEFAULT NULL,
                    notes TEXT DEFAULT '',
                    emotion TEXT DEFAULT '',
                    created_at TEXT NOT NULL DEFAULT (datetime('now')),
                    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
                );

                CREATE TABLE IF NOT EXISTS milestones (
                    id TEXT PRIMARY KEY NOT NULL,
                    skill_id TEXT NOT NULL,
                    hour_mark REAL NOT NULL,
                    title TEXT DEFAULT '',
                    notes TEXT DEFAULT '',
                    proof_type TEXT DEFAULT '',
                    proof_data TEXT DEFAULT '',
                    achieved_at TEXT,
                    created_at TEXT NOT NULL DEFAULT (datetime('now')),
                    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
                );
            "#,
            kind: MigrationKind::Up,
        },
    ];

    tauri::Builder::default()
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:twentyfirst.db", migrations)
                .build(),
        )
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while building tauri application");
}
