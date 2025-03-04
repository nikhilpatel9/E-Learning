/*import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useLoginUserMutation,
  useRegisterUserMutation,
  useGoogleLoginMutation,
} from "@/features/api/authApi";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

// Google Login Button Component
const GoogleLoginButton = () => {
  const [googleLogin, { isLoading }] = useGoogleLoginMutation();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const result = await googleLogin().unwrap();
      if (result.success) {
        toast.success(result.message || "Successfully logged in with Google");
        navigate("/");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to login with Google");
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleGoogleLogin}
      disabled={isLoading}
      className="w-full flex items-center justify-center gap-2"
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : ( 'Continue with Google'
      )}
     
    </Button>
  );
};

const Login = () => {
  const [signupInput, setSignupInput] = useState({ name: "", email: "", password: "" });
  const [loginInput, setLoginInput] = useState({ email: "", password: "" });

  const [registerUser, { data: registerData, error: registerError, isLoading: registerIsLoading, isSuccess: registerIsSuccess }] = useRegisterUserMutation();
  const [loginUser, { data: loginData, error: loginError, isLoading: loginIsLoading, isSuccess: loginIsSuccess }] = useLoginUserMutation();

  const changeInputHandler = (e, type) => {
    const { name, value } = e.target;
    type === "signup"
      ? setSignupInput({ ...signupInput, [name]: value })
      : setLoginInput({ ...loginInput, [name]: value });
  };

  const handleRegistration = async (type) => {
    const inputData = type === "signup" ? signupInput : loginInput;
    const action = type === "signup" ? registerUser : loginUser;
    if (Object.values(inputData).some((val) => val.trim() === "")) {
      toast.error("Please fill in all fields.");
      return;
    }
    await action(inputData);
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (registerIsSuccess && registerData) toast.success(registerData.message || "Signup successful.");
    if (registerError) toast.error(registerError.data.message || "Signup Failed");
    if (loginIsSuccess && loginData) {
      toast.success(loginData.message || "Login successful.");
      navigate("/");
    }
    if (loginError) toast.error(loginError.data.message || "Login Failed");
  }, [loginIsLoading, registerIsLoading, loginData, registerData, loginError, registerError, loginIsSuccess, registerIsSuccess, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Tabs defaultValue="login" className="w-[400px] bg-white p-6 shadow-lg rounded-lg">
        <TabsList className="grid w-full grid-cols-2 bg-gray-200 p-1 rounded-lg">
          <TabsTrigger value="signup">Signup</TabsTrigger>
          <TabsTrigger value="login">Login</TabsTrigger>
        </TabsList>
        <TabsContent value="signup">
          <Card className="p-4">
            <CardHeader>
              <CardTitle>Signup</CardTitle>
              <CardDescription>Create a new account and click signup when you&apos;re done.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Label htmlFor="name">Name</Label>
              <Input 
                type="text" 
                name="name" 
                value={signupInput.name} 
                onChange={(e) => changeInputHandler(e, "signup")} 
                placeholder="Full Name" 
                required 
              />

              <Label htmlFor="email">Email</Label>
              <Input 
                type="email" 
                name="email" 
                value={signupInput.email} 
                onChange={(e) => changeInputHandler(e, "signup")} 
                placeholder="xyz@gmail.com" 
                required 
              />

              <Label htmlFor="password">Password</Label>
              <Input 
                type="password" 
                name="password" 
                value={signupInput.password} 
                onChange={(e) => changeInputHandler(e, "signup")} 
                placeholder="*******" 
                required 
              />
            </CardContent>
            <CardFooter className="flex flex-col space-y-3">
              <Button 
                disabled={registerIsLoading} 
                onClick={() => handleRegistration("signup")} 
                className="w-full"
              >
                {registerIsLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Signup"}
              </Button>
              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>
              <GoogleLoginButton />
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="login">
          <Card className="p-4">
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>Enter your credentials to log in.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Label htmlFor="email">Email</Label>
              <Input 
                type="email" 
                name="email" 
                value={loginInput.email} 
                onChange={(e) => changeInputHandler(e, "login")} 
                placeholder="xyz@gmail.com" 
                required 
              />

              <Label htmlFor="password">Password</Label>
              <Input 
                type="password" 
                name="password" 
                value={loginInput.password} 
                onChange={(e) => changeInputHandler(e, "login")} 
                placeholder="*******" 
                required 
              />
            </CardContent>
            <CardFooter className="flex flex-col space-y-3">
              <Button 
                disabled={loginIsLoading} 
                onClick={() => handleRegistration("login")} 
                className="w-full"
              >
                {loginIsLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Login"}
              </Button>
              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>
              <GoogleLoginButton />
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Login;
*/

 import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useLoginUserMutation,
  useRegisterUserMutation,
  useGoogleLoginMutation,
} from "@/features/api/authApi";
import { Loader2, LogIn } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

// Google Login Button Component
const GoogleLoginButton = () => {
  const [googleLogin, { isLoading }] = useGoogleLoginMutation();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const result = await googleLogin().unwrap();
      if (result.success) {
        toast.success(result.message || "Successfully logged in with Google");
        navigate("/");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to login with Google");
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleGoogleLogin}
      disabled={isLoading}
      className="w-full flex items-center justify-center gap-2 dark:border-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            x="0px" 
            y="0px" 
            width="24" 
            height="24" 
            viewBox="0 0 48 48"
          >
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
          </svg>
          Continue with Google
        </>
      )}
    </Button>
  );
};

