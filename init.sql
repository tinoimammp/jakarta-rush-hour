-- Initial Schema for Jakarta Rush Hour

-- 1. Leaderboard / High Scores
CREATE TABLE IF NOT EXISTS leaderboards (
    id SERIAL PRIMARY KEY,
    player_name VARCHAR(64) NOT NULL DEFAULT 'Warga Jakarta',
    vehicle_id VARCHAR(32) NOT NULL,
    score INTEGER NOT NULL DEFAULT 0,
    survival_seconds INTEGER NOT NULL DEFAULT 0,
    level_reached INTEGER NOT NULL DEFAULT 1,
    bosses_defeated INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_leaderboard_score ON leaderboards (score DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_survival ON leaderboards (survival_seconds DESC);

-- 2. Player Progress / Cloud Save
CREATE TABLE IF NOT EXISTS player_profiles (
    id VARCHAR(128) PRIMARY KEY,
    player_name VARCHAR(64) NOT NULL DEFAULT 'Warga Jakarta',
    coins INTEGER NOT NULL DEFAULT 0,
    diamonds INTEGER NOT NULL DEFAULT 0,
    selected_vehicle VARCHAR(32) NOT NULL DEFAULT 'motor-ojol',
    unlocked_vehicles JSONB NOT NULL DEFAULT '["motor-ojol"]'::jsonb,
    workshop_levels JSONB NOT NULL DEFAULT '{"engine": 0, "chassis": 0, "magnet": 0, "cooling": 0}'::jsonb,
    high_score INTEGER NOT NULL DEFAULT 0,
    longest_survival_sec INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed initial top records
INSERT INTO leaderboards (player_name, vehicle_id, score, survival_seconds, level_reached, bosses_defeated)
VALUES 
    ('Bang Ojol Gacor', 'motor-ojol', 18500, 420, 18, 4),
    ('Sopir Angkot Racing', 'angkot', 15200, 360, 15, 3),
    ('Sultan PIK 88', 'crazy-rich', 24800, 510, 22, 6),
    ('Pak RT Krukut', 'bajaj', 11900, 290, 12, 2)
ON CONFLICT DO NOTHING;
