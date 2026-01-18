import Quiz from '../models/quiz.model.js'; //

// @desc    Add a new question
// @route   POST /api/admin/questions
export const addQuestion = async (req, res) => {
    try {
        const { category, questionText, options, correctAnswer, difficulty } = req.body;

        // Validation: Ensure correctAnswer is one of the options
        if (!options.includes(correctAnswer)) {
            return res.status(400).json({ message: "Correct answer must match one of the options." });
        }

        const question = await Quiz.create({
            category,
            questionText,
            options,
            correctAnswer,
            difficulty
        });

        res.status(201).json({ success: true, data: question });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getBattleQuestions = async (req, res) => {
    try {
        const { category } = req.query;
        // Fetch 5 random questions from the category
        const questions = await Quiz.aggregate([
            { $match: { category: category || "other" } },
            { $sample: { size: 5 } }
        ]);

        res.status(200).json({ success: true, data: questions });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Update existing question
// @route   PUT /api/admin/questions/:id
export const updateQuestion = async (req, res) => {
    try {
        let question = await Quiz.findById(req.params.id);

        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }

        // Manipulation: Merge existing data with updates
        question = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: question });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Delete a question (Admin only)
// @route   DELETE /api/admin/questions/:id
export const deleteQuestion = async (req, res) => {
    try {
        const question = await Quiz.findByIdAndDelete(req.params.id);
        if (!question) return res.status(404).json({ message: "Not found" });
        
        res.status(200).json({ success: true, message: "Question deleted" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
