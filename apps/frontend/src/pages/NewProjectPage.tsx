import React, { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Loader from "../components/Loader";
import { useAppSelector } from "../hooks/hook";
import { isUserLoggedIn } from "../redux/authSlice";

interface ProjectFormData {
  title: string;
  description: string;
  skills: string[];
  githubUrl: string;
  liveUrl: string;
}

const initialFormData: ProjectFormData = {
  title: "",
  description: "",
  skills: [],
  githubUrl: "",
  liveUrl: "",
};

function ProjectForm() {
  const [formData, setFormData] = useState<ProjectFormData>(initialFormData);
  const [skillsInput, setSkillsInput] = useState<string>("");
  const [errors, setErrors] = useState<Partial<ProjectFormData>>({});
  const [error, setError] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const isUserExist = useAppSelector(isUserLoggedIn);
  const navigate = useNavigate();

  useEffect(()=>{
      if(!isUserExist){
        navigate('/signin');
      }
  },[]);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "skills") {
      setSkillsInput(value);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Convert skills input into an array
  const handleSkillsBlur = () => {
    setFormData((prev) => ({
      ...prev,
      skills: skillsInput
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
    }));
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const uploadedFiles = Array.from(e.target.files);
      setFiles((prevFiles) => [...prevFiles, ...uploadedFiles]);
    }
  };

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: Partial<ProjectFormData> = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    //@ts-ignore
    if (formData.skills.length === 0) newErrors.skills = "At least one skill is required";
    if (!formData.githubUrl.trim()) newErrors.githubUrl = "GitHub URL is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    handleSkillsBlur();
    setLoading(true);
    if (validateForm()) {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("githuburl", formData.githubUrl);
      data.append("liveurl", formData.liveUrl);
      formData.skills.forEach((skill) => data.append("skills", skill));

      files.forEach((file) => {
        data.append("images", file);
      });
      
      try {
        const res = await axios.post(`${BACKEND_URL}/api/v1/project`, data, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (res?.data?.success) {
          message.success(res?.data?.message);
          navigate("/");
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(error?.response?.data?.message || "Upload failed.");
        } else {
          setError("Internal server error.");
        }
        console.log(error);
        
      }finally{
        setLoading(false);
      }
    }
  };

  if(loading){
    return <Loader />
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <form
      onSubmit={handleSubmit}
      className="w-[60%] mx-auto p-6 bg-white rounded-lg shadow-lg"
    >
      {error && <h2 className="text-md text-red-600 text-center">{error}</h2>}
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Upload New Project
      </h2>

      <div className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Project Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.title ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter project title"
          />
          {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.description ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Describe your project"
          />
          {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
        </div>

        {/* Skills */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Skills (comma-separated) *
          </label>
          <input
            type="text"
            name="skills"
            value={skillsInput}
            onChange={handleChange}
            onBlur={handleSkillsBlur}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.skills ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="React, TypeScript, Node.js"
          />
          {errors.skills && <p className="mt-1 text-sm text-red-500">{errors.skills}</p>}
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload Images (multiple allowed)
          </label>
          <input type="file" accept="image/*" onChange={handleFileUpload} multiple />
        </div>

        {/* Display selected images */}
        {files.length > 0 && (
          <div className="flex gap-2 mt-2">
            {files.map((file, index) => (
              <img
                key={index}
                src={URL.createObjectURL(file)}
                alt="Selected"
                className="w-20 h-20 object-cover rounded-md"
              />
            ))}
          </div>
        )}

        {/* GitHub URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            GitHub URL *
          </label>
          <input
            type="text"
            name="githubUrl"
            value={formData.githubUrl}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md border-gray-300"
            placeholder="https://github.com/yourproject"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Live url
          </label>
          <input
            type="text"
            name="liveUrl"
            value={formData.liveUrl}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md border-gray-300"
            placeholder="https://github.com/yourproject"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Submit Project
        </button>
      </div>
    </form>
    </div>
  );
}

export default ProjectForm;
