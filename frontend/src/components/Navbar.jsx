/* eslint-disable react/prop-types */
import { Menu, School, SunMoon } from "lucide-react";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Link, useNavigate } from "react-router-dom";
import { useLogoutUserMutation, useLoadUserQuery } from "@/features/api/authApi";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { userLoggedIn, userLoggedOut } from "@/features/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const [theme, setTheme] = useState(
    localStorage.getItem('theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  );
  const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();
  const navigate = useNavigate();
  const { data: userData } = useLoadUserQuery(); // Load user from backend

  // Theme toggle logic
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark');
  };

  // Persist user from localStorage on app load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      dispatch(userLoggedIn({ user: JSON.parse(storedUser) }));
    }

    // Initial theme setup
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [dispatch, theme]);

  // Update Redux state and localStorage when backend returns user data
  useEffect(() => {
    if (userData?.user) {
      dispatch(userLoggedIn({ user: userData.user }));
      localStorage.setItem("user", JSON.stringify(userData.user));
    }
  }, [userData, dispatch]);
    
  // Handle logout success
  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "User logged out.");
      localStorage.removeItem("user");
      dispatch(userLoggedOut());
      navigate("/login");
    }
  }, [isSuccess, dispatch, navigate, data]);

  // Logout handler
  const logoutHandler = async () => {
    await logoutUser();
  };

  return (
    <nav 
      className="h-16 dark:bg-slate-900 bg-white border-b dark:border-b-gray-800 border-b-gray-200 fixed top-0 left-0 right-0 duration-300 z-50 shadow-sm"
      style={{ 
        overscrollBehaviorX: 'contain',
        width: '100vw',
        margin: 0,
        padding: 0,
      }}
    >
      {/* Desktop Navbar */}
      <div className="max-w-7xl mx-auto hidden md:flex justify-between items-center gap-10 h-full px-4">
        <div className="flex items-center gap-3 group">
          <School 
            size={30} 
            className="text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" 
          />
          <Link to="/" className="group">
            <h1 className="hidden md:block font-extrabold text-2xl text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              E-Learning
            </h1>
          </Link>
        </div>

        {/* User icons and theme toggle */}
        <div className="flex items-center gap-6">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 transition-transform duration-150 transform hover:scale-105 active:scale-100">
                  <Avatar className="cursor-pointer w-10 h-10 border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-200">
                    <AvatarImage 
                      src={user.photoUrl} 
                      alt={user.name || "User"} 
                      className="object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <AvatarFallback className="text-lg font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                      {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="w-56 bg-white dark:bg-slate-800 shadow-lg rounded-lg p-2 absolute right-0 top-full mt-2 border dark:border-gray-700"
                style={{
                  position: 'fixed',
                  transform: 'translateX(0)',
                }}
              >
                <DropdownMenuLabel className="text-lg font-semibold text-gray-700 dark:text-gray-200 px-3 py-2">
                  My Account
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="border-gray-200 dark:border-gray-700" />

                <DropdownMenuGroup>
                  <DropdownMenuItem className="hover:bg-blue-100 dark:hover:bg-blue-900 text-gray-700 dark:text-gray-200 rounded-md transition duration-200">
                    <Link to="my-learning" className="w-full block px-4 py-2">📚 My Learning</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-blue-100 dark:hover:bg-blue-900 text-gray-700 dark:text-gray-200 rounded-md transition duration-200">
                    <Link to="profile" className="w-full block px-4 py-2">✏️ Edit Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400 font-medium rounded-md transition duration-200 w-full block px-4 py-2"
                    onClick={logoutHandler}
                  >
                    🚪 Log Out
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                {user?.role === "instructor" && (
                  <>
                    <DropdownMenuSeparator className="border-gray-200 dark:border-gray-700 my-2" />
                    <DropdownMenuItem className="hover:bg-blue-100 dark:hover:bg-blue-900 text-gray-700 dark:text-gray-200 rounded-md transition duration-200">
                      <Link to="/admin/dashboard" className="w-full block px-4 py-2">📊 Dashboard</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                className="dark:border-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800"
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
              <Button 
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                onClick={() => navigate("/login")}
              >
                Signup
              </Button>
            </div>
          )}
          
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme} 
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle Theme"
          >
            <SunMoon 
              size={24} 
              className="text-gray-600 dark:text-gray-300 hover:rotate-45 transition-transform" 
            />
          </button>
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className="flex md:hidden items-center justify-between px-4 h-full">
        <h1 className="font-extrabold text-2xl text-gray-800 dark:text-gray-100">E-learning</h1>
        <MobileNavbar 
          user={user} 
          logoutHandler={logoutHandler} 
          theme={theme} 
          toggleTheme={toggleTheme} 
        />
      </div>
    </nav>
  );
};

export default Navbar;

// Mobile Navbar Component
const MobileNavbar = ({ user, logoutHandler, toggleTheme }) => {
  const navigate = useNavigate();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          size="icon" 
          className="rounded-full hover:bg-gray-200 dark:hover:bg-slate-800" 
          variant="outline"
        >
          <Menu className="text-gray-700 dark:text-gray-300" />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col dark:bg-slate-900 dark:text-gray-200">
        <SheetHeader className="flex flex-row items-center justify-between mt-2">
          <SheetTitle>
            <Link 
              to="/" 
              className="text-gray-800 dark:text-gray-100 font-bold hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              E-Learning
            </Link>
          </SheetTitle>
          <button 
            onClick={toggleTheme} 
            className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle Theme"
          >
            <SunMoon 
              size={20} 
              className="text-gray-600 dark:text-gray-300 hover:rotate-45 transition-transform" 
            />
          </button>
        </SheetHeader>
        <div className="border-b dark:border-gray-700 mr-2 my-2" />
        <nav className="flex flex-col space-y-4 mt-6">
          <Link 
            to="/my-learning" 
            className="py-2 px-3 hover:bg-blue-100 dark:hover:bg-blue-900 text-gray-700 dark:text-gray-200 rounded-md transition-all duration-200"
          >
            My Learning
          </Link>
          <Link 
            to="/profile" 
            className="py-2 px-3 hover:bg-blue-100 dark:hover:bg-blue-900 text-gray-700 dark:text-gray-200 rounded-md transition-all duration-200"
          >
            Edit Profile
          </Link>
          <p 
            onClick={logoutHandler} 
            className="cursor-pointer py-2 px-3 hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400 rounded-md transition-all duration-200"
          >
            Log Out
          </p>
        </nav>
        {user?.role === "instructor" && (
          <SheetFooter className="mt-auto">
            <SheetClose asChild>
              <Button 
                type="submit" 
                onClick={() => navigate("/admin/dashboard")}
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
              >
                Dashboard
              </Button>
            </SheetClose>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};