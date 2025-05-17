import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import HeroSection from "./pages/student/HeroSection";
import MainLayout from "./layout/MainLayout";
import Courses from "./pages/student/Courses";
import MyLearning from "./pages/student/MyLearning";
import Profile from "./pages/student/Profile";
import Sidebar from "./pages/admin/Sidebar";
import Dashboard from "./pages/admin/Dashboard";
import CourseTable from "./pages/admin/Course/CourseTable";
import { ThemeProvider } from "./components/ThemeProvider";
import AddCourse from "./pages/admin/Course/AddCourse";
import EditCourse from "./pages/admin/Course/EditCourse";
import CreateLecture from "./pages/admin/lecture/CreateLecture";
import EditLecture from "./pages/admin/lecture/EditLecture";
import CourseDetail from "./pages/student/CourseDetail";
import CourseProgress from "./pages/student/CourseProgress";

import {
  AdminRoute,
  AuthenticatedUser,
  ProtectedRoute,
} from "./components/ProtectedRoutes";
import PurchaseCourseProtectedRoute from "./components/PurchaseCourseProtectedRoute";


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
      },{
        path: "courses",
        element: <Courses/>
      },
      {
        path: "login",
        element: (
            <AuthenticatedUser>
            <Login />
          </AuthenticatedUser>
        ),
      },
      {
        path: "my-learning",
        element: (
           <ProtectedRoute>
            <MyLearning />
          </ProtectedRoute>
          ),
      },{
        path: "profile",
        element:(
            <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      }, {
        path: "course-detail/:courseId",
        element: (
          
            <ProtectedRoute>
            <CourseDetail />
          </ProtectedRoute>
         
        ),
      }, {
        path: "course-progress/:courseId",
        element: (
         <ProtectedRoute>
            <PurchaseCourseProtectedRoute>
            <CourseProgress />
            </PurchaseCourseProtectedRoute>
          </ProtectedRoute>
          
        ),
      },
      {
        path: "admin",
        element: (
          <AdminRoute>
            <Sidebar />
          </AdminRoute>),
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
          },{
            path: "course/:courseId",
            element:<EditCourse />,
          }, {
            path: "course/:courseId/lecture",
            element: <CreateLecture />,
          },{
            path: "course/:courseId/lecture/:lectureId",
            element: <EditLecture />,
          },
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