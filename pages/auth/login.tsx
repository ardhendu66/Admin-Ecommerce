import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "react-toastify";

export default function SignInPage() {
    const [email, setEmail] = useState<string | null>(null);
    const [password, setPassword] = useState<string | null>(null);
    const [proceedToSignIn, setProceedToSignIn] = useState<boolean>(false);
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if(status === "authenticated") {
            router.push("/")
        }
    }, [status, router, router.pathname])

    useEffect(() => {
        if(email && password) {
            setProceedToSignIn(true);
        }
    }, [email, password])

    const signInWithCredentials = async (event: any) => {
        event.preventDefault();
        if(!email && !password && email === "" && password === "") {
            return;
        }
        try {
            const res = await signIn('credentials', {
                email, password,
                // redirect: false,
                callbackUrl: '/dashboard',
            })
            if(res?.ok) {
                toast.success("Logged in successfully")
                router.push('/dashboard')
            }
            else {
                toast.error("Authentication Error 😥")
                console.error("Authentication error: ", res?.error)
            }
            console.log("response: ", res)        
        }
        catch(err: any) {
            toast.error("Sign-in Error: ", err.message)
            console.error("signIn Error: ", err)            
        }
    }

    return (
        <div className="bg-bgGray flex items-center justify-center w-[100vw] min-h-screen">
            <form 
                className="bg-white flex flex-col lg:w-[40%] md:w-2/3 max-md:w-full p-6 shadow-2xl rounded-md border-sky-400 border-t-4"
                onSubmit={e => signInWithCredentials(e)}
            >
                <h2 className="text-center -mt-2 mb-6 text-4xl font-semibold tracking-tight">
                    Sign-in via email
                </h2>
                <label className="flex flex-col mb-3">
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
                <label className="flex flex-col mb-5">
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
                    className={`${!proceedToSignIn ? "cursor-not-allowed" : "cursor-pointer"} bg-sky-600 text-white p-3 rounded-md font-semibold text-lg shadow-md`}
                    disabled={!proceedToSignIn}
                > 
                    Sign in 
                </button>
                <div className="flex justify-end mt-3 mb-1 w-[96%]">
                    <span className="mr-2">Don't have an account?</span>
                    <Link href={'/auth/register'} className="underline">
                        Sign-up
                    </Link>
                </div>
            </form>
        </div>
    )
}