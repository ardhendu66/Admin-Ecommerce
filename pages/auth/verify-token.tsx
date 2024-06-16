'use client'
import axios from "axios"
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";
import { FaCheckCircle } from "react-icons/fa";
import { FaInfoCircle } from "react-icons/fa";

export default function VerifyToken() {
    const [respMsg, setRespMsg] = useState<string | null>(null);
    const [statusCode, setStatusCode] = useState<boolean>(false);
    const router = useRouter();
    const { email, token } = router.query;

    const handleOnVerifyAccount = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if(token === undefined && token === null && token === "") {
            return null;
        }

        try {
            const res = await axios.post("/api/auth/admin/verify-token", {email, token})
            if(res.status === 200 && res.data.success) {
                toast.success(res.data.message, {position: "top-center"});
                setRespMsg(res.data.message);
                setStatusCode(true);
            }
            else {
                setRespMsg(res.data.message);
            }
        }
        catch(err: any) {
            console.error(err)            
            throw new Error(err.message);
        }
    }

    return (
        <div className="flex items-center justify-center w-screen h-screen bg-sky-100">
            <div 
                className="flex items-center justify-center bg-sky-600 text-white lg:w-1/2 md:w-[75%] max-md:w-full h-[40%] shadow-lg shadow-black border-green-500 border-t-8 rounded-lg"
            >
                {
                    respMsg
                        ?
                    (
                        <div 
                            className="flex justify-center bg-white text-black px-5 py-4 text-2xl font-semibold rounded-md shadow-md"
                        >
                            {   statusCode === true ?
                                <FaCheckCircle className="w-[26.5px] h-[26.5px] text-green-600 mr-2 mt-[2px]" /> : <FaInfoCircle className="w-[26.5px] h-[26.5px] text-slate-600 mr-4 mt-[2px]" />
                            }
                            {respMsg}
                        </div>
                    )
                        :
                    (
                        <button
                            className="bg-white text-black px-5 py-3 text-2xl font-semibold rounded-md shadow-md shadow-yellow-100 border-black border-[1.5px]"
                            onClick={handleOnVerifyAccount}
                        >
                            Verify your Account
                        </button>
                    )
                }
            </div>
        </div>
    )
}