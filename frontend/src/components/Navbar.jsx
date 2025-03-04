/* eslint-disable react/prop-types */
import { Menu, School } from "lucide-react";
import { useEffect } from "react";
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
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { useLogoutUserMutation, useLoadUserQuery } from "@/features/api/authApi";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { userLoggedIn, userLoggedOut } from "@/features/authSlice";
import DarkMode from "@/DarkMode";

const Navbar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();
  const navigate = useNavigate();
  const { data: userData } = useLoadUserQuery(); // Load user from backend

  // Logout handler
  const logoutHandler = async () => {
    await logoutUser();
  };

  // Persist user from localStorage on app load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      dispatch(userLoggedIn({ user: JSON.parse(storedUser) }));
    }
  }, [dispatch]);

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

  return (
    <div className="h-16 dark:bg-[#020817] bg-white border-b dark:border-b-gray-800 border-b-gray-200 fixed top-0 left-0 right-0 duration-300 z-10">
      {/* Desktop Navbar */}
      <div className="max-w-7xl mx-auto hidden md:flex justify-between items-center gap-10 h-full px-4">
        <div className="flex items-center gap-2">
          <School size={"30"} />
          <Link to="/">
            <h1 className="hidden md:block font-extrabold text-2xl">E-Learning</h1>
          </Link>
        </div>

        {/* User icons and dark mode icon */}
        <div className="flex items-center gap-8">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-full focus:outline-none focus:ring-0 transition-transform duration-150 transform hover:scale-105 active:scale-100">
                  <Avatar className="cursor-pointer w-10 h-10 border-2 border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-200">
                    <AvatarImage 
                      src={user.photoUrl} 
                      alt={user.name || "User"} 
                      className="object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <AvatarFallback className="text-lg font-medium">
                      {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Link to="my-learning" className="w-full">My Learning</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="profile" className="w-full">Edit Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logoutHandler}>Log Out</DropdownMenuItem>
                </DropdownMenuGroup>
                {user?.role === "instructor" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link to="/admin/dashboard" className="w-full">Dashboard</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => navigate("/login")}>Login</Button>
              <Button onClick={() => navigate("/login")}>Signup</Button>
            </div>
          )}
          <DarkMode />
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className="flex md:hidden items-center justify-between px-4 h-full">
        <h1 className="font-extrabold text-2xl">E-learning</h1>
        <MobileNavbar user={user} logoutHandler={logoutHandler} />
      </div>
    </div>
  );
};

export default Navbar;

// Mobile Navbar Component
const MobileNavbar = ({ user, logoutHandler }) => {
  const navigate = useNavigate();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" className="rounded-full hover:bg-gray-200" variant="outline">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader className="flex flex-row items-center justify-between mt-2">
          <SheetTitle><Link to="/">E-Learning</Link></SheetTitle>
          <DarkMode />
        </SheetHeader>
        <Separator className="mr-2" />
        <nav className="flex flex-col space-y-4 mt-6">
          <Link to="/my-learning" className="py-2 px-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-all duration-200">My Learning</Link>
          <Link to="/profile" className="py-2 px-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-all duration-200">Edit Profile</Link>
          <p onClick={logoutHandler} className="cursor-pointer py-2 px-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-all duration-200">Log Out</p>
        </nav>
        {user?.role === "instructor" && (
          <SheetFooter className="mt-auto">
            <SheetClose asChild>
              <Button type="submit" onClick={() => navigate("/admin/dashboard")}>Dashboard</Button>
            </SheetClose>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};