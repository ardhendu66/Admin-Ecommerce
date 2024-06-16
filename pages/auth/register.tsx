import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import axios from "axios";

const msg = "User registered successfully";
interface ResMsg {
    message: string,
}

export default function RegisterPage() {
    const [name, setName] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [password, setPassword] = useState<string | null>(null);
    const [proceedToRegister, setProceedToRegister] = useState<boolean>(false);
    const [showResponseMessage, setshowResponseMessage] = useState<ResMsg>({message: ""});
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if(name && username && email && password) {
            setProceedToRegister(true);
        }
    }, [name, username, email, password])

    const registerWithCredentials = async (event: any) => {
        event.preventDefault();
        if(!email && !password && !username && !name && email === "" && password === "" &&      username === "" && name === "") {
            return;
        }
        try {
            const res = await axios.post('/api/auth/admin/register', {
                name, username, email, password
            });
            if(res.status === 201) {
                setshowResponseMessage({message: res.data.message});
                if(res.data.message === msg) {
                    toast.success(`${msg} 😊`, {position: "top-center"});
                }
            }
            else {
                setshowResponseMessage({message: res.data.message})
            }
        }
        catch(err: any) {
            console.error("SignUp Error: ", err)            
        }
    }

    return (
        <div className="bg-bgGray flex flex-col items-center justify-center w-[100vw] min-h-screen">
            <div className={`w-1/2 mt-2 text-wrap ${showResponseMessage.message === "" && "hidden"} bg-slate-500 py-3 px-[2px] rounded-md text-white font-medium font-Nunito mb-3 text-center`}
            >
                {showResponseMessage?.message}
            </div>
            <form 
                className="bg-white flex flex-col lg:w-[40%] md:w-2/3 max-md:w-full p-6 shadow-2xl rounded-md border-sky-400 border-t-4"
                onSubmit={e => registerWithCredentials(e)}
            >
                <h2 className="text-center -mt-2 mb-6 text-4xl font-semibold tracking-tight">
                    Sign-up via your email
                </h2>
                <label className="flex flex-col mb-1">
                    Full Name
                    <input 
                        type="text" 
                        id="name"
                        name="name"
                        placeholder="Enter your name" 
                        onChange={e => setName(e.target.value)}
                        className="mt-1 p-2 border-[1.5px] border-gray-300 rounded-sm outline-none font-semibold placeholder:font-normal"
                    />
                </label>
                <label className="flex flex-col mb-1">
                    Username
                    <input 
                        type="text" 
                        id="username"
                        name="username"
                        placeholder="Enter your username" 
                        onChange={e => setUsername(e.target.value)}
                        className="mt-1 p-2 border-[1.5px] border-gray-300 rounded-sm outline-none font-semibold placeholder:font-normal"
                    />
                </label>
                <label className="flex flex-col mb-1">
                    Email
                    <input 
                        type="email" 
                        id="email"
                        name="email"
                        placeholder="Enter your email" 
                        onChange={e => setEmail(e.target.value)}
                        className="mt-1 p-2 border-[1.5px] border-gray-300 rounded-sm outline-none font-semibold placeholder:font-normal"
                    />
                </label>
                <label className="flex flex-col mb-3">
                    Password
                    <input 
                        type="password" 
                        id="password"
                        name="password"
                        placeholder="Enter password" 
                        onChange={e => setPassword(e.target.value)}
                        className="mt-1 p-2 border-[1.5px] border-gray-300 rounded-sm outline-none font-semibold placeholder:font-normal"
                    />
                </label>
                <button 
                    type="submit"
                    className={`${!proceedToRegister ? "cursor-not-allowed" : "cursor-pointer"} bg-sky-600 text-white p-3 rounded-md font-semibold text-lg shadow-md`}
                    disabled={!proceedToRegister}
                > 
                    Sign up
                </button>
                <div className="flex justify-end mt-3 mb-1 w-[96%]">
                    <span className="mr-2">Already have an account?</span>
                    <Link href={'/auth/login'} className="underline">
                        Sign-in
                    </Link>
                </div>
            </form>
        </div>
    )
}