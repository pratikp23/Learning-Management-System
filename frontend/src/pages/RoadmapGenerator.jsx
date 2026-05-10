import React, { useState } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { toast } from "react-toastify";
import { FiSend, FiZap, FiTarget, FiMap } from "react-icons/fi";

const RoadmapGenerator = () => {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return toast.error("Please enter a topic");

    setLoading(true);
    try {
      const { data } = await axios.post(`${serverUrl}/api/ai/generate-roadmap`, { topic });
      setRoadmap(data);
      toast.success("Roadmap generated successfully!");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to generate roadmap");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--primary-bg)] text-white font-['Outfit']">
      <Nav />
      
      {/* Hero Section */}
      <div className="pt-32 pb-12 px-6">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight bg-gradient-to-r from-[var(--neon-blue)] via-[var(--neon-purple)] to-[var(--neon-blue)] bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient-flow">
            AI Roadmap Generator
          </h1>
          <p className="text-gray-400 text-lg mb-12 max-w-2xl mx-auto">
            Unlock your potential with a personalized learning path. Tell our AI what you want to master, and we'll map out the journey for you.
          </p>

          {/* Input Area */}
          <form onSubmit={handleGenerate} className="relative group max-w-2xl mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative flex items-center bg-[#0d0d1a] border border-white/10 rounded-2xl p-2 focus-within:border-[var(--neon-blue)] transition-all">
              <input
                type="text"
                placeholder="e.g. Master Web Development, Learn AI, Blockchain Basics..."
                className="w-full bg-transparent border-none outline-none px-6 py-4 text-white placeholder-gray-500 text-lg"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] text-black px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Generate</span>
                    <FiZap size={20} />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Roadmap Content */}
      <div className="container mx-auto px-6 pb-24">
        {roadmap ? (
          <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="flex items-center gap-4 mb-12">
              <div className="p-3 bg-[var(--neon-blue)]/10 rounded-xl border border-[var(--neon-blue)]/20 text-[var(--neon-blue)]">
                <FiMap size={32} />
              </div>
              <h2 className="text-3xl font-bold">{roadmap.title}</h2>
            </div>

            <div className="relative space-y-12">
              {/* Vertical Line */}
              <div className="absolute left-6 top-8 bottom-8 w-[2px] bg-gradient-to-b from-[var(--neon-blue)] via-[var(--neon-purple)] to-[var(--neon-blue)] opacity-20"></div>

              {roadmap.phases.map((phase, idx) => (
                <div key={idx} className="relative pl-16 group">
                  {/* Phase Marker */}
                  <div className="absolute left-0 top-0 w-12 h-12 bg-[#0d0d1a] border-2 border-[var(--neon-blue)] rounded-full flex items-center justify-center text-[var(--neon-blue)] font-bold shadow-[0_0_15px_rgba(0,243,255,0.2)] group-hover:shadow-[0_0_20px_rgba(0,243,255,0.4)] transition-all">
                    {idx + 1}
                  </div>

                  <div className="glass p-8 rounded-3xl border border-white/5 hover:border-white/10 transition-all">
                    <h3 className="text-2xl font-bold text-[var(--neon-blue)] mb-6 flex items-center gap-3">
                      <FiTarget />
                      {phase.name}
                    </h3>
                    
                    <div className="grid gap-6 md:grid-cols-2">
                      {phase.items.map((item, iIdx) => (
                        <div key={iIdx} className="bg-white/5 p-5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all">
                          <h4 className="font-bold text-lg text-white mb-2">{item.title}</h4>
                          <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          !loading && (
            <div className="text-center py-20 opacity-30">
              <FiTarget size={64} className="mx-auto mb-6 text-gray-500" />
              <p className="text-xl">Your roadmap will appear here...</p>
            </div>
          )
        )}
      </div>

      <Footer />
    </div>
  );
};

export default RoadmapGenerator;