const Login = () => {
  const [signupInput, setSignupInput] = useState({ name: "", email: "", password: "" });
  const [loginInput, setLoginInput] = useState({ email: "", password: "" });

  const [registerUser, { data: registerData, error: registerError, isLoading: registerIsLoading, isSuccess: registerIsSuccess }] = useRegisterUserMutation();
  const [loginUser, { data: loginData, error: loginError, isLoading: loginIsLoading, isSuccess: loginIsSuccess }] = useLoginUserMutation();

  const changeInputHandler = (e, type) => {
    const { name, value } = e.target;
    type === "signup"
      ? setSignupInput({ ...signupInput, [name]: value })
      : setLoginInput({ ...loginInput, [name]: value });
  };

  const handleRegistration = async (type) => {
    const inputData = type === "signup" ? signupInput : loginInput;
    const action = type === "signup" ? registerUser : loginUser;
    if (Object.values(inputData).some((val) => val.trim() === "")) {
      toast.error("Please fill in all fields.");
      return;
    }
    await action(inputData);
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (registerIsSuccess && registerData) toast.success(registerData.message || "Signup successful.");
    if (registerError) toast.error(registerError.data.message || "Signup Failed");
    if (loginIsSuccess && loginData) {
      toast.success(loginData.message || "Login successful.");
      navigate("/");
    }
    if (loginError) toast.error(loginError.data.message || "Login Failed");
  }, [loginIsLoading, registerIsLoading, loginData, registerData, loginError, registerError, loginIsSuccess, registerIsSuccess, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-slate-900 px-4">
      <Tabs 
        defaultValue="login" 
        className="w-full max-w-[400px] bg-white dark:bg-slate-800 p-6 shadow-lg rounded-lg border dark:border-gray-700"
      >
        <TabsList className="grid w-full grid-cols-2 bg-gray-200 dark:bg-slate-700 p-1 rounded-lg">
          <TabsTrigger 
            value="signup" 
            className="data-[state=active]:bg-white data-[state=active]:text-gray-900 dark:data-[state=active]:bg-slate-900 dark:data-[state=active]:text-gray-100"
          >
            Signup
          </TabsTrigger>
          <TabsTrigger 
            value="login" 
            className="data-[state=active]:bg-white data-[state=active]:text-gray-900 dark:data-[state=active]:bg-slate-900 dark:data-[state=active]:text-gray-100"
          >
            Login
          </TabsTrigger>
        </TabsList>
        <TabsContent value="signup">
          <Card className="p-4 border-none shadow-none dark:bg-slate-800">
            <CardHeader>
              <CardTitle className="text-gray-800 dark:text-gray-100">Signup</CardTitle>
              <CardDescription className="dark:text-gray-400">
                Create a new account and click signup when you&apos;re done.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="dark:text-gray-300">Name</Label>
                <Input 
                  type="text" 
                  name="name" 
                  value={signupInput.name} 
                  onChange={(e) => changeInputHandler(e, "signup")} 
                  placeholder="Full Name" 
                  required 
                  className="dark:bg-slate-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="dark:text-gray-300">Email</Label>
                <Input 
                  type="email" 
                  name="email" 
                  value={signupInput.email} 
                  onChange={(e) => changeInputHandler(e, "signup")} 
                  placeholder="xyz@gmail.com" 
                  required 
                  className="dark:bg-slate-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="dark:text-gray-300">Password</Label>
                <Input 
                  type="password" 
                  name="password" 
                  value={signupInput.password} 
                  onChange={(e) => changeInputHandler(e, "signup")} 
                  placeholder="*******" 
                  required 
                  className="dark:bg-slate-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-3">
              <Button 
                disabled={registerIsLoading} 
                onClick={() => handleRegistration("signup")} 
                className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
              >
                {registerIsLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Signup
                  </>
                )}
              </Button>
              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t dark:border-gray-700" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-slate-800 px-2 text-muted-foreground dark:text-gray-400">Or continue with</span>
                </div>
              </div>
              <GoogleLoginButton />
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="login">
          <Card className="p-4 border-none shadow-none dark:bg-slate-800">
            <CardHeader>
              <CardTitle className="text-gray-800 dark:text-gray-100">Login</CardTitle>
              <CardDescription className="dark:text-gray-400">
                Enter your credentials to log in.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="dark:text-gray-300">Email</Label>
                <Input 
                  type="email" 
                  name="email" 
                  value={loginInput.email} 
                  onChange={(e) => changeInputHandler(e, "login")} 
                  placeholder="xyz@gmail.com" 
                  required 
                  className="dark:bg-slate-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="dark:text-gray-300">Password</Label>
                <Input 
                  type="password" 
                  name="password" 
                  value={loginInput.password} 
                  onChange={(e) => changeInputHandler(e, "login")} 
                  placeholder="*******" 
                  required 
                  className="dark:bg-slate-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-3">
              <Button 
                disabled={loginIsLoading} 
                onClick={() => handleRegistration("login")} 
                className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
              >
                {loginIsLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </>
                )}
              </Button>
              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t dark:border-gray-700" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-slate-800 px-2 text-muted-foreground dark:text-gray-400">Or continue with</span>
                </div>
              </div>
              <GoogleLoginButton />
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Login; 




