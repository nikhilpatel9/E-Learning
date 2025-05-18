import { useState } from "react";
import Filter from "./Filter";
import SearchResult from "./SearchResult";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetSearchCourseQuery } from "@/features/api/courseApi";
import { Link, useSearchParams } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";

  // Categories as array of strings
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortByPrice, setSortByPrice] = useState("");

  // Pass the categories array directly to the API
  const { data, isLoading } = useGetSearchCourseQuery({
    searchQuery: query,
    categories: selectedCategories, // Pass array directly
    sortByPrice,
  });

  const isEmpty = !isLoading && data?.courses.length === 0;

  const handleFilterChange = (categories, price) => {
    setSelectedCategories(categories);
    setSortByPrice(price);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <div className="my-6">
        <h1 className="font-bold text-xl md:text-2xl">Result for `{query}`</h1>
        <p>
          Showing results for{" "}
          <span className="text-blue-800 font-bold italic">{query}</span>
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-10">
        {/* Pass selectedCategories and sortByPrice to Filter */}
        <Filter
          selectedCategories={selectedCategories}
          sortByPrice={sortByPrice}
          handleFilterChange={handleFilterChange}
        />
        <div className="flex-1">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, idx) => <CourseSkeleton key={idx} />)
          ) : isEmpty ? (
            <CourseNotFound />
          ) : (
            data?.courses?.map((course) => <SearchResult key={course._id} course={course} />)
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;

const CourseNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center min-h-64 dark:bg-gray-900 p-6">
      <AlertCircle className="text-red-500 h-16 w-16 mb-4" />
      <h1 className="font-bold text-3xl text-gray-800 dark:text-gray-200 mb-2">
        Course Not Found
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-4 max-w-md">
        Sorry, we couldn&apos;t find any courses matching your search. Try adjusting your filters or keywords.
      </p>
      <Link to="/" className="italic">
        <Button variant="link" className="text-blue-600 dark:text-blue-400">
          Browse All Courses
        </Button>
      </Link>
    </div>
  );
};

const CourseSkeleton = () => {
  return (
    <div className="flex flex-col md:flex-row items-center gap-4 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm animate-pulse">
      <div className="w-full md:w-60 h-36 rounded-md overflow-hidden">
        <Skeleton className="h-full w-full" />
      </div>

      <div className="flex-1 space-y-2 w-full">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-6 w-24 mt-2" />
      </div>

      <div className="hidden md:flex flex-col items-end justify-between h-full">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-8 w-24 mt-4" />
      </div>
    </div>
  );
};