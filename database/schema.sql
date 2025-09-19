-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- quiz questions Table
CREATE TABLE quiz_questions (
    id SERIAL PRIMARY KEY,
    question_text TEXT NOT NULL,
    option_a VARCHAR(255) NOT NULL,
    option_b VARCHAR(255) NOT NULL,
    option_c VARCHAR(255) NOT NULL,
    option_d VARCHAR(255) NOT NULL,
    correct_answer CHAR(1) CHECK (correct_answer IN ('A', 'B', 'C', 'D')),
    created_by INT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- quiz results Table
CREATE TABLE quiz_results (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    total_questions INT NOT NULL,
    correct_answers INT NOT NULL,
    time_taken VARCHAR(5) NOT NULL,
    score INT NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

--Sample data for questions
INSERT INTO quiz_questions (question_text, option_a, option_b, option_c, option_d, correct_answer)
VALUES
('What does ReadWriteds specialize in?', 
 'Data migration services', 
 'Graphic design', 
 'Manufacturing solutions', 
 'Retail sales', 
 'A'),

('What is ReadWriteds'' mission?', 
 'To sell the most hardware', 
 'Transform raw data into clear narratives', 
 'Build mobile apps', 
 'Provide loans', 
 'B'),

('Which core value does ReadWriteds promote?', 
 'Speed over quality', 
 'Data secrecy only', 
 'Innovation, Collaboration, Excellence', 
 'Lowest price always', 
 'C'),

('What type of training programs does ReadWriteds offer?', 
 'Agriculture training', 
 'Data Engineering & Analytics', 
 'Retail operations training', 
 'Fashion design', 
 'B'),

('Where is ReadWriteds located?', 
 'Abuja', 
 'Lagos (Ajah)', 
 'Port Harcourt', 
 'Kano', 
 'B'),

('What is one of the services offered by ReadWriteds?', 
 'Cloud Infrastructure & SAP solutions', 
 'Pet grooming', 
 'Vehicle repairs', 
 'Food delivery', 
 'A'),

('What kind of client sizes does ReadWriteds work with?', 
 'Only small startups', 
 'Only large enterprises', 
 'Businesses of all sizes', 
 'Only government agencies', 
 'C'),

('What is ReadWriteds'' vision?', 
 'To dominate fashion industry', 
 'Empowering humanity’s potential through data', 
 'To be a fast food giant', 
 'To eliminate competition', 
 'B');

-- create sample user data, password is 'Password123'
INSERT INTO users (full_name, email, password_hash)
VALUES
('George Enesi', 'demo@gmail.com', '$2a$12$Dn7d589SQBXgzUGYWE4V2.HoV2woxiaCrmbypzcwgh9xF9eWqi7Za');

