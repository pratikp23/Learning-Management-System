import axios from "axios";
import React, { useState } from "react";
import { FaArrowLeftLong, FaBookMedical } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../../App";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

const CreateCourse = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [title, setTitle] = useState("")
    const [category, setCategory] = useState("")

    const CreateCourseHandler = async (e) => {
        e.preventDefault()
        if (!title || !category) {
            return toast.error("Please fill all fields")
        }
        setLoading(true)
        try {
            const result = await axios.post(serverUrl + "/api/course/create", { title, category }, { withCredentials: true })
            toast.success("Course Created Successfully")
            navigate("/courses")
            setTitle("")
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create course")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-20">
            <div className="glass-card p-10 max-w-xl w-full relative animate-slide-up rounded-3xl">
                <FaArrowLeftLong
                    className="absolute top-8 left-8 text-2xl text-gray-400 hover:text-[var(--neon-blue)] cursor-pointer transition-colors"
                    onClick={() => navigate("/courses")}
                />
                
                <div className="flex flex-col items-center mb-10">
                    <div className="w-16 h-16 bg-[var(--neon-blue)]/10 rounded-2xl flex items-center justify-center text-[var(--neon-blue)] mb-4 border border-[var(--neon-blue)]/20 shadow-[0_0_15px_rgba(0,243,255,0.1)]">
                        <FaBookMedical size={30} />
                    </div>
                    <h2 className="text-3xl font-bold text-center text-white tracking-tight">Create New Course</h2>
                    <p className="text-gray-400 text-sm mt-2 text-center">Give your course a compelling title and category to get started.</p>
                </div>

                <form className="space-y-8" onSubmit={CreateCourseHandler}>
                    {/* Course Title */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                            Course Title
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Master React and Next.js"
                            className="w-full px-5 py-4 input-dark rounded-xl font-medium"
                            onChange={(e) => setTitle(e.target.value)} 
                            value={title}
                            required
                        />
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                            Category
                        </label>
                        <select
                            className="w-full px-5 py-4 input-dark rounded-xl font-medium appearance-none cursor-pointer"
                            onChange={(e) => setCategory(e.target.value)}
                            value={category}
                            required
                        >
                            <option value="" className="bg-[#1a1a1a]">Select a category</option>
                            <option value="App Development" className="bg-[#1a1a1a]">App Development</option>
                            <option value="AI/ML" className="bg-[#1a1a1a]">AI/ML</option>
                            <option value="AI Tools" className="bg-[#1a1a1a]">AI Tools</option>
                            <option value="Data Science" className="bg-[#1a1a1a]">Data Science</option>
                            <option value="Data Analytics" className="bg-[#1a1a1a]">Data Analytics</option>
                            <option value="Ethical Hacking" className="bg-[#1a1a1a]">Ethical Hacking</option>
                            <option value="UI UX Designing" className="bg-[#1a1a1a]">UI UX Designing</option>
                            <option value="Web Development" className="bg-[#1a1a1a]">Web Development</option>
                            <option value="Others" className="bg-[#1a1a1a]">Others</option>
                        </select>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full py-4 rounded-xl bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] text-black font-extrabold text-lg shadow-lg hover:shadow-[0_0_30px_rgba(0,243,255,0.3)] transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-3 disabled:opacity-70" 
                            disabled={loading}
                        >
                            {loading ? <ClipLoader size={24} color="black" /> : "Initialize Course"}
                        </button>
                        <p className="text-center text-gray-500 text-xs mt-6 px-4">
                            You can add lectures, thumbnails, and pricing in the next step.
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCourse;

