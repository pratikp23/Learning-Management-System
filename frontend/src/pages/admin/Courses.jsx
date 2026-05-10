import React, { useEffect, useState } from 'react'
import { FaEdit, FaPlus } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '../../App';
import { toast } from 'react-toastify';
import { setCreatorCourseData } from '../../redux/courseSlice';
import img1 from "../../assets/empty.jpg"
import { FaArrowLeftLong } from "react-icons/fa6";
import { ClipLoader } from 'react-spinners';

function Courses() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { creatorCourseData } = useSelector(state => state.course)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getCreatorData = async () => {
      try {
        const result = await axios.get(serverUrl + "/api/course/getcreatorcourses", { withCredentials: true })
        dispatch(setCreatorCourseData(result.data))
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch courses")
      } finally {
        setLoading(false)
      }
    }
    getCreatorData()
  }, [dispatch])

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
          <div className="flex items-center gap-4">
            <FaArrowLeftLong
              className="text-2xl text-gray-400 hover:text-[var(--neon-blue)] cursor-pointer transition-colors"
              onClick={() => navigate("/dashboard")}
            />
            <h1 className="text-3xl font-bold text-white tracking-tight">Your Courses</h1>
          </div>

          <button
            className="w-full sm:w-auto px-6 py-3 bg-white text-black font-extrabold rounded-xl hover:bg-[var(--neon-blue)] transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            onClick={() => navigate("/createcourses")}
          >
            <FaPlus /> Create Course
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <ClipLoader size={40} color="var(--neon-blue)" />
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block glass-card rounded-3xl overflow-hidden border border-white/5">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/10">
                      <th className="py-5 px-6 text-xs uppercase tracking-widest font-bold text-gray-400">Course Detail</th>
                      <th className="py-5 px-6 text-xs uppercase tracking-widest font-bold text-gray-400 text-center">Price</th>
                      <th className="py-5 px-6 text-xs uppercase tracking-widest font-bold text-gray-400 text-center">Status</th>
                      <th className="py-5 px-6 text-xs uppercase tracking-widest font-bold text-gray-400 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {creatorCourseData?.map((course, index) => (
                      <tr key={index} className="group hover:bg-white/[0.02] transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-4">
                            <div className="relative flex-shrink-0">
                              <div className="absolute inset-0 bg-gradient-to-tr from-[var(--neon-blue)] to-[var(--neon-purple)] rounded-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
                              <img
                                src={course?.thumbnail || img1}
                                alt={course?.title}
                                className="relative w-20 h-12 object-cover rounded-lg border border-white/10"
                              />
                            </div>
                            <span className="font-bold text-white group-hover:text-[var(--neon-blue)] transition-colors line-clamp-1 max-w-[300px]">
                              {course?.title}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className="text-gray-300 font-medium">
                            {course?.price ? `₹${course?.price}` : <span className="text-gray-600 italic">Unset</span>}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            course?.isPublished 
                              ? "bg-green-500/10 text-green-400 border border-green-500/20" 
                              : "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                          }`}>
                            {course?.isPublished ? "Published" : "Draft"}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            className="p-3 glass rounded-xl text-gray-400 hover:text-[var(--neon-blue)] hover:border-[var(--neon-blue)] transition-all active:scale-90 cursor-pointer"
                            onClick={() => navigate(`/addcourses/${course?._id}`)}
                          >
                            <FaEdit size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {(!creatorCourseData || creatorCourseData.length === 0) && (
                <div className="py-20 text-center text-gray-500 font-medium">
                  No courses found. Start by creating your first masterpiece!
                </div>
              )}
              <div className="bg-white/5 py-4 px-6 border-t border-white/5">
                <p className="text-xs text-gray-500 text-center uppercase tracking-widest font-semibold">
                  A list of your managed courses
                </p>
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {creatorCourseData?.map((course, index) => (
                <div key={index} className="glass-card p-5 rounded-2xl border border-white/10 flex flex-col gap-4">
                  <div className="flex gap-4 items-center">
                    <img
                      src={course?.thumbnail || img1}
                      alt=""
                      className="w-16 h-16 rounded-xl object-cover border border-white/10 shadow-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h2 className="font-bold text-white truncate text-lg group-hover:text-[var(--neon-blue)] transition-colors">
                        {course?.title}
                      </h2>
                      <p className="text-[var(--neon-blue)] font-bold text-sm mt-1">
                        {course?.price ? `₹${course?.price}` : "Price Unset"}
                      </p>
                    </div>
                    <button
                      className="p-3 glass rounded-xl text-gray-400 active:scale-90 cursor-pointer"
                      onClick={() => navigate(`/addcourses/${course?._id}`)}
                    >
                      <FaEdit size={20} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-4 border-t border-white/5">
                    <span className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      course?.isPublished 
                        ? "bg-green-500/10 text-green-400 border border-green-500/20" 
                        : "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                    }`}>
                      {course?.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>
                </div>
              ))}
              {(!creatorCourseData || creatorCourseData.length === 0) && (
                <p className="text-center text-gray-500 py-10">No courses found.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Courses

