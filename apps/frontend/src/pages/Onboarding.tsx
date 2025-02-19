import React, { useState } from "react";
import { Github, Linkedin, Globe, User } from "lucide-react";
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
  const [skillsInput, setSkillsInput] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSkillsInput(value);
    setFormData((prev) => ({
      ...prev,
      skills: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.patch(
        `${BACKEND_URL}/api/v1/update-profile`,
        formData,
        {
          withCredentials: true,
        }
      );

      if (res?.data?.success) {
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
  };

  const renderField = (fieldName: keyof Omit<OnboardingData, 'skills'>) => {
    const labels = {
      name: "Full Name",
      role: "Professional Role",
      linkedinUrl: "LinkedIn Profile URL",
      githubUrl: "GitHub Profile URL",
      portfolio: "Portfolio Website",
    };

    const placeholders = {
      name: "John Doe",
      role: "Senior Software Engineer",
      linkedinUrl: "https://linkedin.com/in/username",
      githubUrl: "https://github.com/username",
      portfolio: "https://portfolio.com",
    };

    const icons = {
      name: <User className="w-5 h-5 text-gray-400" />,
      role: <User className="w-5 h-5 text-gray-400" />,
      linkedinUrl: <Linkedin className="w-5 h-5 text-gray-400" />,
      githubUrl: <Github className="w-5 h-5 text-gray-400" />,
      portfolio: <Globe className="w-5 h-5 text-gray-400" />,
    };

    return (
      <div key={fieldName} className="mb-6">
        <label
          htmlFor={fieldName}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {labels[fieldName]}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icons[fieldName]}
          </div>
          <input
            type="text"
            id={fieldName}
            name={fieldName}
            value={formData[fieldName]}
            onChange={handleChange}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder={placeholders[fieldName]}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 w-full">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {error && <h2 className="text-md text-red-600">{error}</h2>}
        <div className="px-8 pt-8">
          <div className="flex items-center justify-center mb-6">
            <User className="w-6 h-6 text-blue-600" />
            <h2 className="ml-2 text-2xl font-bold text-gray-900">
              Profile Information
            </h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-8 pb-8">
          <div className="space-y-2">
            {renderField("name")}
            {renderField("role")}
            {renderField("linkedinUrl")}
            {renderField("githubUrl")}
            {renderField("portfolio")}

            <div className="mb-6">
              <label
                htmlFor="skills"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Skills (comma separated)
              </label>
              <input
                type="text"
                id="skills"
                name="skills"
                value={skillsInput}
                onChange={handleSkillsChange}
                className="w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. React, Node.js, MongoDB"
              />
            </div>
          </div>

          <div className="mt-8">
            <button
              type="submit"
              className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Complete Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
