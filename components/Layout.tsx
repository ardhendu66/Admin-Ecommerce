import { ReactNode, useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import Sidebar from "./Sidebar";

interface ReactNodeArray extends Array<ReactNode> { }
interface ChildProps {
  children: ReactNode | ReactNodeArray | boolean | null | undefined;
};

export default function Layout({ children }: ChildProps) {
  const [showSideBar, setShowSideBar] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router, router.pathname]);

  useEffect(() => {
    setShowSideBar(
      window.localStorage.getItem("openSideBar") === "1" ? true : false
    );
  }, []);

  useEffect(() => {
    window.localStorage.setItem("openSideBar", showSideBar ? "1" : "0");
  }, [showSideBar]);

  if (status === "authenticated") {
    if (session.user.emailVerified) {
      if (session.user.verifiedAsAdmin) {
        return (
          <div className="flex h-screen max-md:flex-col bg-bgGray">
            <Sidebar showSideBar={showSideBar} />
            <div
              className={`sticky ${!showSideBar && "rounded-lg pt-5 ml-2"} text-black bg-white flex-grow my-2 mr-2 rounded-lg p-4 overflow-y-scroll hide-scrollbar`}
            >
              {children}
            </div>
          </div>
        );
      } else if (!session.user.verifiedAsAdmin) {
        setTimeout(() => {
          signOut({ callbackUrl: "/" });
        }, 20000);

        const requestForAsAdmin = async () => { };

        return (
          <div className="flex items-center justify-center bg-bgGray w-screen min-h-screen">
            <div className="flex flex-col justify-between bg-sky-400 md:w-[60%] max-md:w-full h-60 p-6 rounded-sm shadow-2xl">
              <div className="bg-gray-200 flex flex-col items-center text-blue-900 text-lg font-semibold py-3 px-5 rounded-md">
                <div>
                  You should be an Admin to access this protected page. Click{" "}
                  <b>Be an Admin</b> button for sending request to the website
                  owner to be verified as an Admin within <b>20 seconds</b>.
                </div>
              </div>
              <div className="flex justify-around">
                <button
                  className="flex justify-center items-center bg-gray-600 text-white py-3 px-4 rounded-md text-2xl font-semibold font-Nunito shadow-md text-wrap"
                  onClick={() => requestForAsAdmin()}
                >
                  Be an Admin
                </button>
              </div>
            </div>
          </div>
        );
      }
    } else {
      return (
        <div className="flex items-center justify-center bg-bgGray w-screen min-h-screen">
          <div className="flex flex-col justify-between bg-sky-600 lg:w-[40%] md:w-[60%] max-md:w-full h-60 p-6 rounded-sm shadow-2xl">
            <div className="bg-gray-200 flex flex-col items-center text-blue-900 text-lg font-semibold py-3 px-5 rounded-md">
              <div className="">
                Check your email. First verify your account. Now do logout.
              </div>
            </div>
            <div className="flex justify-center">
              <button
                className="flex justify-center items-center w-1/3 bg-gray-200 text-black py-3 px-4 rounded-md text-2xl font-medium font-Nunito shadow-md"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      );
    }
  }

  return null;
}