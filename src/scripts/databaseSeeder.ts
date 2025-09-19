import { pool } from '../config/database';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const sampleDataSeeder = async (): Promise<void> => {
  try {
    console.log('Setting up database and seeding sample data...');

    // Check if demo user exists
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', ['demo@gmail.com']);
    
    let demoUserId: number;
    
    if (existingUser.rows.length === 0) {
      // Create demo user (George Enesi with Password123)
      const passwordHash = await bcrypt.hash('Password123', 12);
      const demoUserResult = await pool.query(`
        INSERT INTO users (full_name, email, password_hash) 
        VALUES ($1, $2, $3) 
        RETURNING id
      `, ['George Enesi', 'demo@gmail.com', passwordHash]);
      
      demoUserId = demoUserResult.rows[0].id;
      console.log('Demo user created (George Enesi - demo@gmail.com, password: Password123)');
    } else {
      demoUserId = existingUser.rows[0].id;
      console.log('Demo user already exists');
    }

    // Check if sample questions exist
    const existingQuestions = await pool.query('SELECT COUNT(*) FROM quiz_questions');
    const questionCount = parseInt(existingQuestions.rows[0].count);

    if (questionCount < 8) {
      // Insert ReadWriteds sample questions
      const readWritedsQuestions = [
        ['What does ReadWriteds specialize in?', 'Data migration services', 'Graphic design', 'Manufacturing solutions', 'Retail sales', 'A'],
        ['What is ReadWriteds\' mission?', 'To sell the most hardware', 'Transform raw data into clear narratives', 'Build mobile apps', 'Provide loans', 'B'],
        ['Which core value does ReadWriteds promote?', 'Speed over quality', 'Data secrecy only', 'Innovation, Collaboration, Excellence', 'Lowest price always', 'C'],
        ['What type of training programs does ReadWriteds offer?', 'Agriculture training', 'Data Engineering & Analytics', 'Retail operations training', 'Fashion design', 'B'],
        ['Where is ReadWriteds located?', 'Abuja', 'Lagos (Ajah)', 'Port Harcourt', 'Kano', 'B'],
        ['What is one of the services offered by ReadWriteds?', 'Cloud Infrastructure & SAP solutions', 'Pet grooming', 'Vehicle repairs', 'Food delivery', 'A'],
        ['What kind of client sizes does ReadWriteds work with?', 'Only small startups', 'Only large enterprises', 'Businesses of all sizes', 'Only government agencies', 'C'],
        ['What is ReadWriteds\' vision?', 'To dominate fashion industry', 'Empowering humanity\'s potential through data', 'To be a fast food giant', 'To eliminate competition', 'B']
      ];

      for (const [questionText, optionA, optionB, optionC, optionD, correctAnswer] of readWritedsQuestions) {
        await pool.query(`
          INSERT INTO quiz_questions (question_text, option_a, option_b, option_c, option_d, correct_answer, created_by)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [questionText, optionA, optionB, optionC, optionD, correctAnswer, demoUserId]);
      }
      
      console.log('ReadWriteds sample questions inserted');
    } else {
      console.log('Sample questions already exist');
    }

    const userCount = await pool.query('SELECT COUNT(*) FROM users');
    const questionCount2 = await pool.query('SELECT COUNT(*) FROM quiz_questions');
    
    console.log(` Users: ${userCount.rows[0].count}`);
    console.log(` Questions: ${questionCount2.rows[0].count}`);
    
  } catch (error) {
    console.error('Database seeding failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
};

if (require.main === module) {
  sampleDataSeeder()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export { sampleDataSeeder };