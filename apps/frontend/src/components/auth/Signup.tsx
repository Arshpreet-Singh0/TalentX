import axios from "axios";
import { useState } from "react";
import { BACKEND_URL } from "../../config";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

const Signup = () => {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    username : ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e : React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e : React.FormEvent<HTMLFormElement>) => {
    setError("");
    e.preventDefault();
    try {
        const res = await axios.post(`${BACKEND_URL}/api/v1/signup`, formData );
        console.log(error);
        
        if(res?.data?.success){
            message.success(res?.data?.message);
            navigate('/signin')
        }
    } catch (error) {
        if(axios.isAxiosError(error)){
            
            setError(error?.response?.data?.message);
            console.log(error); 
        }
        else{
            console.log(error);
            setError("Internal server error.")
        }
    }
  };

  return (
    <div className="bg-gray-50 text-black min-h-screen flex items-center justify-center relative">
      <div className=" w-full h-full pointer-events-none absolute"></div>
      <div className="w-[400px] z-10">
        <div className="bg-white p-6 rounded-2xl shadow-2xl border border-white/10 h-full flex flex-col justify-center items-center">
          <div className="text-center mb-6">
            {
                error && <h2 className="text-md text-red-600">{error}</h2> 
            }
            <h1 className="text-3xl text-black font-bold">
              <span>Welcome To</span>
              <span className="text-[#6ba9cc] text-5xl italic"> TalentX</span>
            </h1>
            <p className="mt-2">Sign up to explore the world of opportunities!</p>
          </div>

          <form className="space-y-6 w-full" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-white border border-gray-300 rounded-lg py-3 px-4 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#8A2BE2] focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-white border border-gray-300 rounded-lg py-3 px-4 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#8A2BE2] focus:border-transparent"
                placeholder="Enter unique username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">User Name</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full bg-white border border-gray-300 rounded-lg py-3 px-4 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#8A2BE2] focus:border-transparent"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-white border border-gray-300 rounded-lg py-3 px-4 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#8A2BE2] focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#8A2BE2] hover:bg-[#7a23c9] text-white font-medium py-3 rounded-lg transition"
            >
              <span className="text-gray-200 text-2xl font-bold">Sign up</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
