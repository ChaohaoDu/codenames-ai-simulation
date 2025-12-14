-- Create matches table
CREATE TABLE IF NOT EXISTS matches (
    id TEXT PRIMARY KEY,
    timestamp BIGINT NOT NULL,
    red_model_id TEXT NOT NULL,
    blue_model_id TEXT NOT NULL,
    winner TEXT NOT NULL CHECK (winner IN ('red', 'blue')),
    turns INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_matches_timestamp ON matches(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_matches_models ON matches(red_model_id, blue_model_id);
