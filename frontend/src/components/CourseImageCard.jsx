import React from 'react';
import { useNavigate } from 'react-router-dom';

const CourseImageCard = ({ thumbnail, title, id }) => {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/viewcourse/${id}`)}
      className="w-full cursor-pointer hover:opacity-80 transition-opacity duration-200"
    >
      <div className="w-full overflow-hidden rounded-lg">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-48 object-cover"
        />
      </div>
      <h3 className="mt-3 text-sm font-semibold text-gray-800 truncate hover:text-gray-600">
        {title}
      </h3>
    </div>
  );
};

export default CourseImageCard;
