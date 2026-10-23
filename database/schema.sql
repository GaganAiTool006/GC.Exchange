CREATE DATABASE IF NOT EXISTS gc_exchange CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE gc_exchange;

CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(254) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  display_name VARCHAR(80) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Use a dedicated least-privilege DB user in production. Do not expose this SQL file publicly if your host serves .sql files.
