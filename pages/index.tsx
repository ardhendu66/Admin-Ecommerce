import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from "next/router"
import Link from "next/link"
import { FcGoogle } from "react-icons/fc"
import { FcUnlock } from "react-icons/fc";
import { useEffect, CSSProperties } from "react"
import { ClipLoader } from "react-spinners";

export default function Index() {
  const {data: session, status} = useSession()
  const router = useRouter();

  useEffect(() => {
    if(status === "authenticated" && session) {
      router.push("/dashboard")
    }
  }, [session, router.pathname])

  if(!session) {
    return (
      <div className="flex items-center justify-center bg-bgGray w-screen min-h-screen">
        <div 
          className="floating flex flex-col justify-evenly bg-sky-600 lg:w-[46%] md:w-2/3 max-md:w-full h-72 px-14 pt-5 pb-2 rounded-md shadow-2xl max-md:-ml-4 max-md:-mr-4"
        >
          <button
            className="flex justify-center items-center bg-gray-200 text-black p-4 rounded-lg text-2xl font-medium font-Nunito"
            onClick={() => signIn('google')}
          >
            <FcGoogle className="w-8 h-8 -ml-4 mr-4" />
            Google-Login
          </button>
          <div className="text-center text-2xl font-mono underline font-semibold">or</div>
          <Link href={'/auth/login'}
            className="flex justify-center items-center bg-gray-200 text-black p-4 rounded-lg text-center text-2xl font-medium font-Nunito"
          >
            <FcUnlock className="w-8 h-8 -ml-4 mr-4" />
            Email-Login
          </Link>
          <div className="flex justify-end text-white text-lg mr-3 mt-1 -mb-2">
            <span className="mr-2">Don't have an account?</span>
            <Link href={'/auth/register'} className="underline font-semibold">Sign-up</Link>
          </div>
        </div>
      </div>
    )
  }

  if(session && !session.user.verifiedAsAdmin) {
    return (
      <div className="flex items-center justify-center bg-bgGray w-screen min-h-screen">
        <div className="flex flex-col justify-between bg-sky-600 w-[40%] h-60 p-6 rounded-sm shadow-2xl">
          <div className="bg-gray-200 flex flex-col items-center text-blue-900 text-lg font-semibold py-3 px-5 rounded-md">
            <div className="">
              You should be an Admin to access this protected page. Contact Website Owner to be verified as an Admin.
            </div>
          </div>
          <div className="flex justify-center">
            <button
              className="flex justify-center items-center w-1/3 bg-gray-200 text-black py-3 px-4 rounded-md text-2xl font-medium font-Nunito shadow-md"
              onClick={() => signOut({callbackUrl: '/'})}
            >
              Log out
            </button>
          </div>
        </div>
      </div>
    )
  }

  if(session && session.user.verifiedAsAdmin) {
    return (
      <div className="flex items-center justify-center bg-bgGray w-screen min-h-screen">
        <ClipLoader 
          size={150}
          color="#0369A1"
          loading={true}
        />
      </div>
    )
  }

  return null;
}