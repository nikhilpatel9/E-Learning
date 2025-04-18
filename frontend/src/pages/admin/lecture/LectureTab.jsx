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
import { Trash2, Save } from "lucide-react";

export default function LectureTab() {
  return (
    <Card className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-700">
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <CardTitle className="text-xl text-gray-900 dark:text-white">Edit Lecture</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Make changes and click save when done.
          </CardDescription>
        </div>
        <Button variant="destructive" className="flex items-center gap-2">
          <Trash2 className="w-4 h-4" />
          Remove Lecture
        </Button>
      </CardHeader>

      <CardContent className="space-y-6">
        <div>
          <Label className="text-gray-700 dark:text-gray-300">Title</Label>
          <Input
            type="text"
            placeholder="Ex. Introduction to JavaScript"
            className="mt-1"
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
          />
        </div>

        <div className="flex items-center gap-3">
          <Switch id="is-free-video"  className="data-[state=checked]:bg-green-500"/>
          <Label htmlFor="is-free-video" className="text-gray-700 dark:text-gray-300">
            Is this video FREE
          </Label>
        </div>

        <div className="pt-4">
          <Button className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            Update Lecture
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
