import React from 'react'
import about from "../assets/about.jpg"
import VideoPlayer from './VideoPlayer'
import { TfiLayoutLineSolid } from "react-icons/tfi";
import { BiSolidBadgeCheck } from "react-icons/bi";

function About() {
  return (
    <div className='w-full lg:min-h-[80vh] py-20 flex flex-wrap items-center justify-center gap-12 bg-[rgba(0,0,0,0.2)]'>
      <div className='lg:w-[45%] md:w-[80%] w-[95%] h-full flex items-center justify-center relative group'>
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
        <img src={about} className='w-[90%] rounded-2xl shadow-2xl relative z-10 border border-white/10' alt="About Us" />
        <div className="absolute bottom-10 right-10 z-20">
          <VideoPlayer />
        </div>
      </div>

      <div className='lg:w-[45%] md:w-[80%] w-[95%] flex flex-col items-start justify-center p-6'>
        <div className='flex items-center gap-4 text-[var(--neon-blue)] text-xl font-medium tracking-wide mb-4'>
          <span className="uppercase">About Us</span>
          <TfiLayoutLineSolid className='w-8 h-8' />
        </div>

        <h2 className='text-4xl md:text-6xl font-bold text-white mb-6 leading-tight'>
          Maximize Your <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Learning Growth</span>
        </h2>

        <p className='text-gray-400 text-lg mb-10 leading-relaxed font-light'>
          We provide a modern Learning Management System to simplify online education, track progress, and enhance student-instructor collaboration efficiently. Experience the future of learning with our cutting-edge platform.
        </p>

        <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-6'>
          {[
            "Simplified Learning",
            "Expert Trainers",
            "Big Experience",
            "Lifetime Access"
          ].map((item, index) => (
            <div key={index} className='flex items-center gap-3 text-white text-lg font-light glass p-3 rounded-lg hover:bg-white/5 transition-colors'>
              <BiSolidBadgeCheck className='w-6 h-6 text-[var(--neon-purple)]' />
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default About
