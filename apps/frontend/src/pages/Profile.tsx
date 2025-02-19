import { Github, Linkedin, Code2 } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BACKEND_URL } from '../config';
import axios from 'axios';

interface User {
    name : string;
    username : string;
    skills : string[],
    linkedinurl : string;
    githuburl : string;
    avatar : string;
    Project : Project[];   
}

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

function Profile() {
  // This would typically come from an API or database
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);

  const {username} = useParams();

  useEffect(()=>{
    const fetchUserProfile = async()=>{
        try {
            const res =  await axios.get(`${BACKEND_URL}/api/v1/${username}`);

            setUser(res?.data?.user);

        } catch (error) {
            console.log(error);
            
        }finally{
            setLoading(false);
        }
    };

    fetchUserProfile();
  },[username]);

  console.log(user);

  if(loading){
    return (
        <div>Loading...</div>
    );
  }

  if(!user){
    return (
        <div>User not found.</div>
    )
  }
  

  return (
    <div className="flex h-screen bg-gray-50">
        <Sidebar />
    <div className="min-h-screen bg-gray-50 w-full">
      {/* Header Section */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-8">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-xl text-gray-600">@{user.username}</p>
              <div className="mt-4 flex space-x-4">
                <a
                  href={user.githuburl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-600 hover:text-gray-900"
                >
                  <Github className="w-5 h-5 mr-2" />
                  GitHub
                </a>
                <a
                  href={user.linkedinurl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-600 hover:text-gray-900"
                >
                  <Linkedin className="w-5 h-5 mr-2" />
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Skills Section */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {user.skills.map((skill) => (
            <span
              key={skill}
              className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Projects Section */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {user?.Project?.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src={project.images?.[0]}
                alt={project.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {project.title}
                </h3>
                <p className="text-gray-600 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project?.skills.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium flex items-center"
                    >
                      <Code2 className="w-4 h-4 mr-1" />
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
}

export default Profile;