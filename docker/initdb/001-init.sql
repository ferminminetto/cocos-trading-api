-- Will execute only on volume initialization.
-- Roles
CREATE DATABASE cocos_dev  OWNER tester;
CREATE DATABASE cocos_test OWNER tester;

GRANT ALL PRIVILEGES ON DATABASE cocos_dev  TO tester;
GRANT ALL PRIVILEGES ON DATABASE cocos_test TO tester;

\connect cocos_dev;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

\connect cocos_test;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;