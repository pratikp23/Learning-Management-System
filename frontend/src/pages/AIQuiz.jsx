import React, { useState, useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { toast } from "react-toastify";
import { FiHelpCircle, FiCheck, FiX, FiArrowRight, FiRotateCcw, FiZap, FiClock } from "react-icons/fi";

const AIQuiz = () => {
  const [topic, setTopic] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [customTime, setCustomTime] = useState(30);
  const [timerActive, setTimerActive] = useState(false);
  const [isTimedMode, setIsTimedMode] = useState(false);

  // Timer logic
  useEffect(() => {
    let timer;
    if (isTimedMode && timerActive && timeLeft > 0 && selectedOption === null) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isTimedMode && timeLeft === 0 && selectedOption === null) {
      // Time's up!
      handleTimeUp();
    }
    return () => clearInterval(timer);
  }, [timerActive, timeLeft, selectedOption, isTimedMode]);

  const handleTimeUp = () => {
    setSelectedOption(-1); // Special value for time up
    toast.warning("Time is up!");
    setExplanation(questions[currentIndex].explanation);
    
    // Track mistake (time out)
    trackMistakeOnServer(-1);
  };

  const startQuiz = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return toast.error("Please enter a topic");
    
    setLoading(true);
    try {
      const { data } = await axios.post(`${serverUrl}/api/ai/generate-quiz`, { topic, count: 5 });
      setQuestions(data);
      setCurrentIndex(0);
      setScore(0);
      setShowResult(false);
      setSelectedOption(null);
      setExplanation("");
      setTimeLeft(customTime);
      setTimerActive(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to generate quiz");
    } finally {
      setLoading(false);
    }
  };

  const trackMistakeOnServer = async (idx) => {
    try {
      await axios.post(`${serverUrl}/api/ai/track-mistake`, {
        topic,
        question: questions[currentIndex].question,
        wrongAnswer: idx === -1 ? "Timed Out" : questions[currentIndex].options[idx],
        correctAnswer: questions[currentIndex].options[questions[currentIndex].correctAnswerIndex],
        explanation: questions[currentIndex].explanation
      }, { withCredentials: true });
    } catch (e) {
      console.error("Failed to track mistake", e);
    }
  };

  const handleOptionSelect = async (idx) => {
    if (selectedOption !== null || timeLeft === 0) return;
    
    setSelectedOption(idx);
    const correct = questions[currentIndex].correctAnswerIndex === idx;
    
    if (correct) {
      setScore(score + 1);
      toast.success("Correct!");
    } else {
      toast.error("Wrong answer");
      trackMistakeOnServer(idx);
    }
    setExplanation(questions[currentIndex].explanation);
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setExplanation("");
      setTimeLeft(customTime);
    } else {
      setShowResult(true);
      setTimerActive(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--primary-bg)] text-white font-['Outfit']">
      <Nav />
      
      <div className="pt-32 pb-24 px-6">
        <div className="container mx-auto max-w-3xl">
          {!questions.length ? (
            <div className="text-center animate-fade-in">
              <h1 className="text-5xl font-bold mb-6">Technical Quiz Generator</h1>
              <p className="text-gray-400 text-lg mb-12">Test your skills in Programming, IT, and Computer Science.</p>
              
              <form onSubmit={startQuiz} className="glass p-8 rounded-3xl border border-white/5 max-w-xl mx-auto">
                <input
                  type="text"
                  placeholder="Enter technical topic (e.g. React, Python, Cloud...)"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-[var(--neon-blue)] outline-none mb-6"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
                
                <div className="mb-8 space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-3">
                      <FiClock className={isTimedMode ? "text-[var(--neon-blue)]" : "text-gray-500"} />
                      <span className="font-bold">Timed Challenge</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsTimedMode(!isTimedMode)}
                      className={`w-14 h-8 rounded-full transition-all relative ${isTimedMode ? 'bg-[var(--neon-blue)]' : 'bg-white/10'}`}
                    >
                      <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${isTimedMode ? 'left-7' : 'left-1'}`}></div>
                    </button>
                  </div>

                  {isTimedMode && (
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 animate-fade-in">
                      <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Seconds per question</span>
                      <input
                        type="number"
                        min="5"
                        max="120"
                        className="w-20 bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-center focus:border-[var(--neon-blue)] outline-none"
                        value={customTime}
                        onChange={(e) => setCustomTime(parseInt(e.target.value) || 30)}
                      />
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] text-black py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all hover:scale-[1.02]"
                >
                  {loading ? <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div> : <><FiZap /> Generate Quiz</>}
                </button>
              </form>
            </div>
          ) : !showResult ? (
            <div className="animate-fade-in">
              <div className="flex items-center justify-between mb-8">
                <span className="text-[var(--neon-blue)] font-bold uppercase tracking-widest text-sm">Question {currentIndex + 1} / {questions.length}</span>
                <div className="flex items-center gap-4">
                    {isTimedMode && (
                        <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${timeLeft < 10 ? 'border-red-500 text-red-500 animate-pulse' : 'border-[var(--neon-blue)] text-[var(--neon-blue)]'} font-bold transition-all`}>
                            {timeLeft}
                        </div>
                    )}
                    <span className="text-gray-500 font-bold">Score: {score}</span>
                </div>
              </div>

              <div className="glass p-10 rounded-[40px] border border-white/10 relative overflow-hidden">
                <h2 className="text-2xl font-bold mb-8 leading-tight">{questions[currentIndex].question}</h2>
                
                <div className="space-y-4">
                  {questions[currentIndex].options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleOptionSelect(idx)}
                      className={`w-full text-left p-5 rounded-2xl border transition-all flex items-center justify-between ${
                        selectedOption === null 
                          ? "bg-white/5 border-white/10 hover:border-white/30" 
                          : idx === questions[currentIndex].correctAnswerIndex 
                            ? "bg-green-500/20 border-green-500 text-green-400" 
                            : selectedOption === idx 
                              ? "bg-red-500/20 border-red-500 text-red-400" 
                              : "bg-white/5 border-white/10 opacity-50"
                      }`}
                    >
                      <span>{option}</span>
                      {selectedOption !== null && idx === questions[currentIndex].correctAnswerIndex && <FiCheck />}
                      {selectedOption === idx && idx !== questions[currentIndex].correctAnswerIndex && <FiX />}
                    </button>
                  ))}
                </div>

                {explanation && (
                  <div className="mt-8 p-6 bg-white/5 rounded-2xl border border-white/5 animate-slide-up">
                    <p className="text-sm text-gray-400 mb-2 font-bold uppercase tracking-widest">Explanation</p>
                    <p className="text-gray-300">{explanation}</p>
                  </div>
                )}

                {selectedOption !== null && (
                  <div className="flex justify-end mt-8">
                    <button
                      onClick={nextQuestion}
                      className="bg-white text-black px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all"
                    >
                      {currentIndex === questions.length - 1 ? "Show Results" : "Next Question"} <FiArrowRight />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center animate-fade-in">
              <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiCheck size={40} />
              </div>
              <h1 className="text-5xl font-bold mb-4">Quiz Completed!</h1>
              <p className="text-gray-400 text-xl mb-8">You scored {score} out of {questions.length}</p>
              
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setQuestions([])}
                  className="bg-white text-black px-10 py-4 rounded-2xl font-bold flex items-center gap-2 hover:scale-105 transition-all"
                >
                  <FiRotateCcw /> Try Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AIQuiz;
