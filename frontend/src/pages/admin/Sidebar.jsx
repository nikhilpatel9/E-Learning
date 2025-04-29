import { ChartNoAxesColumn, SquareLibrary } from "lucide-react";
import { Link, Outlet } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-[250px] sm:w-[300px] border-r border-gray-200 dark:border-gray-700 p-6 sticky top-0 h-screen bg-white dark:bg-gray-900 shadow-lg dark:shadow-gray-800 transition-all duration-300">
        {/* Navigation Links */}
        <nav className="space-y-6">
          <Link
            to="dashboard"
            className="flex items-center gap-3 px-4 py-3 text-lg font-semibold text-gray-700 dark:text-gray-300 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400"
          >
            <ChartNoAxesColumn size={24} />
            <span>Dashboard</span>
          </Link>

          <Link
            to="course"
            className="flex items-center gap-3 px-4 py-3 text-lg font-semibold text-gray-700 dark:text-gray-300 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400"
          >
            <SquareLibrary size={24} />
            <span>Courses</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 bg-gray-50 dark:bg-gray-800 transition-all duration-300">
        <Outlet />
      </main>
    </div>
  );
};

export default Sidebar;
