import React, { useState } from "react";
import {User, Upload } from "lucide-react";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";

interface OnboardingData {
  name: string;
  role: string;
  linkedinUrl: string;
  githubUrl: string;
  portfolio: string;
  skills: string;
}

export default function OnboardingForm() {
  const [formData, setFormData] = useState<OnboardingData>({
    name: "",
    role: "",
    linkedinUrl: "",
    githubUrl: "",
    portfolio: "",
    skills: "",
  });

  const [error, setError] = useState("");
  // const [skillsInput, setSkillsInput] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();

  const handleFileUpload = (e : any) => {
    const uploadedFiles = Array.from(e.target.files);
    //@ts-ignore
    setImagePreview(URL.createObjectURL(uploadedFiles?.[0]));

    //@ts-ignore
    setFiles((prevFiles) => [...prevFiles, ...uploadedFiles]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     setProfileImage(file);
  //     setImagePreview(URL.createObjectURL(file));
  //   }
  // };

  // const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setSkillsInput(e.target.value);
  //   setFormData((prev) => ({ ...prev, skills: e.target.value }));
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = new FormData();
  
      data.append('name', formData.name);
      data.append('linkedinurl', formData.linkedinUrl);
      data.append('githuburl', formData.githubUrl);
      data.append('portfolio', formData.portfolio);
      data.append('skills', formData.skills);
  
      files.forEach((file) => {
        console.log(file);
        
        data.append('images', file)
      });

      const res = await axios.patch(`${BACKEND_URL}/api/v1/update-profile`, data, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(res);
      
  
      if (res?.data?.success) {
        navigate("/"); // Redirect on success
      }
    } catch (error) {
      setError(
        axios.isAxiosError(error) ? error?.response?.data?.message : "Internal server error."
      );
      console.log(error);
      
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 w-full">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {error && <h2 className="text-md text-red-600">{error}</h2>}
        <div className="px-8 pt-8">
          <div className="flex items-center justify-center mb-6">
            <User className="w-6 h-6 text-blue-600" />
            <h2 className="ml-2 text-2xl font-bold text-gray-900">Profile Information</h2>
          </div>
        </div>

        <div className="px-8 pt-8">
          <div className="flex flex-col items-center justify-center mb-6">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Profile Preview"
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
              />
            ) : (
              <User className="w-24 h-24 text-gray-400" />
            )}
            <label className="mt-2 text-sm text-blue-600 cursor-pointer flex items-center">
              <Upload className="w-5 h-5 mr-2" /> Upload Profile Picture
              <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
            </label>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-8 pb-8">
          <div className="space-y-4">
            {Object.keys(formData).map((key) => (
              <div key={key} className="mb-6">
                <label htmlFor={key} className="block text-sm font-medium text-gray-700 mb-1">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </label>
                <input
                  type="text"
                  id={key}
                  name={key}
                  value={(formData as any)[key]}
                  onChange={handleChange}
                  className="w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={`Enter your ${key}`}
                />
              </div>
            ))}

            <div className="mt-8">
              <button
                type="submit"
                className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Complete Profile
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}