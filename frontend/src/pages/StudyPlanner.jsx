import React, { useState } from "react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import axios from "axios";
import { serverUrl } from "../App";
import { toast } from "react-toastify";
import { FiCalendar, FiClock, FiTarget, FiCheckCircle } from "react-icons/fi";

const StudyPlanner = () => {
  const [goal, setGoal] = useState("");
  const [days, setDays] = useState(30);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const generatePlan = async () => {
    if (!goal.trim()) return toast.error("Please enter a goal");
    
    setLoading(true);
    try {
      const { data } = await axios.post(`${serverUrl}/api/ai/generate-study-plan`, { goal, days });
      setPlan(data);
      toast.success("Study plan generated!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate study plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--primary-bg)] text-white font-['Outfit']">
      <Nav />
      
      <div className="pt-32 pb-24 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">AI Study Planner</h1>
            <p className="text-gray-400">Master any skill with a structured daily schedule.</p>
          </div>

          <div className="glass p-8 rounded-3xl border border-white/5 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-bold text-gray-500 uppercase mb-3">What is your goal?</label>
                <input
                  type="text"
                  placeholder="e.g. Learn React, Master DSA..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-[var(--neon-blue)]"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-500 uppercase mb-3">Days to complete</label>
                <input
                  type="number"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-[var(--neon-blue)]"
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                />
              </div>
            </div>
            <button
              onClick={generatePlan}
              className="w-full bg-white text-black py-4 rounded-2xl font-bold text-lg hover:scale-[1.02] active:scale-95 transition-all"
            >
              Generate My Schedule
            </button>
          </div>

          {plan && (
            <div className="space-y-8 animate-fade-in">
              {plan.map((phase, idx) => (
                <div key={idx} className="relative pl-12 group">
                  <div className="absolute left-0 top-0 w-8 h-8 bg-[var(--neon-blue)] rounded-full flex items-center justify-center text-black font-bold shadow-[0_0_15px_rgba(0,243,255,0.4)]">
                    {idx + 1}
                  </div>
                  <div className="glass p-8 rounded-3xl border border-white/5 group-hover:border-white/10 transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold text-[var(--neon-blue)]">{phase.focus}</h3>
                      <span className="text-sm font-bold text-gray-500 bg-white/5 px-3 py-1 rounded-lg">Day {phase.day}</span>
                    </div>
                    <ul className="space-y-3">
                      {phase.tasks.map((task, tIdx) => (
                        <li key={tIdx} className="flex items-center gap-3 text-gray-300">
                          <FiCheckCircle className="text-green-500" />
                          {task}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default StudyPlanner;
