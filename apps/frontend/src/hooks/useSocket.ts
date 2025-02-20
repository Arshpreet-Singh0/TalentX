import { useEffect, useState } from "react";
import { WS_URL } from "../config";
import Cookies from "js-cookie";

export const useSocket = ()=>{
    const [ws, setWs] = useState<null | WebSocket >();
    const [loading, setLoading] = useState(true);

    const token = Cookies.get("token");

    useEffect(()=>{
        const socket = new WebSocket(`${WS_URL}?token=${token}`);
        setWs(socket);

        setLoading(false);
    },[]);

    return {
        ws,
        loading
    }
}