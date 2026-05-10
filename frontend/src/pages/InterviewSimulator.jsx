import React, { useState } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { toast } from "react-toastify";
import { FiPlay, FiCheckCircle, FiAward, FiMessageCircle, FiBarChart2, FiCpu } from "react-icons/fi";

const InterviewSimulator = () => {
  const [role, setRole] = useState("");
  const [level, setLevel] = useState("Intermediate");
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [results, setResults] = useState([]);
  const [finished, setFinished] = useState(false);

  const startInterview = async (e) => {
    e.preventDefault();
    if (!role.trim()) return toast.error("Please enter a role");
    
    setLoading(true);
    try {
      const { data } = await axios.post(`${serverUrl}/api/ai/generate-questions`, { role, level });
      setQuestions(data.questions);
      setResults([]);
      setCurrentIndex(0);
      setFinished(false);
    } catch (error) {
      toast.error("Failed to start interview");
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!userAnswer.trim()) return toast.error("Please enter your answer");

    setLoading(true);
    try {
      const { data } = await axios.post(`${serverUrl}/api/ai/evaluate-response`, {
        question: questions[currentIndex].question,
        answer: userAnswer,
        role: role
      });
      
      const newResults = [...results, { question: questions[currentIndex].question, ...data }];
      setResults(newResults);
      setUserAnswer("");
      
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setFinished(true);
      }
    } catch (error) {
      toast.error("Failed to evaluate answer");
    } finally {
      setLoading(false);
    }
  };

  const calculateOverallScore = () => {
    if (results.length === 0) return 0;
    const total = results.reduce((acc, curr) => acc + curr.accuracyScore + curr.confidenceScore + curr.communicationScore, 0);
    return Math.round(total / (results.length * 3));
  };

  return (
    <div className="min-h-screen bg-[var(--primary-bg)] text-white font-['Outfit']">
      <Nav />
      
      <div className="pt-32 pb-24 px-6">
        <div className="container mx-auto max-w-4xl">
          {!questions.length ? (
            <div className="text-center animate-fade-in">
              <h1 className="text-5xl font-bold mb-6">AI Interview Simulator</h1>
              <p className="text-gray-400 text-lg mb-12">Select your target role and let our AI prepare you for the real deal.</p>
              
              <form onSubmit={startInterview} className="glass p-8 rounded-3xl border border-white/5 max-w-xl mx-auto">
                <div className="mb-6 text-left">
                  <label className="block text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">Target Job Role</label>
                  <input
                    type="text"
                    placeholder="e.g. Frontend Developer, Data Scientist..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-[var(--neon-blue)] outline-none transition-all"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  />
                </div>
                
                <div className="mb-8 text-left">
                  <label className="block text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">Difficulty Level</label>
                  <div className="grid grid-cols-3 gap-4">
                    {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setLevel(lvl)}
                        className={`py-3 rounded-xl border transition-all ${level === lvl ? "bg-[var(--neon-blue)] text-black border-[var(--neon-blue)]" : "bg-white/5 border-white/10 text-gray-400 hover:border-white/20"}`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] text-black py-4 rounded-2xl font-bold text-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  {loading ? <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div> : <><FiPlay /> Start Simulation</>}
                </button>
              </form>
            </div>
          ) : !finished ? (
            <div className="animate-fade-in">
              {/* Progress Bar */}
              <div className="flex items-center justify-between mb-8">
                <span className="text-[var(--neon-blue)] font-bold tracking-widest uppercase text-sm">Question {currentIndex + 1} of {questions.length}</span>
                <div className="w-64 h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--neon-blue)] transition-all duration-500" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}></div>
                </div>
              </div>

              <div className="glass p-10 rounded-[40px] border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-[var(--neon-blue)]/10 blur-[100px]"></div>
                
                <h2 className="text-3xl font-bold mb-8 leading-tight">{questions[currentIndex].question}</h2>
                
                <textarea
                  className="w-full bg-white/5 border border-white/10 rounded-3xl p-8 min-h-[250px] focus:border-[var(--neon-purple)] outline-none transition-all text-lg placeholder-gray-600 resize-none"
                  placeholder="Type your answer here... Be as detailed as possible."
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                />

                <div className="flex justify-end mt-8">
                  <button
                    onClick={submitAnswer}
                    disabled={loading}
                    className="bg-white text-black px-10 py-4 rounded-2xl font-bold hover:scale-105 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
                  >
                    {loading ? <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div> : <><FiCheckCircle /> Submit Answer</>}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="animate-fade-in">
              <div className="text-center mb-16">
                <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-orange-500/20">
                  <FiAward size={48} className="text-white" />
                </div>
                <h1 className="text-5xl font-bold mb-4">Interview Complete!</h1>
                <p className="text-gray-400 text-xl">Here is your comprehensive performance analysis.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="glass p-8 rounded-3xl border border-white/5 text-center">
                  <FiCheckCircle className="mx-auto mb-4 text-green-400" size={32} />
                  <div className="text-4xl font-bold mb-1">{Math.round(results.reduce((a,c)=>a+c.accuracyScore,0)/results.length)}/10</div>
                  <div className="text-sm text-gray-500 uppercase font-bold tracking-tighter">Technical Accuracy</div>
                </div>
                <div className="glass p-8 rounded-3xl border border-white/5 text-center">
                  <FiCpu className="mx-auto mb-4 text-blue-400" size={32} />
                  <div className="text-4xl font-bold mb-1">{Math.round(results.reduce((a,c)=>a+c.confidenceScore,0)/results.length)}/10</div>
                  <div className="text-sm text-gray-500 uppercase font-bold tracking-tighter">Confidence Level</div>
                </div>
                <div className="glass p-8 rounded-3xl border border-white/5 text-center">
                  <FiMessageCircle className="mx-auto mb-4 text-purple-400" size={32} />
                  <div className="text-4xl font-bold mb-1">{Math.round(results.reduce((a,c)=>a+c.communicationScore,0)/results.length)}/10</div>
                  <div className="text-sm text-gray-500 uppercase font-bold tracking-tighter">Communication</div>
                </div>
              </div>

              <div className="space-y-8">
                {results.map((res, idx) => (
                  <div key={idx} className="glass p-8 rounded-3xl border border-white/5">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-sm">{idx + 1}</span>
                      {res.question}
                    </h3>
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5 mb-6">
                      <p className="text-gray-300 italic">"{res.feedback}"</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {res.suggestions.map((s, i) => (
                        <span key={i} className="text-xs font-bold px-3 py-1.5 bg-[var(--neon-blue)]/10 text-[var(--neon-blue)] rounded-lg border border-[var(--neon-blue)]/20">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-16 flex justify-center gap-6">
                <button
                  onClick={() => setQuestions([])}
                  className="px-10 py-4 border border-white/10 rounded-2xl font-bold hover:bg-white/5 transition-all"
                >
                  Try Another Role
                </button>
                <button
                  className="px-10 py-4 bg-white text-black rounded-2xl font-bold hover:scale-105 transition-all"
                >
                  Download Report (PDF)
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

export default InterviewSimulator;
