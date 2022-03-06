CREATE TYPE job_status AS ENUM ('in_progress', 'completed', 'enqueued','failed');

CREATE TABLE job_table (job_id serial PRIMARY KEY NOT NULL, job_name varchar(255), job_status JOB_STATUS, job_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP);