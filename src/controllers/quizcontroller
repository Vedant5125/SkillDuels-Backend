import Quiz from '../models/Quiz';

// 1. This grabs 5 random questions from our ONLY category
const getBattleQuestions = async (req, res) => {
  try {
    // We just ask the database to give us 5 random items from the collection
    const questions = await Quiz.aggregate([
      { $sample: { size: 5 } } 
    ]);

    if (questions.length === 0) {
      return res.status(404).json({ message: "The toy box is empty! Add questions first." });
    }

    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: "The robot tripped while grabbing questions!" });
  }
};

// 2. This is for the Boss (Admin) to add questions to that one category
const addQuestion = async (req, res) => {
  try {
    const newQuestion = new Quiz(req.body);
    await newQuestion.save();
    res.status(201).json({ message: 'Added a new question to the box!' });
  } catch (error) {
    res.status(400).json({ message: 'Something is wrong with this question!' });
  }
};

module.exports = { getBattleQuestions, addQuestion };
