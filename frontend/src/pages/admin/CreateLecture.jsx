import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FaArrowLeft, FaEdit, FaPlus, FaVideo } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { serverUrl } from '../../App';
import { ClipLoader } from 'react-spinners';
import { useDispatch, useSelector } from 'react-redux';
import { setLectureData } from '../../redux/lectureSlice';
import { FaArrowLeftLong } from 'react-icons/fa6';

function CreateLecture() {
    const navigate = useNavigate()
    const { courseId } = useParams()
    const [lectureTitle, setLectureTitle] = useState("")
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const { lectureData } = useSelector(state => state.lecture)

    const createLectureHandler = async () => {
        if (!lectureTitle) return toast.error("Please enter a lecture title")
        setLoading(true)
        try {
            const result = await axios.post(serverUrl + `/api/course/createlecture/${courseId}`, { lectureTitle }, { withCredentials: true })
            dispatch(setLectureData([...lectureData, result.data.lecture]))
            toast.success("Lecture Added to Course")
            setLectureTitle("")
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add lecture")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const getLecture = async () => {
            try {
                const result = await axios.get(serverUrl + `/api/course/getcourselecture/${courseId}`, { withCredentials: true })
                dispatch(setLectureData(result.data.lectures))
            } catch (error) {
                console.log(error)
            }
        }
        getLecture()
    }, [courseId, dispatch])

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-8 flex justify-center">
            <div className="max-w-3xl w-full animate-fade-in">
                {/* Header Card */}
                <div className="glass-card p-10 rounded-3xl mb-8 border border-white/5 relative">
                    <FaArrowLeftLong
                        className="absolute top-8 left-8 text-2xl text-gray-400 hover:text-[var(--neon-blue)] cursor-pointer transition-colors"
                        onClick={() => navigate(`/addcourses/${courseId}`)}
                    />
                    
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-[var(--neon-purple)]/10 rounded-2xl flex items-center justify-center text-[var(--neon-purple)] mb-4 border border-[var(--neon-purple)]/20 shadow-[0_0_15px_rgba(188,19,254,0.1)]">
                            <FaVideo size={30} />
                        </div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Curriculum Builder</h1>
                        <p className="text-gray-400 text-sm mt-2 text-center max-w-md">Organize your course by adding lectures. You can upload videos for each lecture after creating them.</p>
                    </div>
                </div>

                {/* Add Lecture Form */}
                <div className="glass-card p-8 rounded-3xl mb-8 border border-white/10">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <input
                            type="text"
                            placeholder="e.g. Introduction to the course"
                            className="flex-1 px-5 py-4 input-dark rounded-xl font-medium"
                            onChange={(e) => setLectureTitle(e.target.value)}
                            value={lectureTitle}
                        />
                        <button 
                            className="px-8 py-4 bg-white text-black font-extrabold rounded-xl hover:bg-[var(--neon-blue)] transition-all shadow-lg cursor-pointer flex items-center justify-center gap-2"
                            disabled={loading}
                            onClick={createLectureHandler}
                        >
                            {loading ? <ClipLoader size={20} color="black" /> : <><FaPlus /> Add Lecture</>}
                        </button>
                    </div>
                </div>

                {/* Lecture List */}
                <div className="space-y-4">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-4 mb-4">Course Content ({lectureData.length})</h3>
                    {lectureData.length === 0 ? (
                        <div className="glass-card p-12 rounded-3xl text-center border border-white/5">
                            <p className="text-gray-500 italic">No lectures added yet. Start building your curriculum!</p>
                        </div>
                    ) : (
                        lectureData.map((lecture, index) => (
                            <div key={lecture._id} className="glass-card p-5 rounded-2xl border border-white/5 flex justify-between items-center group hover:border-[var(--neon-blue)]/30 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xs font-bold text-gray-400">
                                        {index + 1}
                                    </div>
                                    <span className="text-white font-bold group-hover:text-[var(--neon-blue)] transition-colors">
                                        {lecture.lectureTitle}
                                    </span>
                                </div>
                                <button 
                                    className="p-3 glass rounded-xl text-gray-400 hover:text-[var(--neon-purple)] hover:border-[var(--neon-purple)] transition-all active:scale-90 cursor-pointer"
                                    onClick={() => navigate(`/editlecture/${courseId}/${lecture._id}`)}
                                >
                                    <FaEdit size={18} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

export default CreateLecture

