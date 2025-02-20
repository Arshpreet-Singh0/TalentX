import { Search } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";

interface User {
    id: number;
    name: string;
    username: string;
    avatar: string | null;
    skills: string[];
}

interface Project {
    id: number;
    githuburl: string | null;
    skills: string[];
    User: {
        id: number;
        name: string;
        username: string;
        avatar: string | null;
    };
    title: string;
    description: string;
    liveurl: string | null;
    likeCount: number;
    images: string[];
}

const Discover = () => {
    const [selected, setSelected] = useState<"users" | "projects">("users");
    const [users, setUsers] = useState<User[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSearchClick = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${BACKEND_URL}/search?query=${query}`);
            setUsers(res?.data?.users || []);
            setProjects(res?.data?.projects || []);
        } catch (error) {
            console.error("Error fetching search results:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="w-[65%] mx-auto bg-white p-8 shadow-lg rounded-md">
                <h1 className="text-3xl font-bold text-blue-600 mb-5">Search and Explore</h1>

                {/* Search Bar */}
                <div className="flex gap-4">
                    <input
                        className="border border-gray-300 w-full rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Search users or projects..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button
                        className="rounded bg-blue-600 text-white px-4 py-2 flex items-center justify-center hover:bg-blue-700 transition"
                        onClick={handleSearchClick}
                    >
                        <Search />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-10 mt-6 border-b">
                    <div
                        className={`cursor-pointer p-2 font-semibold ${
                            selected === "users" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"
                        }`}
                        onClick={() => setSelected("users")}
                    >
                        Users
                    </div>
                    <div
                        className={`cursor-pointer p-2 font-semibold ${
                            selected === "projects" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"
                        }`}
                        onClick={() => setSelected("projects")}
                    >
                        Projects
                    </div>
                </div>

                {/* Loading Indicator */}
                {loading && <p className="text-blue-500 mt-4">Loading...</p>}

                {/* Results Display */}
                <div className="mt-5">
                    {selected === "users" ? (
                        users.length > 0 ? (
                            users.map((user) => (
                                <div 
                                    key={user.id} 
                                    className="p-4 border-b flex items-center gap-4 cursor-pointer hover:bg-gray-100 rounded-md transition"
                                    onClick={() => navigate(`/profile/${user?.username}`)}
                                >
                                    <img
                                        src={user.avatar || "/default-avatar.png"}
                                        alt="User Avatar"
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    <div>
                                        <p className="font-semibold text-lg">{user.name}</p>
                                        <p className="text-gray-500">@{user.username}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-600 mt-3">No users found.</p>
                        )
                    ) : projects.length > 0 ? (
                        projects.map((project) => (
                            <div 
                                key={project.id} 
                                className="flex items-center gap-5 p-4 border-b cursor-pointer hover:bg-gray-100 rounded-md transition"
                                onClick={() => navigate(`/project/${project?.id}`)}
                            >
                                {/* Project Image */}
                                <div className="w-20 h-20 flex-shrink-0 border rounded-md overflow-hidden">
                                    <img 
                                        src={project?.images?.[0] || "/default-project.png"} 
                                        alt="Project" 
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Project Details */}
                                <div className="flex-1">
                                    <p className="font-semibold text-lg">{project.title}</p>
                                    <p className="text-gray-500">{project.description.substring(0, 50)}...</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-600 mt-3">No projects found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Discover;
