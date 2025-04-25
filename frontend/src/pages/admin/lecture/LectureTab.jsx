import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Trash2, Save, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useEditLectureMutation,
  useGetLectureByIdQuery,
  useRemoveLectureMutation,
} from "@/features/api/courseApi";
import { toast } from "sonner";
import axios from "axios";

const MEDIA_API = "http://localhost:8080/api/media";

export default function LectureTab() {
  const [lectureTitle, setLectureTitle] = useState("");
  const [uploadVideoInfo, setUploadVideoInfo] = useState(null);
  const [isFree, setIsFree] = useState(false);
  const [mediaProgress, setMediaProgress] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();
  const params = useParams();
  const { courseId, lectureId } = params;

  const { data: lectureData } = useGetLectureByIdQuery(lectureId);
  const lecture = lectureData?.lecture;

  useEffect(() => {
    if (lecture) {
      setLectureTitle(lecture.lectureTitle);
      setIsFree(lecture.isPreviewFree);
      setUploadVideoInfo(lecture.videoInfo);
    }
  }, [lecture]);

  const [editLecture, { data, isLoading, error, isSuccess }] = useEditLectureMutation();
  const [removeLecture, { data: removeData, isLoading: removeLoading, isSuccess: removeSuccess }] = useRemoveLectureMutation();

  const fileChangeHandler = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      setMediaProgress(true);
      try {
        const res = await axios.post(`${MEDIA_API}/upload-video`, formData, {
          onUploadProgress: ({ loaded, total }) => {
            setUploadProgress(Math.round((loaded * 100) / total));
          },
        });

        if (res.data.success) {
          setUploadVideoInfo({
            videoUrl: res.data.data.url,
            publicId: res.data.data.public_id,
          });
          toast.success(res.data.message);
        }
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        toast.error("Video upload failed");
      } finally {
        setMediaProgress(false);
      }
    }
  };

  const editLectureHandler = async () => {
    await editLecture({
      lectureTitle,
      videoInfo: uploadVideoInfo,
      isPreviewFree: isFree,
      courseId,
      lectureId,
    });
  };

  const removeLectureHandler = async () => {
    await removeLecture(lectureId);
  };

  useEffect(() => {
    if (isSuccess) toast.success(data.message);
    if (error) toast.error(error.data.message);
  }, [isSuccess, error]);

  useEffect(() => {
    if (removeSuccess) {
      toast.success(removeData.message);
      navigate(-1); // Navigate to the previous page after deletion
    }
  }, [removeSuccess]);

  return (
    <Card className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-700">
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <CardTitle className="text-xl text-gray-900 dark:text-white">Edit Lecture</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Make changes and click save when done.
          </CardDescription>
        </div>
        <Button onClick={removeLectureHandler} disabled={removeLoading} variant="destructive" className="flex items-center gap-2">
          {removeLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          {removeLoading ? "Removing..." : "Remove Lecture"}
        </Button>
      </CardHeader>

      <CardContent className="space-y-6">
        <div>
          <Label className="text-gray-700 dark:text-gray-300">Title</Label>
          <Input
            type="text"
            placeholder="Ex. Introduction to JavaScript"
            className="mt-1"
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
          />
        </div>

        <div>
          <Label className="text-gray-700 dark:text-gray-300">
            Video <span className="text-red-500">*</span>
          </Label>
          <Input
            type="file"
            accept="video/*"
            className="w-fit mt-1"
            onChange={fileChangeHandler}
          />
        </div>

        <div className="flex items-center gap-3">
          <Switch id="is-free-video" checked={isFree} onCheckedChange={setIsFree} />
          <Label htmlFor="is-free-video" className="text-gray-700 dark:text-gray-300">
            Is this video FREE
          </Label>
        </div>

        {mediaProgress && (
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Uploading... {uploadProgress}%</p>
          </div>
        )}

        <div className="pt-4">
          <Button onClick={editLectureHandler} disabled={isLoading} className="flex items-center gap-2">
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isLoading ? "Updating..." : "Update Lecture"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
