import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";


const Course=()=> {
  return (
    <Card className ="overflow-hidden rounded-lg dark:bg-gray-800 bg-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
        <div className="relative">
            <img src="https://images.prismic.io/loco-blogs/79328284-f97b-489f-924c-eb3b17e34b56_image2.png?auto=compress%2Cformat&rect=0%2C0%2C1999%2C1124&w=1920&h=1080&ar=1.91%3A1"
            alt="course"
            className="w-full h-36 object-cover rounded-t-lg"/>
        </div>
            <CardContent className="px-5 py-4 space-y-3">
                            <h1 className="hover:underline font-bold text-lg truncate"> Mern stack full Course</h1>
                            <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                        <AvatarImage src={"https://github.com/shadcn.png"} alt="@shadcn" />
                        <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <h1 className="font-medium text-sm">Nikhil Patel</h1>
                    </div>
                    <Badge className={'bg-blue-600 text-white px-2 py-1 text-xs rounded-full'}>
                        Advance
                    </Badge>
                    </div>
                    <div className="text-lg font-bold">
                        <span>₹499</span>
                    </div>
            </CardContent>
    </Card>
  )
}
export default  Course
