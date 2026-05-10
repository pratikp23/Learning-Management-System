import React, { useState, useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { toast } from "react-toastify";
import { FiTrendingUp, FiTarget, FiZap, FiBookOpen, FiActivity } from "react-icons/fi";

const MistakeEngine = () => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalysis();
  }, []);

  const fetchAnalysis = async () => {
    try {
      const { data } = await axios.get(`${serverUrl}/api/ai/analyze-mistakes`, { withCredentials: true });
      setAnalysis(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to analyze mistakes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--primary-bg)] text-white font-['Outfit']">
      <Nav />
      
      <div className="pt-32 pb-24 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center gap-4 mb-12">
            <div className="p-4 bg-yellow-500/10 rounded-2xl border border-yellow-500/20 text-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.1)]">
              <FiTrendingUp size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2 tracking-tight">Learn From Your Mistakes</h1>
              <p className="text-gray-400">Our AI analyzes your wrong answers to build a personalized revision path.</p>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-[var(--neon-blue)] border-t-transparent rounded-full animate-spin mb-6"></div>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Analyzing Patterns...</p>
            </div>
          ) : analysis?.patterns ? (
            <div className="space-y-8 animate-fade-in">
              {/* Summary Card */}
              <div className="glass p-10 rounded-[40px] border border-white/10 relative overflow-hidden">
                <div className="absolute -right-20 -top-20 w-80 h-80 bg-[var(--neon-blue)]/5 blur-[100px]"></div>
                <div className="relative">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <FiActivity className="text-[var(--neon-blue)]" />
                    AI Insights Summary
                  </h2>
                  <p className="text-gray-300 text-lg leading-relaxed italic">"{analysis.summary}"</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Knowledge Gaps */}
                <div className="glass p-8 rounded-[32px] border border-white/5">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-red-400">
                    <FiTarget />
                    Identified Gaps
                  </h3>
                  <div className="space-y-4">
                    {analysis.patterns.map((pattern, idx) => (
                      <div key={idx} className="flex items-start gap-3 bg-white/5 p-4 rounded-xl border border-white/5">
                        <div className="w-2 h-2 rounded-full bg-red-400 mt-2"></div>
                        <p className="text-gray-300">{pattern}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Revision Plan */}
                <div className="glass p-8 rounded-[32px] border border-white/5">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-green-400">
                    <FiBookOpen />
                    3-Step Revision Plan
                  </h3>
                  <div className="space-y-6">
                    {analysis.revisionPlan.map((step, idx) => (
                      <div key={idx} className="relative pl-10">
                        <div className="absolute left-0 top-0 w-7 h-7 bg-green-500/20 text-green-400 rounded-lg flex items-center justify-center font-bold text-sm">
                          {idx + 1}
                        </div>
                        <p className="text-gray-300">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 opacity-30">
              <FiZap size={64} className="mx-auto mb-6 text-gray-500" />
              <p className="text-xl">{analysis?.message || "Not enough data yet. Complete some quizzes first!"}</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MistakeEngine;
