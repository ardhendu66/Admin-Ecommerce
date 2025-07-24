import Layout from "@/components/Layout"
import Link from "next/link"

export default function Upload() {
    return (
        <Layout>
            <div className="grid grid-cols-3 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 gap-x-5 gap-y-3 p-8">
                <Link 
                    href="/upload/allcategories?item=smartphones"  
                    className="col-span-1 flex items-center flex-col justify-around border min-h-32 bg-sky-600 text-white text-5xl font-medium rounded-md shadow-lg"
                >
                    <div className="text-xl font-medium">Mobiles</div>
                </Link>
                <Link 
                    href="/upload/allcategories?item=laptops"  
                    className="col-span-1 flex items-center flex-col justify-around border min-h-32 bg-sky-600 text-white text-5xl font-medium rounded-md shadow-lg"
                >
                    <div className="text-xl font-medium">Laptops</div>
                </Link>
                <Link 
                    href="/upload/allcategories?item=headphones"  
                    className="col-span-1 flex items-center flex-col justify-around border min-h-32 bg-sky-600 text-white text-5xl font-medium rounded-md shadow-lg"
                >
                    <div className="text-xl font-medium">Headphones</div>
                </Link>
                <Link 
                    href="/upload/allcategories?item=watches"  
                    className="col-span-1 flex items-center flex-col justify-around border min-h-32 bg-sky-600 text-white text-5xl font-medium rounded-md shadow-lg"
                >
                    <div className="text-xl font-medium">Watches</div>
                </Link>
                <Link 
                    href="/upload/allcategories?item=cloths"  
                    className="col-span-1 flex items-center flex-col justify-around border min-h-32 bg-sky-600 text-white text-5xl font-medium rounded-md shadow-lg"
                >
                    <div className="text-xl font-medium">Clothes</div>
                </Link>
                <Link 
                    href="/upload/allcategories?item=shoe"  
                    className="col-span-1 flex items-center flex-col justify-around border min-h-32 bg-sky-600 text-white text-5xl font-medium rounded-md shadow-lg"
                >
                    <div className="text-xl font-medium">Shoes</div>
                </Link>
                <Link 
                    href="/upload/allcategories?item=mouse"  
                    className="col-span-1 flex items-center flex-col justify-around border min-h-32 bg-sky-600 text-white text-5xl font-medium rounded-md shadow-lg"
                >
                    <div className="text-xl font-medium">Mouse</div>
                </Link>
                <Link 
                    href="/upload/allcategories?item=keyboard"  
                    className="col-span-1 flex items-center flex-col justify-around border min-h-32 bg-sky-600 text-white text-5xl font-medium rounded-md shadow-lg"
                >
                    <div className="text-xl font-medium">Keyboard</div>
                </Link>
                <Link 
                    href="/upload/allcategories?item=processor"  
                    className="col-span-1 flex items-center flex-col justify-around border min-h-32 bg-sky-600 text-white text-5xl font-medium rounded-md shadow-lg"
                >
                    <div className="text-xl font-medium">Processor</div>
                </Link>
                <Link 
                    href="/upload/allcategories?item=refrigerator"  
                    className="col-span-1 flex items-center flex-col justify-around border min-h-32 bg-sky-600 text-white text-5xl font-medium rounded-md shadow-lg"
                >
                    <div className="text-xl font-medium">Refrigerator</div>
                </Link>
            </div>
        </Layout>
    )
}