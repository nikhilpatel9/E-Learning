
import { useGetPurchasedCoursesQuery } from "@/features/api/purchaseApi";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, TrendingUp, DollarSign, BookOpen, Users } from "lucide-react";

// Conversion rate from INR to USD (approximate)
const RUPEE_TO_DOLLAR_RATE = 1;

const Dashboard = () => {
  // eslint-disable-next-line no-unused-vars
  const { data, isSuccess, isError, isLoading } = useGetPurchasedCoursesQuery();

  // Display loading state with skeleton UI
  if (isLoading) {
    return (
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="shadow-lg">
            <CardHeader>
              <Skeleton className="h-5 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
        <Card className="shadow-lg col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4">
          <CardHeader>
            <Skeleton className="h-5 w-40" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Display error state
  if (isError) {
    return (
      <div className="flex items-center justify-center p-8 bg-red-50 border border-red-200 rounded-lg">
        <AlertCircle className="text-red-500 mr-2 h-6 w-6" />
        <h1 className="text-red-500 font-medium">Failed to fetch purchased courses</h1>
      </div>
    );
  }

  // Properly destructure the data
  const { purchasedCourse = [] } = data || {};

  // Helper function to convert string prices to numbers and rupees to dollars
  const convertToUSD = (priceInRupees) => {
    // Convert string to number if needed
    const numericPrice = typeof priceInRupees === 'string' 
      ? parseFloat(priceInRupees.replace(/[^\d.-]/g, '')) 
      : Number(priceInRupees);
    
    // Convert rupees to dollars
    return numericPrice * RUPEE_TO_DOLLAR_RATE;
  };

  // Calculate metrics with converted prices
  const totalRevenue = purchasedCourse.reduce((acc, element) => {
    const amount = element.amount ? convertToUSD(element.amount) : 0;
    return acc + amount;
  }, 0);
  
  const totalSales = purchasedCourse.length;
  
  // Create unique customers count
  const uniqueCustomers = new Set(purchasedCourse.map(course => course.userId)).size;

  // Format the data for charts with converted prices
  const courseData = purchasedCourse.map((course) => {
    const courseTitle = course.courseId?.courseTitle || 'Untitled';
    const displayTitle = courseTitle.substring(0, 20) + (courseTitle.length > 20 ? '...' : '');
    
    // Convert course price to USD
    const coursePrice = course.courseId?.coursePrice 
      ? convertToUSD(course.courseId.coursePrice) 
      : 0;
    
    return {
      name: displayTitle,
      price: coursePrice,
      sales: 1,
    };
  });

  // Aggregate sales by course name for bar chart
  const courseSalesData = {};
  purchasedCourse.forEach(course => {
    const name = course.courseId?.courseTitle || 'Untitled';
    if (!courseSalesData[name]) {
      courseSalesData[name] = { name, count: 0 };
    }
    courseSalesData[name].count++;
  });

  const barData = Object.values(courseSalesData).sort((a, b) => b.count - a.count).slice(0, 5);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard Overview</h1>
      
      {/* Stats Cards */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 shadow-lg border-blue-200 dark:border-blue-700 hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-blue-800 dark:text-blue-200 flex items-center text-lg">
              <BookOpen className="mr-2 h-5 w-5" />
              Total Sales
            </CardTitle>
            <CardDescription className="text-blue-600 dark:text-blue-300">
              Total courses sold
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-700 dark:text-blue-100">{totalSales}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 shadow-lg border-green-200 dark:border-green-700 hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-green-800 dark:text-green-200 flex items-center text-lg">
              <DollarSign className="mr-2 h-5 w-5" />
              Total Revenue
            </CardTitle>
            <CardDescription className="text-green-600 dark:text-green-300">
              Total income generated
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-700 dark:text-green-100">${totalRevenue.toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 shadow-lg border-purple-200 dark:border-purple-700 hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-purple-800 dark:text-purple-200 flex items-center text-lg">
              <Users className="mr-2 h-5 w-5" />
              Customers
            </CardTitle>
            <CardDescription className="text-purple-600 dark:text-purple-300">
              Unique customers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-700 dark:text-purple-100">{uniqueCustomers}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900 dark:to-amber-800 shadow-lg border-amber-200 dark:border-amber-700 hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-amber-800 dark:text-amber-200 flex items-center text-lg">
              <TrendingUp className="mr-2 h-5 w-5" />
              Avg. Price
            </CardTitle>
            <CardDescription className="text-amber-600 dark:text-amber-300">
              Average course price
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-amber-700 dark:text-amber-100">
              ${(totalRevenue / totalSales || 0).toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Course Prices Chart */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 col-span-1 lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800 dark:text-white">
              Course Prices
            </CardTitle>
            <CardDescription>
              Price comparison across different courses
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={courseData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis
                  dataKey="name"
                  stroke="#6b7280"
                  angle={-45}
                  textAnchor="end"
                  height={70}
                  interval={0}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  stroke="#6b7280"
                  tickFormatter={(value) => `$${value.toFixed(2)}`}
                />
                <Tooltip 
                  formatter={(value) => [`$${value.toFixed(2)}`, 'Price']}
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '8px',
                    border: '1px solid #e0e0e0',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  dot={{ stroke: "#4f46e5", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "#4f46e5", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Selling Courses */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 col-span-1 lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800 dark:text-white">
              Top Selling Courses
            </CardTitle>
            <CardDescription>
              Courses with highest number of sales
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis 
                  dataKey="name" 
                  stroke="#6b7280" 
                  angle={-45} 
                  textAnchor="end" 
                  height={70}
                  interval={0}
                  tick={{ fontSize: 12 }}
                />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  formatter={(value) => [value, 'Sales']}
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '8px',
                    border: '1px solid #e0e0e0',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="count" 
                  name="Sales" 
                  fill="#10b981" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* No Data State */}
      {purchasedCourse.length === 0 && (
        <div className="flex flex-col items-center justify-center p-8 mt-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
          <BookOpen className="text-gray-400 h-12 w-12 mb-4" />
          <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">No Sales Data Yet</h2>
          <p className="text-gray-500 dark:text-gray-400 text-center">
            Once you make your first sale, you&apos;ll see detailed analytics here.
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;