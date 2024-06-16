import { ReactNode, useEffect, useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/router"
import Link from "next/link"
import { GiHamburgerMenu } from "react-icons/gi"
import { MdCancel } from "react-icons/md"
import { RiAdminFill } from "react-icons/ri"
import Sidebar from "./Sidebar"

interface ReactNodeArray extends Array<ReactNode> {}
type ChildProps = { children: ReactNode | ReactNodeArray | boolean | null | undefined }

export default function Layout({children}: ChildProps) {
  const [showSideBar, setShowSideBar] = useState(true)
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if(status === "unauthenticated") {
      router.push("/")
    }
  }, [status, router, router.pathname])

  useEffect(() => {
    setShowSideBar(window.localStorage.getItem("openSideBar") === "1" ? true : false)
  }, [])

  useEffect(() => {
    window.localStorage.setItem("openSideBar", showSideBar ? "1" : "0")
  }, [showSideBar])

  if(status === 'authenticated') {
    if(session.user.emailVerified) {
      if(session.user.verifiedAsAdmin) {
        return (
          <div className="bg-bgGray flex min-h-screen max-md:flex-col">
            <Sidebar showSideBar={showSideBar} setShowSideBar={setShowSideBar} />
            <div 
              className={`${!showSideBar && "bg-white w-full"} bg-bgGray text-black fixed cursor-pointer rounded-full`}
              onClick={() => setShowSideBar(!showSideBar)}
            >
            {
              showSideBar 
                ? 
              <MdCancel className="w-10 h-10 rounded-full" />  
                : 
              (
                <div className="flex w-full bg-bgGray pb-1">
                  <GiHamburgerMenu className="w-10 h-10 mr-4" />
                  <div className="w-full flex justify-center">
                    <Link href={'/'} className="flex gap-1 text-sky-700 font-medium">
                      <RiAdminFill className="w-10 h-10 text-sky-700"/>
                      <span className="text-3xl font-semibold mt-1 underline"> 
                        AdminDashboard
                      </span>
                    </Link>
                  </div>
                </div>
              )
            }
            </div>
            <div 
              className={`${!showSideBar && "rounded-lg pt-20 ml-2"} text-black bg-white flex-grow my-2 mr-2 rounded-lg p-4`}
            >
              {children}
            </div>
          </div>
        )
      }
      else if(!session.user.verifiedAsAdmin) {
        return (
          <div className="flex items-center justify-center bg-bgGray w-screen min-h-screen">
            <div className="flex flex-col justify-between bg-sky-600 lg:w-[40%] md:w-[60%] max-md:w-full h-60 p-6 rounded-sm shadow-2xl">
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
    }
    else {
      return (
        <div className="flex items-center justify-center bg-bgGray w-screen min-h-screen">
          <div className="flex flex-col justify-between bg-sky-600 lg:w-[40%] md:w-[60%] max-md:w-full h-60 p-6 rounded-sm shadow-2xl">
            <div className="bg-gray-200 flex flex-col items-center text-blue-900 text-lg font-semibold py-3 px-5 rounded-md">
              <div className="">
                Check your email. Do verify your account first. Now do logout.
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
  }

  return null;
}