import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { FaPlay, FaCirclePlay, FaArrowLeftLong } from "react-icons/fa6";
import axios from 'axios';
import { serverUrl } from '../App';
import img from "../assets/empty.jpg"

function ViewLecture() {
  const { courseId } = useParams();
  const { courseData } = useSelector((state) => state.course);
  const selectedCourse = courseData?.find((course) => course._id === courseId);
  const [selectedLecture, setSelectedLecture] = useState(selectedCourse?.lectures?.[0] || null);
  const [creatorData, setCreatorData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCreator = async () => {
      if (selectedCourse?.creator) {
        try {
          const result = await axios.post(`${serverUrl}/api/course/getcreator`, { userId: selectedCourse.creator }, { withCredentials: true });
          setCreatorData(result.data);
        } catch (error) {
          console.error("Error fetching creator:", error);
        }
      }
    };
    fetchCreator();
  }, [selectedCourse]);

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-8 flex justify-center">
      <div className="max-w-7xl w-full animate-fade-in flex flex-col lg:flex-row gap-8">
        
        {/* Left - Video Player & Info */}
        <div className="lg:w-2/3 space-y-6">
          <div className="glass-card p-6 rounded-3xl border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <FaArrowLeftLong 
                className="text-xl text-gray-400 hover:text-[var(--neon-blue)] cursor-pointer transition-colors" 
                onClick={() => navigate(`/viewcourse/${courseId}`)} 
              />
              <div>
                <h1 className="text-xl font-bold text-white line-clamp-1">{selectedCourse?.title}</h1>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{selectedCourse?.category} • {selectedCourse?.level}</p>
              </div>
            </div>
          </div>

          <div className="glass-card overflow-hidden rounded-[2rem] border border border-white/10 shadow-2xl bg-black">
            <div className="aspect-video w-full bg-black flex items-center justify-center relative">
              {selectedLecture?.videoUrl ? (
                selectedLecture.videoUrl.includes("youtube.com") || selectedLecture.videoUrl.includes("youtu.be") ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${selectedLecture.videoUrl.split('v=')[1]?.split('&')[0] || selectedLecture.videoUrl.split('/').pop()}`}
                    className="w-full h-full"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <video
                    src={selectedLecture.videoUrl}
                    controls
                    className="w-full h-full object-contain"
                    crossOrigin="anonymous"
                    autoPlay
                  />
                )
              ) : (
                <div className="text-center space-y-4">
                  <FaCirclePlay size={50} className="text-gray-700 mx-auto animate-pulse" />
                  <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Select a module to start learning</p>
                </div>
              )}
            </div>
            <div className="p-8">
              <h2 className="text-2xl font-bold text-white mb-2">{selectedLecture?.lectureTitle || "Welcome to the Course"}</h2>
              <div className="h-1 w-20 bg-[var(--neon-blue)] rounded-full mb-6"></div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Enjoy your learning journey. This lecture covers key concepts in {selectedCourse?.title}. 
                Make sure to take notes and practice the concepts demonstrated in the video.
              </p>
            </div>
          </div>
        </div>

        {/* Right - Curriculum & Instructor */}
        <div className="lg:w-1/3 space-y-8">
          
          {/* Lecture List */}
          <div className="glass-card p-8 rounded-[2rem] border border-white/5 h-fit">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center justify-between">
              Curriculum
              <span className="text-[10px] text-[var(--neon-blue)] font-bold uppercase tracking-widest px-3 py-1 bg-[var(--neon-blue)]/10 rounded-md">
                {selectedCourse?.lectures?.length || 0} Modules
              </span>
            </h2>
            <div className="space-y-3 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
              {selectedCourse?.lectures?.length > 0 ? (
                selectedCourse.lectures.map((lecture, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedLecture(lecture)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all group ${
                      selectedLecture?._id === lecture._id
                        ? 'bg-[var(--neon-blue)]/10 border-[var(--neon-blue)]/30'
                        : 'bg-white/5 border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className={`text-xs font-bold ${selectedLecture?._id === lecture._id ? 'text-[var(--neon-blue)]' : 'text-gray-500'}`}>
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <h4 className={`text-sm font-bold truncate max-w-[150px] ${selectedLecture?._id === lecture._id ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                        {lecture.lectureTitle}
                      </h4>
                    </div>
                    <FaPlay size={12} className={selectedLecture?._id === lecture._id ? 'text-[var(--neon-blue)]' : 'text-gray-600'} />
                  </button>
                ))
              ) : (
                <p className="text-gray-500 italic text-center py-10">No lectures available.</p>
              )}
            </div>
          </div>

          {/* Instructor Card */}
          <div className="glass-card p-6 rounded-[2rem] border border-white/5">
            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6">Course Instructor</h3>
            <div className="flex items-center gap-4">
              <img
                src={creatorData?.photoUrl || img}
                alt="Instructor"
                className="w-14 h-14 rounded-2xl object-cover border border-white/10"
              />
              <div className="overflow-hidden">
                <h4 className="text-white font-bold truncate">{creatorData?.name || "SkillUp Mentor"}</h4>
                <p className="text-[10px] text-gray-500 font-medium uppercase tracking-tighter truncate">
                  {creatorData?.description || 'Subject Matter Expert'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewLecture;

