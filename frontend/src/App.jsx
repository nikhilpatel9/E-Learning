import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import HeroSection from "./pages/student/HeroSection";
import MainLayout from "./layout/MainLayout";
import Courses from "./pages/student/Courses";
import MyLearning from "./pages/student/MyLearning";
import Profile from "./pages/student/Profile";
import Sidebar from "./pages/admin/lecture/Sidebar";
import Dashboard from "./pages/admin/lecture/Dashboard";
import CourseTable from "./pages/admin/Course/CourseTable";
import { ThemeProvider } from "./components/ThemeProvider";
import AddCourse from "./pages/admin/Course/AddCourse";



const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: (
          <>
            <HeroSection />
            <Courses/>
          </>
        ),
      },
      {
        path: "login",
        element: (
            <Login />
        ),
      },
      {
        path: "my-learning",
        element: (
          <MyLearning/>
          ),
      },{
        path: "profile",
        element:(
            <Profile />
        ),
      }
      ,{
        path: "admin",
        element: (
          <Sidebar/>),
        children: [
          {
            path: "dashboard",
            element: (
              <Dashboard/>
              ),
          },{
            path: "course",
            element: (
              <CourseTable/>
            ),
          },{
            path: "course/create",
            element: <AddCourse />,
          }
        ]
      }
      
    ],
  },
]);

function App() {
  return (
    <main>
      <ThemeProvider>
      <RouterProvider router={appRouter} />
      </ThemeProvider>
     
    </main>
  );
}

export default App;