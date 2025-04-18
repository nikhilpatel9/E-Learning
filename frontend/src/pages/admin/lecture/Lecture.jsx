/* eslint-disable react/prop-types */
import { Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Lecture({ lecture, index }) {
  const navigate = useNavigate();

  const goToUpdateLecture = () => {
    navigate(`${lecture._id}`);
  };

  return (
    <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 px-5 py-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 my-3">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Lecture {index + 1}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {lecture.lectureTitle}
        </p>
      </div>
      <button
        onClick={goToUpdateLecture}
        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        title="Edit Lecture"
      >
        <Edit
          size={20}
          className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
        />
      </button>
    </div>
  );
}
