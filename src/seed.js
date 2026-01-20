import mongoose from "mongoose";
import dotenv from "dotenv";
import Quiz from "./models/quiz.model.js"; 
import connectDB from "./db/server.js";

dotenv.config({ path: "./.env" });

const questions = [
  {
    "id": 1,
    "category": "General Knowledge",
    "difficulty": "easy",
    "question": "What is the capital of India?",
    "options": ["Mumbai", "New Delhi", "Kolkata", "Chennai"],
    "correctAnswer": "New Delhi"
  },
  {
    "id": 2,
    "category": "General Knowledge",
    "difficulty": "easy",
    "question": "Which planet is known as the Red Planet?",
    "options": ["Venus", "Mars", "Jupiter", "Saturn"],
    "correctAnswer": "Mars"
  },
  {
    "id": 3,
    "category": "General Knowledge",
    "difficulty": "easy",
    "question": "How many continents are there on Earth?",
    "options": ["5", "6", "7", "8"],
    "correctAnswer": "7"
  },
  {
    "id": 4,
    "category": "General Knowledge",
    "difficulty": "easy",
    "question": "Which animal is known as the Ship of the Desert?",
    "options": ["Horse", "Elephant", "Camel", "Donkey"],
    "correctAnswer": "Camel"
  },
  {
    "id": 5,
    "category": "General Knowledge",
    "difficulty": "easy",
    "question": "What is the national bird of India?",
    "options": ["Sparrow", "Peacock", "Eagle", "Parrot"],
    "correctAnswer": "Peacock"
  },
  // {
  //   "id": 6,
  //   "category": "General Knowledge",
  //   "difficulty": "medium",
  //   "question": "Who wrote the national anthem of India?",
  //   "options": ["Bankim Chandra Chatterjee", "Rabindranath Tagore", "Sarojini Naidu", "Subhash Chandra Bose"],
  //   "correctAnswer": "Rabindranath Tagore"
  // },
  // {
  //   "id": 7,
  //   "category": "General Knowledge",
  //   "difficulty": "medium",
  //   "question": "Which is the largest ocean in the world?",
  //   "options": ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
  //   "correctAnswer": "Pacific Ocean"
  // },
  // {
  //   "id": 8,
  //   "category": "General Knowledge",
  //   "difficulty": "medium",
  //   "question": "What is the currency of Japan?",
  //   "options": ["Won", "Yen", "Dollar", "Peso"],
  //   "correctAnswer": "Yen"
  // },
  // {
  //   "id": 9,
  //   "category": "General Knowledge",
  //   "difficulty": "medium",
  //   "question": "Which gas is most abundant in the Earth’s atmosphere?",
  //   "options": ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
  //   "correctAnswer": "Nitrogen"
  // },
  // {
  //   "id": 10,
  //   "category": "General Knowledge",
  //   "difficulty": "medium",
  //   "question": "Who was the first President of India?",
  //   "options": ["Dr. Rajendra Prasad", "Jawaharlal Nehru", "Sardar Patel", "Dr. A. P. J. Abdul Kalam"],
  //   "correctAnswer": "Dr. Rajendra Prasad"
  // },
  // {
  //   "id": 11,
  //   "category": "General Knowledge",
  //   "difficulty": "hard",
  //   "question": "Which country hosted the first Olympic Games?",
  //   "options": ["Italy", "Greece", "France", "USA"],
  //   "correctAnswer": "Greece"
  // },
  // {
  //   "id": 12,
  //   "category": "General Knowledge",
  //   "difficulty": "hard",
  //   "question": "What is the hardest natural substance on Earth?",
  //   "options": ["Gold", "Iron", "Diamond", "Platinum"],
  //   "correctAnswer": "Diamond"
  // },
  // {
  //   "id": 13,
  //   "category": "General Knowledge",
  //   "difficulty": "hard",
  //   "question": "Which Indian state has the longest coastline?",
  //   "options": ["Kerala", "Tamil Nadu", "Gujarat", "Andhra Pradesh"],
  //   "correctAnswer": "Gujarat"
  // },
  // {
  //   "id": 14,
  //   "category": "General Knowledge",
  //   "difficulty": "hard",
  //   "question": "Which blood group is known as the universal donor?",
  //   "options": ["A+", "AB+", "O−", "B−"],
  //   "correctAnswer": "O−"
  // },
  // {
  //   "id": 15,
  //   "category": "General Knowledge",
  //   "difficulty": "hard",
  //   "question": "Who invented the telephone?",
  //   "options": ["Thomas Edison", "Nikola Tesla", "Alexander Graham Bell", "James Watt"],
  //   "correctAnswer": "Alexander Graham Bell"
  // },
  // {
  //   "id": 16,
  //   "category": "General Knowledge",
  //   "difficulty": "hard",
  //   "question": "Which is the smallest country in the world by area?",
  //   "options": ["Monaco", "Maldives", "Vatican City", "Liechtenstein"],
  //   "correctAnswer": "Vatican City"
  // },
  // {
  //   "id": 17,
  //   "category": "General Knowledge",
  //   "difficulty": "hard",
  //   "question": "Which river is known as the 'Sorrow of Bihar'?",
  //   "options": ["Ganga", "Kosi", "Yamuna", "Brahmaputra"],
  //   "correctAnswer": "Kosi"
  // },
  // {
  //   "id": 18,
  //   "category": "General Knowledge",
  //   "difficulty": "hard",
  //   "question": "What does CPU stand for?",
  //   "options": ["Central Processing Unit", "Computer Personal Unit", "Central Power Unit", "Control Processing Unit"],
  //   "correctAnswer": "Central Processing Unit"
  // },
  // {
  //   "id": 19,
  //   "category": "General Knowledge",
  //   "difficulty": "hard",
  //   "question": "Which metal is liquid at room temperature?",
  //   "options": ["Iron", "Mercury", "Aluminium", "Lead"],
  //   "correctAnswer": "Mercury"
  // },
  // {
  //   "id": 20,
  //   "category": "General Knowledge",
  //   "difficulty": "hard",
  //   "question": "Which organ in the human body purifies blood?",
  //   "options": ["Heart", "Lungs", "Kidneys", "Liver"],
  //   "correctAnswer": "Kidneys"
  // }
];

const seedDB = async () => {
    try {
        await connectDB();
        
        // 1. Clean existing questions
        await Quiz.deleteMany({});
        console.log("Old questions cleared.");

        // 2. Insert new questions
        await Quiz.insertMany(questions);
        console.log("✅ 20 Questions successfully seeded!");

        process.exit(0);
    } catch (error) {
        console.error("❌ Seeding failed:", error);
        process.exit(1);
    }
};

seedDB();