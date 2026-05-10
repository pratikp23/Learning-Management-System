import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import aiIcon from "../assets/ai.png"
import aiResultIcon from "../assets/SearchAi.png"
import { RiMicAiFill } from "react-icons/ri";
import axios from 'axios';
import { serverUrl } from '../App';
import { useNavigate } from 'react-router-dom';
import start from "../assets/start.mp3"
import { FaArrowLeftLong, FaMagnifyingGlass } from "react-icons/fa6";
import { ClipLoader } from 'react-spinners';

function SearchWithAi() {
  const [input, setInput] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [aiMessage, setAiMessage] = useState('');
  const [listening, setListening] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();
  const startSound = new Audio(start)

  function speak(message) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    let utterance = new SpeechSynthesisUtterance(message);
    utterance.rate = 1.0;
    utterance.pitch = 1.1;
    window.speechSynthesis.speak(utterance);
  }

  const handleSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Speech recognition is not supported in your browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    
    setListening(true);
    startSound.play().catch(() => {});
    
    recognition.start();

    recognition.onresult = async (e) => {
      const transcript = e.results[0][0].transcript.trim();
      setInput(transcript);
      await handleRecommendation(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech Recognition Error:", event.error);
      setListening(false);
      if (event.error === 'not-allowed') toast.error("Microphone access denied.");
    };

    recognition.onend = () => {
      setListening(false);
    };
  };

  const handleRecommendation = async (query) => {
    const searchQuery = query || input;
    if (!searchQuery) return toast.info("Please enter or say something to search.");

    setLoading(true);
    setAiMessage('');
    try {
      const result = await axios.post(`${serverUrl}/api/ai/search`, { input: searchQuery }, { withCredentials: true });
      const { message, courses } = result.data;
      
      setRecommendations(courses);
      setAiMessage(message);
      
      if (message) {
        speak(message);
      }
    } catch (error) {
      console.error("Search Error:", error);
      toast.error("AI Assistant is having trouble right now. Please try again later.");
    } finally {
      setLoading(false);
      setListening(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-8 flex flex-col items-center">
      
      {/* Header & Back Button */}
      <div className="max-w-4xl w-full mb-12 animate-fade-in flex items-center justify-between">
        <div className="flex items-center gap-4">
          <FaArrowLeftLong 
            className="text-2xl text-gray-400 hover:text-[var(--neon-blue)] cursor-pointer transition-colors" 
            onClick={() => navigate("/")} 
          />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">AI Assistant</h1>
        </div>
      </div>

      {/* Main Search Interface */}
      <div className="max-w-3xl w-full animate-slide-up">
        <div className="glass-card p-10 rounded-[3rem] border border-white/10 relative overflow-hidden">
          {/* Animated Background Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[var(--neon-blue)]/10 blur-[80px] rounded-full"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[var(--neon-purple)]/10 blur-[80px] rounded-full"></div>

          <div className="relative flex flex-col items-center">
            <div className={`w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-8 border border-white/10 transition-all duration-500 ${listening ? 'scale-110 border-[var(--neon-blue)] shadow-[0_0_30px_rgba(0,243,255,0.2)]' : ''}`}>
              <img src={aiIcon} className={`w-12 h-12 ${listening ? 'animate-pulse' : ''}`} alt="AI" />
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-10">
              What do you want to <span className="text-gradient">master today?</span>
            </h2>

            <div className="w-full relative group">
              <input
                type="text"
                className="w-full px-8 py-5 pr-32 input-dark rounded-full text-lg font-medium shadow-2xl transition-all border-white/5 focus:border-[var(--neon-blue)]/50"
                placeholder="Ask me anything... (e.g. 'Show me Web Dev courses')"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRecommendation()}
              />
              
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {input && (
                  <button
                    onClick={() => handleRecommendation()}
                    className="p-3 bg-[var(--neon-blue)] rounded-full text-black hover:scale-110 active:scale-95 transition-all cursor-pointer shadow-[0_0_15px_rgba(0,243,255,0.3)]"
                  >
                    <FaMagnifyingGlass size={18} />
                  </button>
                )}
                <button
                  className={`p-3 rounded-full transition-all cursor-pointer active:scale-90 ${listening ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]' : 'bg-white/10 text-white hover:bg-white/20'}`}
                  onClick={handleSearch}
                >
                  <RiMicAiFill size={22} className={listening ? 'animate-bounce' : ''} />
                </button>
              </div>
            </div>

            <p className="mt-6 text-gray-500 text-sm font-medium tracking-wide">
              {listening ? "I'm listening... speak now" : "Click the mic or type to begin your journey"}
            </p>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-6xl w-full mt-20">
        {loading ? (
          <div className="flex flex-col items-center gap-4 animate-fade-in">
            <ClipLoader color="var(--neon-blue)" size={40} />
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">SkillUp AI is thinking...</p>
          </div>
        ) : (recommendations.length > 0 || aiMessage) ? (
          <div className="animate-fade-in">
            {/* AI Message Bubble */}
            {aiMessage && (
              <div className="flex justify-center mb-12">
                <div className="glass-card px-8 py-4 rounded-2xl border-l-4 border-[var(--neon-blue)] animate-slide-up shadow-xl max-w-2xl">
                  <p className="text-lg text-white font-medium italic">"{aiMessage}"</p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-center gap-4 mb-10">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/10"></div>
              <div className="flex items-center gap-3">
                <img src={aiResultIcon} className="w-10 h-10 p-2 bg-[var(--neon-blue)]/10 rounded-xl border border-[var(--neon-blue)]/20" alt="Results" />
                <h2 className="text-2xl font-bold text-white tracking-tight uppercase tracking-[0.2em] text-xs">Curated for you</h2>
              </div>
              <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/10"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recommendations.map((course, index) => (
                <div
                  key={course._id}
                  className="glass-card p-6 rounded-3xl group border border-white/5 hover:border-[var(--neon-blue)]/50 transition-all cursor-pointer animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => navigate(`/viewcourse/${course._id}`)}
                >
                  <div className="flex flex-col h-full">
                    <span className="text-[10px] font-bold text-[var(--neon-blue)] uppercase tracking-widest mb-3 bg-[var(--neon-blue)]/5 w-fit px-3 py-1 rounded-md">
                      {course.category}
                    </span>
                    <h3 className="text-xl font-bold text-white group-hover:text-[var(--neon-blue)] transition-colors line-clamp-2 mb-6">
                      {course.title}
                    </h3>
                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
                      <span className="text-xs text-gray-500 font-bold uppercase tracking-tighter">{course.level}</span>
                      <div className="text-[var(--neon-blue)] font-extrabold">₹{course.price}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          !listening && input && !loading && (
            <div className="text-center py-20 animate-fade-in">
              <p className="text-gray-500 text-xl font-medium">No direct matches found. Try asking about categories like 'Web Dev' or 'AI'.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default SearchWithAi;

