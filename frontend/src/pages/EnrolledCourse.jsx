import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeftLong, FaPlay } from "react-icons/fa6";
import axios from 'axios';
import { serverUrl } from '../App';

function EnrolledCourse() {
  const navigate = useNavigate()
  const { userData } = useSelector((state) => state.user);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const response = await axios.get(serverUrl + "/api/user/currentuser", { withCredentials: true });
        if (response.data.enrolledCourses) {
          setEnrolledCourses(response.data.enrolledCourses);
        }
      } catch (error) {
        console.error("Error fetching enrolled courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrolledCourses();
  }, []);

  const coursesToDisplay = enrolledCourses.length > 0 ? enrolledCourses : userData?.enrolledCourses || [];

  return (
    <div className="min-h-screen w-full px-4 py-24">
      <div className="max-w-7xl mx-auto relative">
        <FaArrowLeftLong
          className="absolute -top-12 left-0 text-2xl text-gray-400 hover:text-[var(--neon-blue)] cursor-pointer transition-colors"
          onClick={() => navigate("/")}
        />
        
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            My <span className="text-gradient">Learning Journey</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">Continue where you left off and master new skills with your enrolled courses.</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--neon-blue)]"></div>
          </div>
        ) : coursesToDisplay.length === 0 ? (
          <div className="glass-card p-12 rounded-3xl text-center max-w-md mx-auto animate-slide-up">
            <p className="text-gray-400 mb-6 text-lg">You haven't enrolled in any courses yet.</p>
            <button 
              className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-[var(--neon-blue)] transition-all cursor-pointer"
              onClick={() => navigate("/allcourses")}
            >
              Explore Courses
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {coursesToDisplay.map((course, index) => (
              <div
                key={course._id}
                className="glass-card rounded-2xl overflow-hidden group animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-12 h-12 bg-[var(--neon-blue)] rounded-full flex items-center justify-center text-black shadow-[0_0_20px_rgba(0,243,255,0.5)]">
                      <FaPlay className="ml-1" />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] uppercase tracking-wider text-[var(--neon-blue)] font-bold">
                      {course.category}
                    </span>
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest">{course.level}</span>
                  </div>
                  <h2 className="text-xl font-bold text-white mb-6 line-clamp-2 h-14 group-hover:text-[var(--neon-blue)] transition-colors">
                    {course.title}
                  </h2>
                  <button 
                    className="w-full py-3 bg-white/5 border border-white/10 text-white rounded-xl font-bold hover:bg-[var(--neon-blue)] hover:text-black hover:border-[var(--neon-blue)] transition-all flex items-center justify-center gap-2 cursor-pointer group-hover:shadow-[0_0_15px_rgba(0,243,255,0.2)]"
                    onClick={() => navigate(`/viewlecture/${course._id}`)}
                  >
                    Resume Learning
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default EnrolledCourse

