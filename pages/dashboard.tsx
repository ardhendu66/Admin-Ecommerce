import Layout from "@/components/Layout"
import { useSession } from "next-auth/react"
import Link from "next/link"
import Image from "next/image"
import { ClipLoader } from "react-spinners"

export default function Dashboard() {
    const {data: session, status} = useSession()
    const sourceOfImage: string = session?.user?.image!

    if(status === "loading") {
      return (
        <div className="flex items-center justify-center bg-bgGray w-screen min-h-screen">
          <ClipLoader 
            size={150}
            color="#0369A1"
            loading={true}
            // speedMultiplier={2} 
          />
        </div>
      )
    }

    return (
        <Layout>
          <div className="text-blue-900 flex justify-between m-3">
            <h2>
              Hello, {session?.user?.name}
            </h2>
            <div className="bg-gray-300 gap-1 text-black flex justify-between rounded-xl overflow-hidden pr-2">
              <span className="w-8 h-8">
                {/* <Image 
                  src={sourceOfImage}
                  alt="error"
                  fill
                  objectFit="cover"
                  className="w-8 h-8 rounded-sm"
                /> */}
              </span>
              <span className="flex items-center justify-center">
                {session?.user?.name}
              </span>
            </div>
          </div>
        </Layout>
      )
}