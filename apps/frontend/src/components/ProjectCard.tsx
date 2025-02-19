import { useEffect, useState } from "react";
import { Heart, MessageCircle, X, Trash2 } from "lucide-react";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useAppSelector } from "../hooks/hook";

interface ProjectCardProps {
  username: string;
  projectTitle: string;
  image: string;
  description: string;
  likes: number;
  projectId: number;
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

const ProjectCard = ({
  username,
  projectTitle,
  image,
  description,
  likes,
  projectId,
}: ProjectCardProps) => {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");

  const { user } = useAppSelector((store) => store.auth); // Getting the logged-in user

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(
          `${BACKEND_URL}/api/v1/comment/${projectId}`
        );
        if (res?.data?.success) {
          setComments(res?.data?.comments);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    if (isCommentsOpen) {
      fetchComments();
    }
  }, [isCommentsOpen]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const res = await axios.post(`${BACKEND_URL}/api/v1/comment`, {
        projectid: projectId,
        comment: newComment,
      },{withCredentials : true});
      if (res?.data?.success) {
        setComments([...comments, res?.data?.comment]);
        setNewComment("");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  // const handleEditComment = (comment: Comment) => {
  //   setEditingCommentId(comment.id);
  //   setEditingText(comment.comment);
  // };

  const handleUpdateComment = async () => {
    if (!editingText.trim() || editingCommentId === null) return;

    try {
      const res = await axios.put(
        `${BACKEND_URL}/api/v1/comment/${editingCommentId}`,
        { comment: editingText }
      );
      if (res?.data?.success) {
        setComments(
          comments.map((comment) =>
            comment.id === editingCommentId
              ? { ...comment, comment: editingText }
              : comment
          )
        );
        setEditingCommentId(null);
        setEditingText("");
      }
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await axios.delete(`${BACKEND_URL}/api/v1/comment/${commentId}`, {
        withCredentials : true,
      });
      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <article className="bg-white rounded-xl shadow-sm overflow-hidden relative">
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

      <div className="relative aspect-video">
        <img src={image} alt={projectTitle} className="w-full h-full object-cover" />
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <button className="hover:text-red-500 transition-colors">
              <Heart className="w-6 h-6" />
            </button>
            <button
              className="hover:text-blue-500 transition-colors"
              onClick={() => setIsCommentsOpen(!isCommentsOpen)}
            >
              <MessageCircle className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">{projectTitle}</h2>
          <p className="text-gray-600 mb-2">{description}</p>
          <span className="text-sm text-gray-500">{likes} likes</span>
        </div>
      </div>

      {isCommentsOpen && (
        <div className="absolute top-0 left-0 w-full h-full bg-white shadow-lg p-6 flex flex-col">
          <div className="flex justify-between items-center border-b pb-3">
            <h3 className="text-lg font-semibold">Comments</h3>
            <button
              onClick={() => setIsCommentsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto mt-4 space-y-3">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="flex justify-between items-center p-2 bg-gray-100 rounded-lg">
                  {editingCommentId === comment.id ? (
                    <div className="flex items-center space-x-2">
                      <input
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        className="border rounded px-2 py-1"
                      />
                      <button onClick={handleUpdateComment} className="text-green-500">Save</button>
                    </div>
                  ) : (
                    <div className="flex gap-5">
                      <div className="w-12 h-12 rounded-full">
                        <img src="https://avatar.iran.liara.run/public/35" alt="" />
                      </div>
                      <div>
                        <p className="font-semibold">@{comment.User.username}</p>
                      <p className="text-gray-800">{comment.comment}</p>
                      </div>
                    </div>
                  )}

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
      )}
    </article>
  );
};

export default ProjectCard;
