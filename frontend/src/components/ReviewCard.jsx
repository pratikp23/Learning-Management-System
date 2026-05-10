import React from "react";
import { FaStar } from "react-icons/fa6";
import { FaRegStar } from "react-icons/fa";

const ReviewCard = ({ text, name, image, rating, role }) => {
  return (
    <div className="glass-card p-6 rounded-2xl max-w-sm w-full relative group">
      {/* ⭐ Rating Stars */}
      <div className="flex items-center mb-4 text-yellow-400 text-sm gap-1">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <span key={i}>
              {i < rating ? <FaStar /> : <FaRegStar className="text-gray-600" />}
            </span>
          ))}
      </div>

      {/* 💬 Review Text */}
      <p className="text-gray-300 text-sm mb-6 leading-relaxed italic border-l-2 border-[var(--neon-blue)] pl-4">
        "{text}"
      </p>

      {/* 👤 Reviewer Info */}
      <div className="flex items-center gap-4 mt-auto">
        <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)]">
          <img
            src={image}
            alt={name}
            className="w-full h-full rounded-full object-cover border-2 border-[var(--primary-bg)]"
          />
        </div>
        <div>
          <h4 className="font-bold text-white text-base">{name}</h4>
          <p className="text-xs text-[var(--neon-blue)] uppercase tracking-wide opacity-80">{role}</p>
        </div>
      </div>

      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--neon-purple)] opacity-10 blur-3xl rounded-full -z-10 transition-opacity group-hover:opacity-20"></div>
    </div>
  );
};

export default ReviewCard;
