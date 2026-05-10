import React, { useEffect, useState } from "react";
import { FaArrowLeftLong, FaFilter, FaMagnifyingGlass, FaRobot } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import aiIcon from "../assets/SearchAi.png";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App.jsx";
import { setCourseData } from "../redux/courseSlice.js";
import Card from "../components/Card.jsx";
import { ClipLoader } from "react-spinners";

function AllCourses() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [category, setCategory] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCourses, setFilterCourses] = useState([]);
  const { courseData } = useSelector((state) => state.course);
  const [loading, setLoading] = useState(false);

  const categories = [
    "Web Development", "App Development", "AI/ML", "Data Science", 
    "Data Analytics", "Ethical Hacking", "UI UX Designing", "Others"
  ];

  const toggleCategory = (cat) => {
    setCategory(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${serverUrl}/api/course/getpublishedcoures`, { withCredentials: true });
        dispatch(setCourseData(res.data));
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [dispatch]);

  useEffect(() => {
    let results = (courseData || []).filter(course => 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (category.length > 0) {
      results = results.filter(course => category.includes(course.category));
    }
    setFilterCourses(results);
  }, [courseData, category, searchQuery]);

  return (
    <div className="min-h-screen bg-[var(--primary-bg)] text-white">
      <Nav />
      
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsSidebarVisible(!isSidebarVisible)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-[var(--neon-blue)] text-black rounded-full shadow-2xl md:hidden"
      >
        <FaFilter size={20} />
      </button>

      <div className="flex pt-24">
        {/* Sidebar */}
        <aside className={`
          fixed top-24 left-0 h-[calc(100vh-6rem)] w-72 bg-black/40 backdrop-blur-xl border-r border-white/5 p-8 transition-transform duration-300 z-40
          ${isSidebarVisible ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
        `}>
          <div className="flex items-center gap-3 mb-10 text-gray-400 hover:text-white cursor-pointer transition-colors" onClick={() => navigate("/")}>
            <FaArrowLeftLong />
            <span className="font-bold uppercase tracking-widest text-xs">Back to Home</span>
          </div>

          <button 
            onClick={() => navigate("/searchwithai")}
            className="w-full mb-10 p-4 glass rounded-2xl flex items-center justify-center gap-3 border border-[var(--neon-blue)]/30 hover:border-[var(--neon-blue)] transition-all group"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden border border-[var(--neon-blue)]/50 group-hover:scale-110 transition-transform">
                <img src={aiIcon} alt="AI" className="w-full h-full object-cover" />
            </div>
            <span className="font-bold text-sm text-[var(--neon-blue)]">Search with AI</span>
          </button>

          <h2 className="text-sm font-black uppercase tracking-tighter text-gray-500 mb-6 px-2">Filter Categories</h2>
          <div className="space-y-3">
            {categories.map((cat) => (
              <label 
                key={cat}
                className={`
                  flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border
                  ${category.includes(cat) ? 'bg-[var(--neon-blue)]/10 border-[var(--neon-blue)]/30 text-white' : 'hover:bg-white/5 border-transparent text-gray-400'}
                `}
                onClick={() => toggleCategory(cat)}
              >
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${category.includes(cat) ? 'bg-[var(--neon-blue)] border-transparent' : 'border-gray-600'}`}>
                    {category.includes(cat) && <div className="w-1.5 h-1.5 bg-black rounded-full" />}
                </div>
                <span className="text-sm font-bold">{cat}</span>
              </label>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 md:ml-72 p-8 lg:p-12">
          {/* Header & Search */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
            <div>
              <h1 className="text-4xl font-black text-white mb-2">Explore Courses</h1>
              <p className="text-gray-500 font-medium">Discover your next skill from our curated library</p>
            </div>
            
            <div className="relative group max-w-md w-full">
              <FaMagnifyingGlass className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[var(--neon-blue)] transition-colors" />
              <input 
                type="text" 
                placeholder="Search by title or topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-[var(--neon-blue)]/50 focus:bg-white/10 transition-all text-white placeholder:text-gray-600 font-medium"
              />
            </div>
          </div>

          {/* Results Grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-40 gap-4">
                <ClipLoader color="#00F3FF" size={40} />
                <span className="text-gray-500 font-bold uppercase tracking-widest text-xs">Loading Catalog...</span>
            </div>
          ) : filterCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-fade-in">
              {filterCourses.map((course) => (
                <Card 
                  key={course._id}
                  id={course._id}
                  title={course.title}
                  thumbnail={course.thumbnail}
                  category={course.category}
                  price={course.price}
                  reviews={course.reviews}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-40 glass rounded-[3rem] border border-white/5">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-700">
                <FaMagnifyingGlass size={30} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">No Courses Found</h2>
              <p className="text-gray-500">Try adjusting your filters or search query</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default AllCourses;

