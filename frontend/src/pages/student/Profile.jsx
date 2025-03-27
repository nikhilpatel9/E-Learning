import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Edit, UserCircle, Mail, Crown } from "lucide-react";
import { useEffect, useState } from "react";
import Course from "./Course";
import {
  useLoadUserQuery,
  useUpdateUserMutation,
} from "@/features/api/authApi";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";

const Profile = () => {
  const [name, setName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");

  const { data, isLoading, refetch } = useLoadUserQuery();
  const [
    updateUser,
    {
      data: updateUserData,
      isLoading: updateUserIsLoading,
      isError,
      error,
      isSuccess,
    },
  ] = useUpdateUserMutation();

  // Add this useEffect to set initial name
  useEffect(() => {
    if (data && data.user) {
      setName(data.user.name || "");
    }
  }, [data]);

  const onChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) setProfilePhoto(file);
  };

  const updateUserHandler = async () => {
    const formData = new FormData();
    formData.append("name", name);
    if (profilePhoto) {
      formData.append("profilePhoto", profilePhoto);
    }
    await updateUser(formData);
  };

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success(updateUserData?.message || "Profile updated.");
    }
    if (isError) {
      toast.error(error?.message || "Failed to update profile");
    }
  }, [error, updateUserData, isSuccess, isError, refetch]);

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-screen">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );

  const user = data && data.user;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <div className="flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-900/60 p-6 rounded-xl shadow-soft">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <Avatar className="h-28 w-28 md:h-36 md:w-36 border-4 border-white dark:border-gray-800 shadow-lg">
              <AvatarImage
                src={user?.photoUrl || "https://github.com/shadcn.png"}
                alt={user?.name || "Profile"}
                className="object-cover"
              />
              <AvatarFallback className="bg-blue-100 text-blue-600">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="absolute bottom-0 right-0 rounded-full bg-white dark:bg-gray-800 border-2 border-blue-100 dark:border-gray-700"
                >
                  <Edit className="h-4 w-4 text-blue-600" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                  <DialogDescription>
                    Make changes to your profile here. Click save when you&apos;re done.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label>Name</Label>
                    <Input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Name"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label>Profile Photo</Label>
                    <Input
                      onChange={onChangeHandler}
                      type="file"
                      accept="image/*"
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    disabled={updateUserIsLoading}
                    onClick={updateUserHandler}
                  >
                    {updateUserIsLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="text-center md:text-left space-y-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <UserCircle className="h-6 w-6 text-blue-600" />
              {user.name}
            </h1>
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Mail className="h-4 w-4 text-blue-600" />
              {user.email}
            </div>
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Crown className="h-4 w-4 text-blue-600" />
              {user.role.toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      <Card className="shadow-soft">
        <CardContent className="p-6">
          <h1 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span>Courses you&apos;re enrolled in</span>
          </h1>
          {user.enrolledCourses.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>You haven&apos;t enrolled in any courses yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {user.enrolledCourses.map((course) => (
                <Course course={course} key={course._id} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;