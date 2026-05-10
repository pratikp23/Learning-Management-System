
import React, { useState, useEffect } from "react";
import home from "../assets/home3.jpg";
import Nav from "../components/Nav";
import { SiViaplay } from "react-icons/si";
import Logos from "../components/Logos";
import Cardspage from "../components/Cardspage";
import ExploreCourses from "../components/ExploreCourses";
import About from "../components/About";
import ai from "../assets/ai.png";
import ai1 from "../assets/SearchAi.png";
import ReviewPage from "../components/ReviewPage";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  const texts = [
    "GROW YOUR SKILLS WITH US",
    "MASTER THE FUTURE",
    "LEARN WITHOUT LIMITS",
    "BUILD YOUR DREAM CAREER"
  ];

  useEffect(() => {
    const handleType = () => {
      const i = loopNum % texts.length;
      const fullText = texts[i];

      setText(isDeleting
        ? fullText.substring(0, text.length - 1)
        : fullText.substring(0, text.length + 1)
      );

      setTypingSpeed(isDeleting ? 30 : 150);

      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), 2000); // Pause at end
      } else if (isDeleting && text === "") {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, typingSpeed, texts]);

  return (
    <div className="w-full overflow-hidden bg-transparent">
      {/* Hero Section */}
      <div className="w-full min-h-screen relative flex flex-col items-center justify-start pt-24 pb-12">
        <Nav />

        {/* Background Image with Overlay */}
        <div className="absolute top-0 left-0 w-full h-full z-[-1]">
          <img
            src={home}
            className="object-cover w-full h-full opacity-60"
            alt="Background"
          />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-[rgba(15,12,41,0.7)] to-[var(--primary-bg)]"></div>
        </div>

        {/* Hero Content */}
        <div className="flex flex-col items-center justify-center text-center mt-[10vh] px-4 animate-slide-up z-10 w-full max-w-5xl">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight min-h-[160px] md:min-h-[200px]">
            <span className="block text-white mb-2" style={{ textShadow: "0 0 40px rgba(0,0,0,0.5)" }}>
              {loopNum % 2 === 0 ? "GROW YOUR" : "UNLOCK YOUR"}
            </span>
            <span className="text-gradient drop-shadow-[0_0_25px_rgba(0,243,255,0.6)] border-r-4 border-[var(--neon-blue)] pr-2 animate-pulse">
              {text}
            </span>
          </h1>

          <p className="text-gray-300 text-lg md:text-2xl mb-12 max-w-2xl font-light glass p-4 rounded-xl">
            Unlock your potential with our premium courses and AI-powered learning tools.
          </p>

          <div className="flex flex-row gap-6 mt-4">
            <button
              className="group relative px-8 py-4 bg-transparent border-2 border-[var(--neon-blue)] text-white rounded-full text-lg font-semibold overflow-hidden transition-all hover:scale-105 btn-glow cursor-pointer"
              onClick={() => navigate("/allcourses")}
            >
              <span className="relative z-10 flex items-center gap-3">
                View All Courses <SiViaplay className="w-6 h-6 group-hover:animate-pulse" />
              </span>
              <div className="absolute inset-0 bg-[var(--neon-blue)] opacity-0 group-hover:opacity-10 transition-opacity"></div>
            </button>

            <button
              className="group relative px-8 py-4 bg-white text-black rounded-full text-lg font-semibold overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] cursor-pointer"
              onClick={() => navigate("/searchwithai")}
            >
              <span className="relative z-10 flex items-center gap-3">
                Search with AI
                <img
                  src={ai}
                  className="w-8 h-8 rounded-full ml-1 hidden lg:block"
                  alt="AI"
                />
                <img
                  src={ai1}
                  className="w-8 h-8 rounded-full ml-1 lg:hidden"
                  alt="AI"
                />
              </span>
            </button>
          </div>
        </div>
      </div>

      <Logos />

      <div className="relative z-10 space-y-20 pb-20">
        <ExploreCourses />
        <Cardspage />
        <About />
        <ReviewPage />
      </div>

      <Footer />
    </div>
  );
}

export default Home;
