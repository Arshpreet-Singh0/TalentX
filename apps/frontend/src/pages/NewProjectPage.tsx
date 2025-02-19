import React, { useState } from "react";
import { Send } from "lucide-react";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

interface ProjectFormData {
  title: string;
  description: string;
  skills: string[];
  images: string[];
  githubUrl: string;
  liveUrl: string;
}

const initialFormData: ProjectFormData = {
  title: "",
  description: "",
  skills: [],
  images: [],
  githubUrl: "",
  liveUrl: "",
};

function ProjectForm() {
  const [formData, setFormData] = useState<ProjectFormData>(initialFormData);
  const [skillsInput, setSkillsInput] = useState<string>("");
  const [imagesInput, setImagesInput] = useState<string>("");
  const [errors, setErrors] = useState<Partial<ProjectFormData>>({});
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "skills") {
      setSkillsInput(value);
    } else if (name === "images") {
      setImagesInput(value);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Convert comma-separated input to an array on blur
  const handleSkillsBlur = () => {
    setFormData((prev) => ({
      ...prev,
      skills: skillsInput
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
    }));
  };

  const handleImagesBlur = () => {
    setFormData((prev) => ({
      ...prev,
      images: imagesInput
        .split(",")
        .map((image) => image.trim())
        .filter(Boolean),
    }));
  };

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: Partial<ProjectFormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (formData.skills.length === 0) {
      //@ts-ignore
      newErrors.skills = "At least one skill is required";
    }
    if (!formData.githubUrl.trim()) {
      newErrors.githubUrl = "GitHub URL is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    handleSkillsBlur();
    handleImagesBlur();

    if (validateForm()) {
      try {
        const res = await axios.post(
          `${BACKEND_URL}/api/v1/project`,
          formData,
          {
            withCredentials: true,
          }
        );
        console.log(res);

        if (res?.data?.success) {
          message.success(res?.data?.message);
          navigate("/");
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(error?.response?.data?.message);
          console.log(error);
        } else {
          console.log(error);
          setError("Internal server error.");
        }
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg"
    >
      {error && <h2 className="text-md text-red-600 text-center">{error}</h2>}
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Upload New Project
      </h2>

      <div className="space-y-4">
        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Project Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.title ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Enter project title"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-500">{errors.title}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.description ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Describe your project"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-500">{errors.description}</p>
          )}
        </div>

        {/* Skills */}
        <div>
          <label
            htmlFor="skills"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Skills (comma-separated) *
          </label>
          <input
            type="text"
            id="skills"
            name="skills"
            value={skillsInput}
            onChange={handleChange}
            onBlur={handleSkillsBlur}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.skills ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="React, TypeScript, Node.js"
          />
          {errors.skills && (
            <p className="mt-1 text-sm text-red-500">{errors.skills}</p>
          )}
        </div>

        {/* Images */}
        <div>
          <label
            htmlFor="images"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Images (comma-separated URLs)
          </label>
          <input
            type="text"
            id="images"
            name="images"
            value={imagesInput}
            onChange={handleChange}
            onBlur={handleImagesBlur}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://image1.com, https://image2.com"
          />
        </div>

        {/* GitHub URL */}
        <div>
          <label
            htmlFor="githubUrl"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            GitHub URL *
          </label>
          <input
            type="text"
            id="githubUrl"
            name="githubUrl"
            value={formData.githubUrl}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.githubUrl ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="https://github.com/your-repo"
          />
          {errors.githubUrl && (
            <p className="mt-1 text-sm text-red-500">{errors.githubUrl}</p>
          )}
        </div>

        {/* Live URL */}
        <div>
          <label
            htmlFor="liveUrl"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Live Project URL
          </label>
          <input
            type="text"
            id="liveUrl"
            name="liveUrl"
            value={formData.liveUrl}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://your-live-project.com"
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center gap-2 transition-colors"
      >
        <Send size={20} />
        Upload Project
      </button>
    </form>
  );
}

const NewProjectPage = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="min-h-screen bg-gray-100 py-12 w-full">
        <ProjectForm />
      </div>
    </div>
  );
};

export default NewProjectPage;
