const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Exam = require('./models/Exam');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB...');

  await User.deleteMany({});
  await Exam.deleteMany({});

  const admin = await User.create({
    name: 'Admin User', email: 'admin@exam.com',
    password: 'admin123', role: 'admin',
  });

  await User.create([
    { name: 'Alice Johnson', email: 'alice@exam.com', password: 'student123', role: 'student' },
    { name: 'Bob Smith',     email: 'bob@exam.com',   password: 'student123', role: 'student' },
  ]);

  await Exam.create([
    {
      title: 'JavaScript Fundamentals', description: 'Test your JS basics knowledge.',
      duration: 30, passingMarks: 3, isActive: true, createdBy: admin._id,
      questions: [
        { questionText: 'Which keyword declares a block-scoped variable?', options: ['var','let','function','const'], correctAnswer: 1, marks: 1 },
        { questionText: 'What does === check?', options: ['Value only','Type only','Value and type','Neither'], correctAnswer: 2, marks: 1 },
        { questionText: 'Which method adds to end of array?', options: ['push()','pop()','shift()','unshift()'], correctAnswer: 0, marks: 1 },
        { questionText: 'What is typeof null?', options: ['"null"','"undefined"','"object"','"boolean"'], correctAnswer: 2, marks: 1 },
        { questionText: 'Which is NOT a JS data type?', options: ['String','Boolean','Float','Symbol'], correctAnswer: 2, marks: 1 },
      ],
    },
    {
      title: 'HTML & CSS Basics', description: 'Fundamental web development concepts.',
      duration: 20, passingMarks: 3, isActive: true, createdBy: admin._id,
      questions: [
        { questionText: 'What does HTML stand for?', options: ['Hyper Text Markup Language','High Tech Modern Language','Hyper Transfer Markup Language','Home Tool Markup Language'], correctAnswer: 0, marks: 1 },
        { questionText: 'Which CSS property controls text size?', options: ['text-size','font-size','text-style','font-style'], correctAnswer: 1, marks: 1 },
        { questionText: 'Which HTML tag creates a hyperlink?', options: ['<link>','<a>','<href>','<url>'], correctAnswer: 1, marks: 1 },
        { questionText: 'What does CSS stand for?', options: ['Cascading Style Sheets','Creative Style System','Computer Style Sheets','Colorful Style Sheets'], correctAnswer: 0, marks: 1 },
        { questionText: 'Which property makes a flex container?', options: ['display: block','display: flex','display: grid','display: inline'], correctAnswer: 1, marks: 1 },
      ],
    },
    {
      title: 'React.js Basics', description: 'Core React concepts and hooks.',
      duration: 25, passingMarks: 3, isActive: true, createdBy: admin._id,
      questions: [
        { questionText: 'Which hook manages state in React?', options: ['useEffect','useState','useRef','useContext'], correctAnswer: 1, marks: 1 },
        { questionText: 'What does JSX stand for?', options: ['JavaScript XML','Java Syntax Extension','JSON XML','JavaScript Extension'], correctAnswer: 0, marks: 1 },
        { questionText: 'Which method renders a React component to DOM?', options: ['React.render()','ReactDOM.render()','React.mount()','ReactDOM.mount()'], correctAnswer: 1, marks: 1 },
        { questionText: 'What is a React prop?', options: ['Internal state','External data passed to component','A lifecycle method','A CSS class'], correctAnswer: 1, marks: 1 },
        { questionText: 'Which hook runs after every render?', options: ['useState','useCallback','useEffect','useMemo'], correctAnswer: 2, marks: 1 },
      ],
    },
  ]);

  console.log('\n✓ Seed complete!');
  console.log('─────────────────────────────');
  console.log('Admin   → admin@exam.com  / admin123');
  console.log('Student → alice@exam.com  / student123');
  console.log('Student → bob@exam.com    / student123');
  console.log('─────────────────────────────');
  process.exit(0);
}

seed().catch((err) => { console.error(err); process.exit(1); });
