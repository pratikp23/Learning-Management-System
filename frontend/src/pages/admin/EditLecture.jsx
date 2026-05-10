import axios from 'axios'
import React, { useState } from 'react'
import { FaArrowLeftLong, FaCloudArrowUp, FaTrashCan, FaCircleInfo } from "react-icons/fa6"
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { serverUrl } from '../../App'
import { setLectureData } from '../../redux/lectureSlice'
import { toast } from 'react-toastify'
import { ClipLoader } from 'react-spinners'

function EditLecture() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { courseId, lectureId } = useParams()
    const { lectureData } = useSelector(state => state.lecture)
    
    const selectedLecture = lectureData.find(lecture => lecture._id === lectureId) || {}
    
    const [loading, setLoading] = useState(false)
    const [loading1, setLoading1] = useState(false)
    const [videoUrl, setVideoUrl] = useState(null)
    const [lectureTitle, setLectureTitle] = useState(selectedLecture.lectureTitle || "")
    const [isPreviewFree, setIsPreviewFree] = useState(selectedLecture.isPreviewFree || false)

    const editLecture = async (e) => {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData()
        formData.append("lectureTitle", lectureTitle)
        if (videoUrl) formData.append("videoUrl", videoUrl)
        formData.append("isPreviewFree", isPreviewFree)

        try {
            const result = await axios.post(serverUrl + `/api/course/editlecture/${lectureId}`, formData, { withCredentials: true })
            const updatedLectures = lectureData.map(l => l._id === lectureId ? result.data : l)
            dispatch(setLectureData(updatedLectures))
            toast.success("Lecture Updated Successfully")
            navigate(`/createlecture/${courseId}`)
        } catch (error) {
            toast.error(error.response?.data?.message || "Update failed")
        } finally {
            setLoading(false)
        }
    }

    const removeLecture = async () => {
        if (!window.confirm("Delete this lecture?")) return;
        setLoading1(true)
        try {
            await axios.delete(serverUrl + `/api/course/removelecture/${lectureId}`, { withCredentials: true })
            const updatedLectures = lectureData.filter(l => l._id !== lectureId)
            dispatch(setLectureData(updatedLectures))
            toast.success("Lecture Removed")
            navigate(`/createlecture/${courseId}`)
        } catch (error) {
            toast.error("Failed to remove lecture")
        } finally {
            setLoading1(false)
        }
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-8 flex justify-center">
            <div className="max-w-2xl w-full animate-fade-in">
                <div className="glass-card p-10 rounded-3xl border border-white/5 relative">
                    <FaArrowLeftLong
                        className="absolute top-8 left-8 text-2xl text-gray-400 hover:text-[var(--neon-blue)] cursor-pointer transition-colors"
                        onClick={() => navigate(`/createlecture/${courseId}`)}
                    />
                    
                    <div className="flex flex-col items-center mb-10">
                        <div className="w-16 h-16 bg-[var(--neon-blue)]/10 rounded-2xl flex items-center justify-center text-[var(--neon-blue)] mb-4 border border-[var(--neon-blue)]/20 shadow-[0_0_15px_rgba(0,243,255,0.1)]">
                            <FaCircleInfo size={30} />
                        </div>
                        <h2 className="text-3xl font-bold text-center text-white tracking-tight">Edit Lecture</h2>
                        <p className="text-gray-400 text-sm mt-2 text-center">Update your content, title, and preview settings.</p>
                    </div>

                    <form className="space-y-8" onSubmit={editLecture}>
                        {/* Title */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Lecture Title</label>
                            <input
                                type="text"
                                className="w-full px-5 py-4 input-dark rounded-xl font-medium"
                                placeholder="Enter lecture title"
                                value={lectureTitle}
                                onChange={(e) => setLectureTitle(e.target.value)}
                                required
                            />
                        </div>

                        {/* Video Upload */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Video Content</label>
                            <div className="relative group">
                                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-white/10 rounded-2xl cursor-pointer bg-white/5 hover:bg-white/[0.08] hover:border-[var(--neon-blue)]/30 transition-all">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <FaCloudArrowUp className="w-10 h-10 mb-3 text-gray-400 group-hover:text-[var(--neon-blue)] transition-colors" />
                                        <p className="mb-2 text-sm text-gray-400">
                                            <span className="font-bold">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs text-gray-500 uppercase tracking-widest">MP4, WebM up to 100MB</p>
                                    </div>
                                    <input type="file" className="hidden" accept="video/*" onChange={(e) => setVideoUrl(e.target.files[0])} />
                                </label>
                                {videoUrl && (
                                    <div className="mt-3 flex items-center gap-2 text-[var(--neon-blue)] bg-[var(--neon-blue)]/10 px-4 py-2 rounded-lg border border-[var(--neon-blue)]/20">
                                        <span className="text-xs font-bold truncate">Selected: {videoUrl.name}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Preview Toggle */}
                        <label className="flex items-center gap-4 cursor-pointer group w-fit">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    className="sr-only"
                                    checked={isPreviewFree}
                                    onChange={() => setIsPreviewFree(!isPreviewFree)}
                                />
                                <div className={`block w-14 h-8 rounded-full transition-colors ${isPreviewFree ? 'bg-[var(--neon-blue)]' : 'bg-white/10'}`}></div>
                                <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${isPreviewFree ? 'translate-x-6' : ''}`}></div>
                            </div>
                            <span className="text-sm font-bold text-gray-400 group-hover:text-white transition-colors uppercase tracking-widest">Enable Free Preview</span>
                        </label>

                        {loading && (
                            <div className="flex items-center gap-3 text-[var(--neon-blue)] animate-pulse">
                                <ClipLoader size={16} color="var(--neon-blue)" />
                                <span className="text-xs font-bold uppercase tracking-widest">Uploading video... Please wait</span>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="pt-4 flex flex-col sm:flex-row gap-4">
                            <button
                                type="button"
                                className="px-6 py-4 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl font-bold hover:bg-red-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                                disabled={loading1}
                                onClick={removeLecture}
                            >
                                {loading1 ? <ClipLoader size={20} color="red" /> : <><FaTrashCan /> Delete Lecture</>}
                            </button>
                            <button 
                                type="submit"
                                className="flex-1 py-4 bg-white text-black font-extrabold text-lg rounded-xl shadow-lg hover:bg-[var(--neon-blue)] transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center"
                                disabled={loading}
                            >
                                {loading ? <ClipLoader size={24} color="black" /> : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default EditLecture

