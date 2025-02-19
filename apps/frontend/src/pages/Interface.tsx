import { useEffect, useState } from "react";
import ProjectCard from "../components/ProjectCard";
import { BACKEND_URL } from "../config";
import axios from "axios";
import { useAppSelector } from "../hooks/hook";
import Sidebar from "../components/Sidebar";

interface User {
  id: number;
  name: string;
  linkedinurl: string;
  email: string;
  username: string;
}

interface Project {
  id: number;
  title: string;
  description: string;
  skills: string[];
  githuburl?: string;
  liveurl?: string;
  likeCount: number;
  images: string[];
  userid: number;
  User: User;
}

function Interface() {
  const { user } = useAppSelector((store) => store.auth);

  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const getProjects = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/v1/project`);

        setProjects(res?.data?.projects);
      } catch (error) {
        console.log(error);
      }
    };
    getProjects();
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex h-screen bg-gray-50 w-full">
        {/* Main Content */}
        <main className="overflow-y-auto w-[80%]">
          <div className=" mx-auto py-8 px-4">
            {/* Project Feed */}
            <div className="space-y-6">
              {projects?.length > 0 ? (
                projects?.map((project) => (
                  <ProjectCard
                    username={project?.User?.name}
                    projectTitle={project.title}
                    image={project?.images?.[0]}
                    description={project.title}
                    likes={567}
                    // comments={89}
                    projectId={project.id}
                  />
                ))
              ) : (
                <h1>No Project Found.</h1>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Interface;
