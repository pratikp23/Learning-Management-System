import mongoose from "mongoose";

const mistakeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    topic: {
        type: String,
        required: true
    },
    question: {
        type: String,
        required: true
    },
    wrongAnswer: {
        type: String,
        required: true
    },
    correctAnswer: {
        type: String,
        required: true
    },
    explanation: {
        type: String
    },
    count: {
        type: Number,
        default: 1
    }
}, { timestamps: true });

const Mistake = mongoose.model("Mistake", mistakeSchema);
export default Mistake;
