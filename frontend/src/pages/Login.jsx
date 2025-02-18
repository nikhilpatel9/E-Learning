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