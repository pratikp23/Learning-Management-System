import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";

const Footer = () => {
  let navigate = useNavigate();
  return (
    <footer className="w-full bg-[rgba(0,0,0,0.4)] backdrop-blur-md pt-16 pb-8 px-6 border-t border-white/5 mt-auto">
      <div className="max-w-7xl mx-auto flex lg:items-start items-start justify-between gap-10 flex-col lg:flex-row mb-12">

        {/* Logo + Description */}
        <div className="lg:w-[35%] w-full">
          <div className="flex items-center gap-3 mb-4 cursor-pointer" onClick={() => navigate("/")}>
            <img src={logo} alt="Logo" className="h-12 w-12 rounded-full border-2 border-[var(--neon-blue)] shadow-[0_0_15px_rgba(0,243,255,0.3)]" />
            <span className="text-2xl font-bold text-white tracking-wide">Learn<span className="text-[var(--neon-blue)]">AI</span></span>
          </div>

          <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
            AI-powered learning platform to help you grow smarter. Unlock your potential with our premium courses and expert community. Learn anything, anytime, anywhere.
          </p>
        </div>

        {/* Quick Links */}
        <div className="lg:w-[20%] w-full">
          <h3 className="text-white font-bold text-lg mb-6 relative inline-block">
            Quick Links
            <span className="absolute bottom-[-5px] left-0 w-1/2 h-1 bg-[var(--neon-purple)] rounded-full"></span>
          </h3>
          <ul className="space-y-3 text-sm text-gray-400">
            <li className="hover:text-[var(--neon-blue)] hover:translate-x-2 transition-all cursor-pointer block" onClick={() => navigate("/")}>Home</li>
            <li className="hover:text-[var(--neon-blue)] hover:translate-x-2 transition-all cursor-pointer block" onClick={() => navigate("/allcourses")}>Courses</li>
            <li className="hover:text-[var(--neon-blue)] hover:translate-x-2 transition-all cursor-pointer block" onClick={() => navigate("/login")}>Login</li>
            <li className="hover:text-[var(--neon-blue)] hover:translate-x-2 transition-all cursor-pointer block" onClick={() => navigate("/profile")}>My Profile</li>
          </ul>
        </div>

        {/* Explore Categories */}
        <div className="lg:w-[20%] w-full">
          <h3 className="text-white font-bold text-lg mb-6 relative inline-block">
            Categories
            <span className="absolute bottom-[-5px] left-0 w-1/2 h-1 bg-[var(--neon-blue)] rounded-full"></span>
          </h3>
          <ul className="space-y-3 text-sm text-gray-400">
            <li className="hover:text-[var(--neon-purple)] hover:translate-x-2 transition-all cursor-pointer block">Web Development</li>
            <li className="hover:text-[var(--neon-purple)] hover:translate-x-2 transition-all cursor-pointer block">AI/ML</li>
            <li className="hover:text-[var(--neon-purple)] hover:translate-x-2 transition-all cursor-pointer block">Data Science</li>
            <li className="hover:text-[var(--neon-purple)] hover:translate-x-2 transition-all cursor-pointer block">UI/UX Design</li>
          </ul>
        </div>

        {/* Newsletter (Optional - Visual Filler) */}
        <div className="lg:w-[25%] w-full">
          <h3 className="text-white font-bold text-lg mb-6">Stay Updated</h3>
          <div className="flex flex-col gap-3">
            <input type="email" placeholder="Enter your email" className="w-full bg-[rgba(255,255,255,0.05)] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[var(--neon-blue)] transition-colors" />
            <button className="w-full bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity">
              Subscribe
            </button>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 pt-8 text-sm text-center text-gray-500 flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto">
        <span>© {new Date().getFullYear()} LearnAI. All rights reserved.</span>
        <div className="flex gap-6 mt-4 md:mt-0">
          <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
          <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
