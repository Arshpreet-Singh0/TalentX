import { useEffect, useState } from "react";
import { Github, Globe, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../config";
import Sidebar from "../components/Sidebar";
import { useAppSelector } from "../hooks/hook";

interface User {
  username: string;
  name: string;
  avatar: string;
}

interface Comment {
    projectid: number;
    id: number;
    comment: string;
    userid: number;
    User : {
      id : number,
      username : string
    }
  }
interface Project {
  User: User;
  images: string[];
  title: string;
  description: string;
  liveurl: string;
  githuburl: string;
  skills: string[];
  comment: Comment[];
}

const ProjectDetail = () => {
  const [project, setProject] = useState<Project>();
  const [currentImage, setCurrentImage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const navigate = useNavigate();

  const {user} = useAppSelector(store=>store.auth);

  const { id } = useParams();

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${BACKEND_URL}/api/v1/project/${id}`);

        setProject(res?.data?.project);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  const handleDeleteComment = async (commentId: number) => {
    try {
      await axios.delete(`${BACKEND_URL}/api/v1/comment/${commentId}`, {
        withCredentials : true,
      });
      const comment = project?.comment?.filter((comment : Comment) => comment.id !== commentId);
      //@ts-ignore
      setProject({...project, comment : comment });
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const nextImage = () => {
    if (!project) return;
    setCurrentImage((prev) => (prev + 1) % project?.images?.length);
  };

  const prevImage = () => {
    if (!project) return;
    setCurrentImage(
      (prev) => (prev - 1 + project?.images?.length) % project?.images?.length
    );
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const res = await axios.post(`${BACKEND_URL}/api/v1/comment`, {
        projectid: id,
        comment: newComment,
      },{withCredentials : true});
      if (res?.data?.success) {
        //@ts-ignore
        const comment = [...project?.comment, res?.data?.comment]
        //@ts-ignore
        setProject({...project, comment : comment})
        setNewComment("");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!project) {
    return <div>no project found.</div>;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="w-[60%] mx-auto py-8 px-4 overflow-y-auto">
        <div className="flex justify-between items-center">
          <div className="flex items-center mb-8">
            <img
              src={"https://avatar.iran.liara.run/public/35"}
              alt={"https://avatar.iran.liara.run/public/35"}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="ml-4">
              <h2 className="text-xl font-bold">{project?.User?.name}</h2>
              <p className="text-gray-600">@{project?.User?.username}</p>
            </div>
          </div>

          <div>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-gray-900 transition-colors"
              onClick={() => navigate(`/profile/${project?.User?.username}`)}
            >
              View Profile
            </button>
          </div>
        </div>

        {/* Image Carousel */}
        <div className="relative mb-8 rounded-lg overflow-hidden">
          <div className="aspect-w-16 aspect-h-9 relative">
            <img
              src={project.images[currentImage]}
              alt={`Project screenshot ${currentImage + 1}`}
              className="w-full h-[400px] object-cover"
            />
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition-colors"
            >
              <ChevronRight size={24} />
            </button>
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {project?.images?.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`w-2 h-2 rounded-full ${
                  currentImage === index ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Project Info */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">{project?.title}</h1>
          <p className="text-gray-600 mb-6">{project?.description}</p>

          <div className="py-2 pb-8">
            {project?.skills?.map((skill) => (
              <span className="py-1 px-4 rounded-full bg-blue-600 mr-2 text-white">
                {skill}
              </span>
            ))}
          </div>
          <div className="flex gap-4">
            <a
              href={project?.liveurl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Globe size={20} />
              Live Demo
            </a>
            <a
              href={project?.githuburl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
            >
              <Github size={20} />
              View Code
            </a>
          </div>
        </div>

        {/* Comments Section */}
        <div>
          <h3 className="text-2xl font-bold mb-6">Feedback & Comments</h3>
          
          <div className="flex-1 overflow-y-auto mt-4 space-y-3">
            {project?.comment?.length > 0 ? (
              project?.comment.map((comment) => (
                <div key={comment.id} className="flex justify-between items-center p-2 bg-gray-100 rounded-lg">
                  
                  <div className="flex gap-5">
                      <div className="w-12 h-12 rounded-full">
                        <img src="https://avatar.iran.liara.run/public/35" alt="" />
                      </div>
                      <div>
                        <p className="font-semibold">@{comment?.User?.username}</p>
                      <p className="text-gray-800">{comment?.comment}</p>
                      </div>
                    </div>

                  {Number(user?.id) === comment.userid && (
                    <div className="flex space-x-2">
                      {/* <button onClick={() => handleEditComment(comment)} className="text-blue-500">Edit</button> */}
                      <button onClick={() => handleDeleteComment(comment.id)} className="text-red-500"><Trash2 /></button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500">No comments yet. Be the first to comment!</p>
            )}
          </div>

          <div className="mt-4 flex items-center space-x-3 border-t pt-3">
            <input
              type="text"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 bg-gray-50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button onClick={handleAddComment} className="text-blue-600 font-medium">Post</button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
