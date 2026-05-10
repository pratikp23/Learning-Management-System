import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import img from "../../assets/empty.jpg";
import { useNavigate } from 'react-router-dom';
import { FaArrowLeftLong, FaUsers, FaChartLine, FaWallet, FaPlus } from "react-icons/fa6";
import axios from 'axios';
import { serverUrl } from '../../App';
import { setCreatorCourseData } from '../../redux/courseSlice';

function Dashboard() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { userData } = useSelector((state) => state.user);
  const { creatorCourseData } = useSelector((state) => state.course);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(serverUrl + "/api/course/getcreatorcourses", { withCredentials: true });
        dispatch(setCreatorCourseData(result.data));
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch]);

  const courseProgressData = creatorCourseData?.map(course => ({
    name: course.title.length > 12 ? course.title.slice(0, 10) + "..." : course.title,
    lectures: course.lectures.length || 0
  })) || [];

  const enrollData = creatorCourseData?.map(course => ({
    name: course.title.length > 12 ? course.title.slice(0, 10) + "..." : course.title,
    enrolled: course.enrolledStudents?.length || 0
  })) || [];

  const totalEarnings = creatorCourseData?.reduce((sum, course) => {
    const studentCount = course.enrolledStudents?.length || 0;
    const courseRevenue = course.price ? course.price * studentCount : 0;
    return sum + courseRevenue;
  }, 0) || 0;

  const totalStudents = creatorCourseData?.reduce((sum, course) => sum + (course.enrolledStudents?.length || 0), 0) || 0;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <FaArrowLeftLong
            className="text-2xl text-gray-400 hover:text-[var(--neon-blue)] cursor-pointer transition-colors"
            onClick={() => navigate("/")}
          />
          <h1 className="text-3xl font-bold text-white tracking-tight">Instructor Dashboard</h1>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="glass-card p-6 rounded-2xl flex items-center gap-5">
            <div className="w-14 h-14 bg-[var(--neon-blue)]/10 rounded-2xl flex items-center justify-center text-[var(--neon-blue)] border border-[var(--neon-blue)]/20">
              <FaWallet size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-400 uppercase tracking-widest font-semibold">Total Revenue</p>
              <h3 className="text-2xl font-extrabold text-white">₹{totalEarnings.toLocaleString()}</h3>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl flex items-center gap-5">
            <div className="w-14 h-14 bg-[var(--neon-purple)]/10 rounded-2xl flex items-center justify-center text-[var(--neon-purple)] border border-[var(--neon-purple)]/20">
              <FaUsers size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-400 uppercase tracking-widest font-semibold">Total Students</p>
              <h3 className="text-2xl font-extrabold text-white">{totalStudents}</h3>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl flex items-center gap-5">
            <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-400 border border-green-500/20">
              <FaChartLine size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-400 uppercase tracking-widest font-semibold">Active Courses</p>
              <h3 className="text-2xl font-extrabold text-white">{creatorCourseData?.length || 0}</h3>
            </div>
          </div>
        </div>

        {/* Profile Summary & Action */}
        <div className="glass-card p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8 mb-10">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] rounded-full blur opacity-30"></div>
              <img
                src={userData?.photoUrl || img}
                alt="Educator"
                className="relative w-24 h-24 rounded-full object-cover border-2 border-white/10"
              />
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-white">Welcome back, {userData?.name}!</h2>
              <p className="text-gray-400 max-w-md line-clamp-1">{userData?.description || "Manage your curriculum and track student success."}</p>
            </div>
          </div>
          <button
            className="w-full md:w-auto px-8 py-4 bg-white text-black font-extrabold rounded-xl hover:bg-[var(--neon-blue)] hover:text-black transition-all flex items-center justify-center gap-2 shadow-xl cursor-pointer"
            onClick={() => navigate("/courses")}
          >
            <FaPlus /> Create New Course
          </button>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Enrollment Chart */}
          <div className="glass-card p-8 rounded-3xl">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-white">Student Enrollment</h3>
              <div className="px-3 py-1 bg-[var(--neon-blue)]/10 text-[var(--neon-blue)] text-xs rounded-full border border-[var(--neon-blue)]/20 uppercase tracking-tighter font-bold">Real-time</div>
            </div>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={enrollData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', color: '#fff' }}
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  />
                  <Bar dataKey="enrolled" radius={[6, 6, 0, 0]}>
                    {enrollData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#00f3ff' : '#bc13fe'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Progress Chart */}
          <div className="glass-card p-8 rounded-3xl">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-white">Curriculum Depth</h3>
              <span className="text-gray-400 text-sm">Lectures per Course</span>
            </div>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={courseProgressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', color: '#fff' }}
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  />
                  <Bar dataKey="lectures" fill="#bc13fe" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

