-- Drop existing connections to the database:
-- https://stackoverflow.com/a/63493002/1308023
SELECT pg_terminate_backend(pg_stat_activity.pid)
FROM pg_stat_activity
WHERE pg_stat_activity.datname = 'postgres_temp'
  AND pid <> pg_backend_pid();

-- Recreate the target database:
DROP DATABASE IF EXISTS "postgres_temp";
CREATE DATABASE "postgres_temp";