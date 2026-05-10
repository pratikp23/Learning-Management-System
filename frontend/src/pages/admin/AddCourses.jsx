import React, { useEffect, useRef, useState } from 'react'
import img from "../../assets/empty.jpg"
import { FaArrowLeftLong, FaCloudArrowUp, FaTrashCan, FaCirclePlay, FaCircleInfo } from "react-icons/fa6";
import { useNavigate, useParams } from 'react-router-dom';
import { serverUrl } from '../../App';
import { MdEdit } from "react-icons/md";
import axios from 'axios';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { ClipLoader } from 'react-spinners';
import { setCourseData } from '../../redux/courseSlice';

function AddCourses() {
    const navigate = useNavigate()
    const { courseId } = useParams()
    const [selectedCourse, setSelectedCourse] = useState(null)
    const [title, setTitle] = useState("")
    const [subTitle, setSubTitle] = useState("")
    const [description, setDescription] = useState("")
    const [category, setCategory] = useState("")
    const [level, setLevel] = useState("")
    const [price, setPrice] = useState("")
    const [isPublished, setIsPublished] = useState(false)
    const thumb = useRef()
    const [frontendImage, setFrontendImage] = useState(null)
    const [backendImage, setBackendImage] = useState(null)
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const { courseData } = useSelector(state => state.course)

    const getCourseById = async () => {
        try {
            const result = await axios.get(serverUrl + `/api/course/getcourse/${courseId}`, { withCredentials: true })
            setSelectedCourse(result.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (selectedCourse) {
            setTitle(selectedCourse.title || "")
            setSubTitle(selectedCourse.subTitle || "")
            setDescription(selectedCourse.description || "")
            setCategory(selectedCourse.category || "")
            setLevel(selectedCourse.level || "")
            setPrice(selectedCourse.price || "")
            setFrontendImage(selectedCourse.thumbnail || img)
            setIsPublished(selectedCourse?.isPublished)
        }
    }, [selectedCourse])

    useEffect(() => {
        getCourseById()
    }, [])

    const handleThumbnail = (e) => {
        const file = e.target.files[0]
        setBackendImage(file)
        setFrontendImage(URL.createObjectURL(file))
    }

    const editCourseHandler = async (e) => {
        e.preventDefault()
        setLoading(true);
        const formData = new FormData();
        formData.append("title", title);
        formData.append("subTitle", subTitle);
        formData.append("description", description);
        formData.append("category", category);
        formData.append("level", level);
        formData.append("price", price);
        if (backendImage) formData.append("thumbnail", backendImage);
        formData.append("isPublished", isPublished);

        try {
            const result = await axios.post(`${serverUrl}/api/course/editcourse/${courseId}`, formData, { withCredentials: true });
            const updatedCourse = result.data;
            if (updatedCourse.isPublished) {
                const updatedCourses = courseData.map(c => c._id === courseId ? updatedCourse : c);
                if (!courseData.some(c => c._id === courseId)) updatedCourses.push(updatedCourse);
                dispatch(setCourseData(updatedCourses));
            } else {
                const filteredCourses = courseData.filter(c => c._id !== courseId);
                dispatch(setCourseData(filteredCourses));
            }
            toast.success("Course Details Updated");
            navigate("/courses");
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const removeCourse = async () => {
        if (!window.confirm("Are you sure you want to delete this course?")) return;
        setLoading(true)
        try {
            await axios.delete(serverUrl + `/api/course/removecourse/${courseId}`, { withCredentials: true })
            toast.success("Course Deleted Successfully")
            const filteredCourses = courseData.filter(c => c._id !== courseId);
            dispatch(setCourseData(filteredCourses));
            navigate("/courses")
        } catch (error) {
            toast.error(error.response?.data?.message || "Deletion failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-8">
            <div className="max-w-5xl mx-auto animate-fade-in">
                {/* Header Section */}
                <div className="glass-card p-8 rounded-3xl mb-10 flex flex-col md:flex-row items-center justify-between gap-6 border border-white/5">
                    <div className="flex items-center gap-6">
                        <FaArrowLeftLong
                            className="text-2xl text-gray-400 hover:text-[var(--neon-blue)] cursor-pointer transition-colors"
                            onClick={() => navigate("/courses")}
                        />
                        <div>
                            <h2 className="text-2xl font-bold text-white tracking-tight">Course Management</h2>
                            <p className="text-gray-400 text-sm mt-1">Refine your curriculum and publishing settings.</p>
                        </div>
                    </div>
                    <button
                        className="w-full md:w-auto px-6 py-3 bg-white text-black font-extrabold rounded-xl hover:bg-[var(--neon-blue)] transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                        onClick={() => navigate(`/createlecture/${selectedCourse?._id}`)}
                    >
                        <FaCirclePlay /> Manage Lectures
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left Column: Main Info */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="glass-card p-8 rounded-3xl border border-white/5">
                            <div className="flex items-center gap-3 mb-8">
                                <FaCircleInfo className="text-[var(--neon-blue)]" />
                                <h3 className="text-xl font-bold text-white uppercase tracking-wider">Basic Information</h3>
                            </div>
                            
                            <form className="space-y-6" onSubmit={editCourseHandler}>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Title</label>
                                    <input type="text" className="w-full px-5 py-4 input-dark rounded-xl font-medium" placeholder="Course Title" onChange={(e) => setTitle(e.target.value)} value={title} required />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Subtitle</label>
                                    <input type="text" className="w-full px-5 py-4 input-dark rounded-xl font-medium" placeholder="Hook your students with a great subtitle" onChange={(e) => setSubTitle(e.target.value)} value={subTitle} />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Detailed Description</label>
                                    <textarea className="w-full px-5 py-4 input-dark rounded-xl h-40 resize-none font-medium" placeholder="What will students learn in this course?" onChange={(e) => setDescription(e.target.value)} value={description}></textarea>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Category</label>
                                        <select className="w-full px-5 py-4 input-dark rounded-xl font-medium appearance-none cursor-pointer" onChange={(e) => setCategory(e.target.value)} value={category} required>
                                            <option value="" className="bg-[#1a1a1a]">Select Category</option>
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
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Level</label>
                                        <select className="w-full px-5 py-4 input-dark rounded-xl font-medium appearance-none cursor-pointer" onChange={(e) => setLevel(e.target.value)} value={level} required>
                                            <option value="" className="bg-[#1a1a1a]">Select Level</option>
                                            <option value="Beginner" className="bg-[#1a1a1a]">Beginner</option>
                                            <option value="Intermediate" className="bg-[#1a1a1a]">Intermediate</option>
                                            <option value="Advanced" className="bg-[#1a1a1a]">Advanced</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Price (INR)</label>
                                        <input type="number" className="w-full px-5 py-4 input-dark rounded-xl font-bold text-[var(--neon-blue)]" placeholder="₹ 0.00" onChange={(e) => setPrice(e.target.value)} value={price} required />
                                    </div>
                                </div>

                                <div className="pt-8 flex items-center gap-4">
                                    <button type="button" className="px-8 py-4 glass text-gray-400 hover:text-white rounded-xl transition-all cursor-pointer" onClick={() => navigate("/courses")}>Cancel</button>
                                    <button type="submit" className="flex-1 py-4 bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] text-black font-extrabold text-lg rounded-xl shadow-lg hover:shadow-[0_0_20px_rgba(0,243,255,0.3)] transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center" disabled={loading}>
                                        {loading ? <ClipLoader size={24} color="black" /> : "Save Course Details"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Right Column: Media & Publish */}
                    <div className="space-y-8">
                        {/* Thumbnail Upload */}
                        <div className="glass-card p-8 rounded-3xl border border-white/5">
                            <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider text-center">Course Thumbnail</h3>
                            <div className="relative group cursor-pointer" onClick={() => thumb.current.click()}>
                                <div className="absolute -inset-1 bg-gradient-to-tr from-[var(--neon-blue)] to-[var(--neon-purple)] rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                                <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-white/10 group-hover:border-[var(--neon-blue)]/50 transition-all">
                                    <img src={frontendImage} alt="Thumbnail" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                                        <FaCloudArrowUp size={30} className="mb-2" />
                                        <span className="text-xs font-bold uppercase tracking-widest">Update Image</span>
                                    </div>
                                </div>
                                <input type="file" ref={thumb} hidden onChange={handleThumbnail} accept='image/*' />
                            </div>
                            <p className="text-[10px] text-gray-500 mt-4 text-center uppercase tracking-widest">Recommended: 1280x720 (PNG/JPG)</p>
                        </div>

                        {/* Status & Delete */}
                        <div className="glass-card p-8 rounded-3xl border border-white/5 space-y-6">
                            <h3 className="text-lg font-bold text-white uppercase tracking-wider text-center">Publishing</h3>
                            
                            <div className="flex flex-col gap-4">
                                {!isPublished ? (
                                    <button 
                                        className="w-full py-4 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl font-bold hover:bg-green-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                                        onClick={() => setIsPublished(true)}
                                    >
                                        Make Public
                                    </button>
                                ) : (
                                    <button 
                                        className="w-full py-4 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-xl font-bold hover:bg-orange-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                                        onClick={() => setIsPublished(false)}
                                    >
                                        Hide from Public (Draft)
                                    </button>
                                )}
                                
                                <button 
                                    className="w-full py-4 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl font-bold hover:bg-red-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                                    onClick={removeCourse}
                                    disabled={loading}
                                >
                                    <FaTrashCan size={16} /> Delete Permanently
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddCourses

