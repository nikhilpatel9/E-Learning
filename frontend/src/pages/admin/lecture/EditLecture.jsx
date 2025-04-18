import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import LectureTab from "./LectureTab";

export default function EditLecture() {
  const { courseId } = useParams();

  return (
    <div className="min-h-screen px-4 py-6 md:px-10 bg-gray-50 dark:bg-gray-900">
      <div className="flex items-center gap-4 mb-6">
        <Link to={`/admin/course/${courseId}/lecture`}>
          <Button size="icon" variant="outline" className="rounded-full">
            <ArrowLeft size={18} />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Update Your Lecture
        </h1>
      </div>

      <LectureTab />
    </div>
  );
}
