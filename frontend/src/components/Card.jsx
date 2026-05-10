import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const CourseCard = ({ thumbnail, title, category, price, id, reviews }) => {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const avgRating = calculateAverageRating(reviews);

  return (
    <div
      className="max-w-sm w-full glass-card rounded-[2rem] overflow-hidden cursor-pointer group relative border border-white/5 hover:border-[var(--neon-blue)]/30 transition-all duration-500 shadow-2xl"
      onClick={() => navigate(`/viewcourse/${id}`)}
    >
      {/* Thumbnail Area */}
      <div className="relative h-52 overflow-hidden bg-black/40">
        <img
          src={imgError ? "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800" : (thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800")}
          alt={title}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--primary-bg)] via-transparent to-transparent opacity-80"></div>
        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all duration-500"></div>
        
        {/* Category Tag */}
        <span className="absolute top-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-md text-[10px] font-black text-[var(--neon-blue)] rounded-lg uppercase tracking-widest border border-[var(--neon-blue)]/20 shadow-lg">
          {category}
        </span>
      </div>

      {/* Content Area */}
      <div className="p-6 space-y-4 relative bg-gradient-to-b from-transparent to-black/20">
        {/* Title */}
        <h2 className="text-xl font-extrabold text-white leading-tight min-h-[3.5rem] line-clamp-2 group-hover:text-[var(--neon-blue)] transition-colors duration-300">
          {title}
        </h2>

        {/* Footer info */}
        <div className="flex justify-between items-center pt-4 border-t border-white/5">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter mb-1">Price</span>
            <span className="font-black text-2xl text-white group-hover:text-[var(--neon-purple)] transition-colors">
              ₹{price || 0}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter mb-1">Rating</span>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/5">
              <FaStar className="text-yellow-400 text-xs" />
              <span className="text-xs font-black text-gray-200">{avgRating}</span>
            </div>
          </div>
        </div>

        {/* Hover Glow Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-10 transition duration-700 -z-10"></div>
      </div>
    </div>
  );
};

export default CourseCard;

