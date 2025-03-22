import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, PlayCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <div className="relative bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-gray-900 dark:to-gray-800 py-24 px-4 text-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-600/10 dark:from-gray-900/20 dark:to-gray-800/20 pointer-events-none"></div>
      
      <div className="relative max-w-4xl mx-auto z-10">
        <div className="space-y-6">
          <div className="inline-block px-4 py-2 bg-white/10 dark:bg-gray-800/20 backdrop-blur-sm rounded-full text-white text-sm font-medium tracking-wide">
            Learn Anytime, Anywhere
          </div>
          
          <h1 className="text-white text-5xl md:text-6xl font-extrabold mb-4 leading-tight">
            Find the Best Courses for Your Future
          </h1>
          
          <p className="text-gray-200 dark:text-gray-300 text-lg max-w-2xl mx-auto mb-8">
            Discover, Learn, and Upskill with our comprehensive range of courses designed to boost your career and personal growth
          </p>
          
          <form className="flex items-center bg-white dark:bg-gray-800 rounded-full shadow-2xl overflow-hidden max-w-xl mx-auto mb-8">
            <Search className="ml-4 text-gray-400 dark:text-gray-500" />
            <Input
              type="text"
              placeholder="Search Courses"
              className="flex-grow border-none focus-visible:ring-0 px-4 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
            />
            <Button 
              type="submit" 
              className="bg-blue-600 dark:bg-blue-700 text-white px-6 py-3 rounded-r-full hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors duration-300"
            >
              Search
            </Button>
          </form>
          
          <div className="flex justify-center space-x-4">
            <Button 
              onClick={()=> navigate(`courses`)}
              className="bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300 px-6 py-3"
            >
              Explore Courses
            </Button>
            <Button 
              variant="outline" 
              className="text-blue-600  dark:bg-gray-800 dark:text-white border-white/30 hover:bg-white/10 rounded-full px-6 py-3 flex items-center gap-2"
            >
              <PlayCircle className="w-5 h-5" />
              Watch Intro
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;