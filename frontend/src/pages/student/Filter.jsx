/* eslint-disable react/prop-types */
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import React, { useState, useCallback } from "react";

const CATEGORIES = [
  { id: "nextjs", label: "Next.js" },
  { id: "data science", label: "Data Science" },
  { id: "frontend development", label: "Frontend Development" },
  { id: "fullstack development", label: "Fullstack Development" },
  { id: "mern stack development", label: "MERN Stack Development" },
  { id: "backend development", label: "Backend Development" },
  { id: "javascript", label: "JavaScript" },
  { id: "python", label: "Python" },
  { id: "docker", label: "Docker" },
  { id: "mongodb", label: "MongoDB" },
  { id: "html", label: "HTML" },
];

const Filter = ({ handleFilterChange }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortByPrice, setSortByPrice] = useState("");

  const handleCategoryChange = useCallback(
    (categoryId) => {
      const updated = selectedCategories.includes(categoryId)
        ? selectedCategories.filter((id) => id !== categoryId)
        : [...selectedCategories, categoryId];
      setSelectedCategories(updated);
      handleFilterChange(updated, sortByPrice);
    },
    [selectedCategories, sortByPrice, handleFilterChange]
  );

  const selectByPriceHandler = useCallback(
    (value) => {
      setSortByPrice(value);
      handleFilterChange(selectedCategories, value);
    },
    [selectedCategories, handleFilterChange]
  );

  return (
    <aside className="w-full md:w-[22%] p-4 bg-gray-50 dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3">Filter Options</h2>

        <div className="space-y-1">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by Price</Label>
          <Select value={sortByPrice} onValueChange={selectByPriceHandler}>
            <SelectTrigger className="mt-1 w-full">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Sort</SelectLabel>
                <SelectItem value="low">Low to High</SelectItem>
                <SelectItem value="high">High to Low</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Category</h3>
        <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-2">
          {CATEGORIES.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={category.id}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={() => handleCategoryChange(category.id)}
              />
              <Label
                htmlFor={category.id}
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {category.label}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default React.memo(Filter);
