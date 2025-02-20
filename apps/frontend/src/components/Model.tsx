import axios from "axios";
import { useState } from "react";
import { BACKEND_URL } from "../config";
import { message } from "antd";

const Modal = ({
  isOpen,
  onClose,
  id
}: {
  isOpen: boolean;
  onClose: () => void;
  id : number;
}) => {

    const [msg, setMsg] = useState("");

  const handleClickSendMessage = async()=>{
    try {
        const res = await axios.post(`${BACKEND_URL}/send-message/${id}`, {message : msg}, {
            withCredentials : true
        });

        if(res?.data?.success){
            onClose();
            message.success(res?.data?.message);
        }
    } catch (error) {
        console.log(error);
        
        if(axios.isAxiosError(error)){
            message.error(error?.response?.data?.messgae || "unexpcted error occured");
        }
        
    }
  }
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 flex justify-center h-80 mt-24">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold">Enter your message here : </h2>
        {/* <p>This modal was opened from another component.</p> */}

        <div className="py-4">
          <label htmlFor="msg">Message</label> <br />
          <textarea
            className="border w-full rounded-lg p-2 mt-2"
            rows={4}
            placeholder="Enter your message "
            value={msg}
            onChange={(e)=>setMsg(e.target.value)}
          ></textarea>
          <div className="flex gap-10 justify-end">
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
            >
              Close
            </button>
            <button
              onClick={handleClickSendMessage}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
