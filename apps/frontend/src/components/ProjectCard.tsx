import { Heart, MessageCircle, Send, BookmarkPlus } from 'lucide-react';

interface ProjectCardProps {
  username: string;
  projectTitle: string;
  image: string;
  description: string;
  likes: number;
  comments: number;
}

const ProjectCard = ({
  username,
  projectTitle,
  image,
  description,
  likes,
  comments,
}: ProjectCardProps) => {
  return (
    <article className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
          <div>
            <h3 className="font-medium">{username}</h3>
            <p className="text-sm text-gray-500">Student Developer</p>
          </div>
        </div>
        <button className="text-blue-600 font-medium">Follow</button>
      </div>
      
      {/* Project Image */}
      <div className="relative aspect-video">
        <img
          src={image}
          alt={projectTitle}
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <button className="hover:text-red-500 transition-colors">
              <Heart className="w-6 h-6" />
            </button>
            <button className="hover:text-blue-500 transition-colors">
              <MessageCircle className="w-6 h-6" />
            </button>
            <button className="hover:text-blue-500 transition-colors">
              <Send className="w-6 h-6" />
            </button>
          </div>
          <button className="hover:text-blue-500 transition-colors">
            <BookmarkPlus className="w-6 h-6" />
          </button>
        </div>
        
        {/* Project Info */}
        <div>
          <h2 className="text-lg font-semibold mb-2">{projectTitle}</h2>
          <p className="text-gray-600 mb-2">{description}</p>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>{likes} likes</span>
            <span>{comments} comments</span>
          </div>
        </div>
        
        {/* Add Comment */}
        <div className="mt-4 flex items-center space-x-3">
          <input
            type="text"
            placeholder="Add a comment..."
            className="flex-1 bg-gray-50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="text-blue-600 font-medium">Post</button>
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;