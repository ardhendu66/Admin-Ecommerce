import Layout from "@/components/Layout"
import Link from "next/link"

export default function Upload() {
    return (
        <Layout>
            <div className="grid grid-cols-5 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 gap-x-5 gap-y-3 p-8">
                <Link 
                    href="/upload/smartphones"  
                    className="col-span-1 flex items-center flex-col justify-around border min-h-32 bg-sky-600 text-white text-5xl font-medium rounded-md shadow-lg"
                >
                    <div className="text-xl font-medium">Mobiles</div>
                </Link>
                <Link 
                    href="/upload/smartphones"  
                    className="col-span-1 flex items-center flex-col justify-around border min-h-32 bg-sky-600 text-white text-5xl font-medium rounded-md shadow-lg"
                >
                    <div className="text-xl font-medium">Laptops</div>
                </Link>
            </div>
        </Layout>
    )
}