import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

export default function SignInPage() {
    const [email, setEmail] = useState<string | null>(null);
    const [password, setPassword] = useState<string | null>(null);
    const [proceedToSignIn, setProceedToSignIn] = useState<boolean>(false);
    const [isSigningIn, setIsSigningIn] = useState<boolean>(false);
    const [loginErrorMessage, setLoginErrorMessage] = useState<string | null>(null);
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if(status === "authenticated") {
            router.push("/dashboard")
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
            setIsSigningIn(true);
            const res = await signIn('credentials', {
                email, password,
                // redirect: false,
                callbackUrl: '/dashboard',
            })
            if(res?.ok) {
                toast.success("Logged in successfully", { position: "top-center" })
                router.push('/dashboard')
            }
            else if(res?.error) {
                setLoginErrorMessage("Wrong email or password 🤔")
                toast.error("Wrong email or password 🤔", { position: "top-center" })
                console.log("Authentication error: ", res?.error)
                router.push("/auth/login?error=login_error")
            }    
        }
        catch(err: any) {
            toast.error("Wrong email or password 🤔", { position: "top-center" })
            console.error("signIn Error: ", err)            
        }
        finally {
            setIsSigningIn(false);
        }
    }

    return (
        <div className="bg-bgGray flex flex-col items-center justify-center w-[100vw] min-h-screen">
            <div 
                className={`${!loginErrorMessage && "hidden"} bg-gray-500 text-white py-2 px-4 rounded-md`}
            >
                {loginErrorMessage}
            </div>
            <form 
                className="bg-white flex flex-col lg:w-[40%] md:w-2/3 max-md:w-full p-6 shadow-2xl rounded-md border-sky-400 border-t-4 mt-4"
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
                {
                    isSigningIn
                        ?
                    <div className="flex items-center justify-center">
                        Signing you in
                        <ClipLoader 
                            size={30}
                            color="white"
                            className="ml-2"
                        />
                    </div>
                        :
                    "Sign in"
                } 
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