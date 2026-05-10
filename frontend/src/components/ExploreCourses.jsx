import React from 'react'
import { SiViaplay, SiGoogledataproc, SiOpenaigym } from "react-icons/si";
import { TbDeviceDesktopAnalytics, TbBrandOpenai } from "react-icons/tb";
import { LiaUikit } from "react-icons/lia";
import { MdAppShortcut } from "react-icons/md";
import { FaHackerrank } from "react-icons/fa";
import { BsClipboardDataFill } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';

function ExploreCourses() {
  const navigate = useNavigate()

  const categories = [
    { name: "Web Development", icon: <TbDeviceDesktopAnalytics className='w-full h-full text-[var(--neon-blue)]' />, color: "border-[var(--neon-blue)]" },
    { name: "UI/UX Design", icon: <LiaUikit className='w-full h-full text-[#ff0080]' />, color: "border-[#ff0080]" },
    { name: "App Development", icon: <MdAppShortcut className='w-full h-full text-[#7928ca]' />, color: "border-[#7928ca]" },
    { name: "Ethical Hacking", icon: <FaHackerrank className='w-full h-full text-[#00dfd8]' />, color: "border-[#00dfd8]" },
    { name: "AI/ML", icon: <TbBrandOpenai className='w-full h-full text-[#ff4d4d]' />, color: "border-[#ff4d4d]" },
    { name: "Data Science", icon: <SiGoogledataproc className='w-full h-full text-[#1c7eff]' />, color: "border-[#1c7eff]" },
    { name: "Data Analytics", icon: <BsClipboardDataFill className='w-full h-full text-[#f5a623]' />, color: "border-[#f5a623]" },
    { name: "AI Tools", icon: <SiOpenaigym className='w-full h-full text-[#47e6b1]' />, color: "border-[#47e6b1]" },
  ]

  return (
    <div className='w-full py-20 px-6 flex flex-col lg:flex-row items-center justify-center gap-12 bg-transparent'>
      {/* Text Section */}
      <div className='w-full lg:w-[400px] flex flex-col items-start gap-4'>
        <h2 className='text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400'>
          Explore <br /> Our Courses
        </h2>
        <p className='text-gray-400 text-lg font-light leading-relaxed mb-6'>
          Discover a wide range of courses designed to help you master new skills and advance your career. From coding to design, we have something for everyone.
        </p>
        <button
          className='px-8 py-3 border border-white/20 bg-white/5 hover:bg-white/10 rounded-full text-white text-lg flex items-center gap-3 transition-all duration-300 backdrop-blur-sm shadow-[0_4px_24px_rgba(0,0,0,0.2)] hover:shadow-[0_4px_32px_rgba(0,243,255,0.2)]'
          onClick={() => navigate("/allcourses")}
        >
          Explore Courses <SiViaplay className='w-6 h-6' />
        </button>
      </div>

      {/* Categories Grid */}
      <div className='flex-1 flex flex-wrap justify-center gap-6 max-w-4xl'>
        {categories.map((cat, index) => (
          <div key={index} className='group w-[120px] h-[150px] flex flex-col items-center justify-center gap-4 glass-card rounded-2xl cursor-pointer hover:-translate-y-2'>
            <div className={`w-[70px] h-[70px] rounded-xl flex items-center justify-center bg-[rgba(255,255,255,0.03)] border border-white/10 ${cat.color} shadow-[0_0_15px_rgba(0,0,0,0.2)] group-hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all`}>
              <div className="w-[40px] h-[40px]">
                {cat.icon}
              </div>
            </div>
            <span className='text-xs font-medium text-gray-300 text-center px-1 group-hover:text-white transition-colors'>{cat.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ExploreCourses
