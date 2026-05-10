-- DCHub Database Initialization

CREATE TABLE IF NOT EXISTS users (
                                     id BIGSERIAL PRIMARY KEY,
                                     username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT NOW()
    );

-- Категории (опционално, простор за идна имплементација)
CREATE TABLE IF NOT EXISTS categories (
                                          id BIGSERIAL PRIMARY KEY,
                                          name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
    );

CREATE TABLE IF NOT EXISTS data_entries (
                                            id BIGSERIAL PRIMARY KEY,
                                            title VARCHAR(255) NOT NULL,
    content TEXT,                          -- за директен текст input
    file_path VARCHAR(500),                -- за upload на фајл
    file_name VARCHAR(255),
    file_type VARCHAR(50),                 -- pdf, docx, xlsx, csv, txt
    category_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,
    uploaded_by BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW()
    );

-- Индекси за перформанси
CREATE INDEX IF NOT EXISTS idx_data_entries_user ON data_entries(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_data_entries_category ON data_entries(category_id);
