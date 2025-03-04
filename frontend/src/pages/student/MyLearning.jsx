
import Course from "./Course";

export default function MyLearning() {
    const isLoading = false;
    const myLearning = [1,2];
    return (
      <div className="max-w-4xl mx-auto my-10 px-4 md:px-0">
        <h1 className="font-bold text-2xl text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-3">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-7 w-7 text-blue-600 dark:text-blue-400"
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" 
            />
          </svg>
          MY LEARNING
        </h1>
        <div className="my-5">
          {isLoading ? (
            <MyLearningSkeleton />
          ) : myLearning.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 dark:bg-slate-800 rounded-lg">
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                You are not enrolled in any courses yet.
              </p>
              <button 
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                onClick={() => {/* Navigate to courses */}}
              >
                Explore Courses
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {myLearning.map((course, index) => (
                <Course key={index} course={course}/>
              ))}
            </div>
          )}
        </div>
      </div>
    );
}

const MyLearningSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
    {[...Array(3)].map((_, index) => (
      <div
        key={index}
        className="bg-gray-200 dark:bg-slate-700 rounded-lg h-48 animate-pulse shadow-sm"
      >
        <div className="h-1/2 bg-gray-300 dark:bg-slate-600 rounded-t-lg mb-4"></div>
        <div className="px-4 space-y-2">
          <div className="h-4 bg-gray-300 dark:bg-slate-600 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 dark:bg-slate-600 rounded w-1/2"></div>
        </div>
      </div>
    ))}
  </div>
);