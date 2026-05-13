import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { serverUrl } from '../App';
import { FaFileAlt, FaBriefcase, FaCheckCircle, FaExclamationCircle, FaLightbulb, FaSpinner } from 'react-icons/fa';

function ResumeAnalyzer() {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      toast.error('Please paste your resume text');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post(`${serverUrl}/api/ai/resume-analyzer`, {
        resumeText,
        jobDescription
      });
      setResult(response.data);
      toast.success('Resume analyzed successfully!');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to analyze resume');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-8 flex justify-center">
      <div className="max-w-7xl w-full animate-fade-in flex flex-col lg:flex-row gap-8">
        
        {/* Left Side: Inputs */}
        <div className="lg:w-1/2 space-y-6">
          <div className="glass-card p-8 rounded-3xl border border-white/5">
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <FaFileAlt className="text-[var(--neon-blue)]" />
              AI Resume Analyzer
            </h1>
            <p className="text-gray-400 mb-8 text-sm">
              Paste your resume and an optional job description to get an ATS match score and actionable feedback.
            </p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-widest">
                  Paste Resume Text *
                </label>
                <textarea
                  className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-[var(--neon-blue)] focus:ring-1 focus:ring-[var(--neon-blue)] transition-all h-64 custom-scrollbar"
                  placeholder="Paste your entire resume content here..."
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-widest flex items-center gap-2">
                  <FaBriefcase className="text-gray-500" />
                  Target Job Description (Optional)
                </label>
                <textarea
                  className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-[var(--neon-blue)] focus:ring-1 focus:ring-[var(--neon-blue)] transition-all h-32 custom-scrollbar"
                  placeholder="Paste the job description you are applying for..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </div>

              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="w-full bg-gradient-to-r from-[var(--neon-blue)] to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white font-bold py-4 rounded-2xl transition-all shadow-[0_0_20px_rgba(0,195,255,0.3)] hover:shadow-[0_0_30px_rgba(0,195,255,0.5)] flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin text-xl" />
                    Analyzing...
                  </>
                ) : (
                  'Analyze Resume'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Results */}
        <div className="lg:w-1/2 space-y-6">
          {!result && !loading && (
            <div className="glass-card p-8 rounded-3xl border border-white/5 h-full flex flex-col items-center justify-center text-center text-gray-500 border-dashed border-2">
              <FaFileAlt className="text-6xl mb-4 opacity-20" />
              <p className="text-xl font-bold">Awaiting Resume</p>
              <p className="text-sm mt-2">Your analysis results will appear here</p>
            </div>
          )}

          {loading && (
            <div className="glass-card p-8 rounded-3xl border border-white/5 h-full flex flex-col items-center justify-center">
              <FaSpinner className="animate-spin text-[var(--neon-blue)] text-5xl mb-4" />
              <p className="text-white font-bold animate-pulse">Our AI is reviewing your resume...</p>
            </div>
          )}

          {result && !loading && (
            <div className="glass-card p-8 rounded-3xl border border-white/5 space-y-8 animate-fade-in relative overflow-hidden">
              
              {/* Background gradient blob for score */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--neon-blue)] opacity-10 blur-[100px] rounded-full pointer-events-none"></div>

              {/* Score Section */}
              <div className="text-center pb-8 border-b border-white/10 relative z-10">
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">ATS Match Score</h2>
                <div className="inline-flex items-center justify-center w-32 h-32 rounded-full border-8 border-white/5 relative">
                  <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      className="text-white/5 stroke-current"
                      strokeWidth="8"
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                    />
                    <circle
                      className={`${result.score >= 80 ? 'text-green-500' : result.score >= 50 ? 'text-yellow-500' : 'text-red-500'} stroke-current transition-all duration-1000 ease-out`}
                      strokeWidth="8"
                      strokeLinecap="round"
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - result.score / 100)}`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-4xl font-bold text-white">{result.score}</span>
                    <span className="text-xs text-gray-500">/ 100</span>
                  </div>
                </div>
              </div>

              {/* Strengths */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-green-400 uppercase tracking-widest flex items-center gap-2">
                  <FaCheckCircle /> Strengths
                </h3>
                <ul className="space-y-2">
                  {result.strengths?.map((strength, idx) => (
                    <li key={idx} className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                      <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-sm text-gray-300">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Weaknesses */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-red-400 uppercase tracking-widest flex items-center gap-2">
                  <FaExclamationCircle /> Missing Keywords & Weaknesses
                </h3>
                <ul className="space-y-2">
                  {result.weaknesses?.map((weakness, idx) => (
                    <li key={idx} className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                      <FaExclamationCircle className="text-red-500 mt-1 flex-shrink-0" />
                      <span className="text-sm text-gray-300">{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tips */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-yellow-400 uppercase tracking-widest flex items-center gap-2">
                  <FaLightbulb /> Actionable Tips
                </h3>
                <ul className="space-y-2">
                  {result.tips?.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                      <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0 shadow-[0_0_10px_rgba(250,204,21,0.8)]"></div>
                      <span className="text-sm text-gray-300">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default ResumeAnalyzer;
