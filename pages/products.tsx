"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import axios from "axios"
import { ClipLoader } from "react-spinners"
import Layout from "@/components/Layout"
import { Product } from "@/config/config"
import { toast } from "react-toastify"

function Products() {
    const [products, setProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)

    useEffect(() => {
        getProducts().then(r => r)
    }, [])   
    
    async function getProducts() {
        try {
            setIsLoading(true)
            const res = await axios.get<Product[]>('/api/products/get-products')
            const data = res?.data
            setProducts(data) 
        }
        catch(err: any) {
            console.error(err);
        }
        finally {
            setIsLoading(false)
        }
    }

    return (
        <Layout>
            <div className="w-full bg-blue-800 rounded-md text-white p-3 text-2xl tracking-wider font-medium text-center shadow-md hover:bg-blue-600">
                <Link href={'/products/create'}> Create New Product </Link>
            </div>
            <table className="w-full mt-6 shadow-xl">
                <thead className="w-full">
                    <tr className="w-full">
                        <td className="w-2/3 bg-sky-600 text-white p-2 text-2xl text-center font-bold"> 
                            Product Name
                        </td>
                        <td className="w-1/3 bg-sky-600 text-white p-2  text-2xl text-center font-bold">Action</td>
                    </tr>
                </thead>
                <tbody className="w-full bg-gray-200">
                {
                    isLoading
                    ?
                    <tr>
                        <td className="rounded-sm pl-3">
                            <ClipLoader 
                                color="#1b6ea5"
                                size={30}
                            />
                        </td>
                        <td className="p-3 border-none">
                            <ClipLoader 
                                color="#1b6ea5"
                                size={30}
                            />
                        </td>
                    </tr>
                    :
                    products?.map((item, index) => (
                        <tr key={index} className="text-xl font-semibold">
                            <td className="rounded-sm pl-3">
                                {item?.name}
                            </td>
                            <td 
                                className="flex justify-around max-md:flex-col max-lg:gap-2 p-3 border-none"
                            >
                                <button type="button" className="w-1/3 max-lg:w-1/2 max-md:w-full bg-blue-800 text-white text-lg px-1 py-2 rounded-md tracking-widest">
                                    <Link href={`/products/update/${item?._id}`}> 
                                        Edit
                                    </Link>
                                </button>
                                <button type="button" className="w-1/3 max-lg:w-1/2 max-md:w-full bg-red-700 text-white text-lg px-1 py-2 rounded-md tracking-wide">
                                    <Link href={`/products/delete/${item._id}`}>
                                        Delete
                                    </Link>
                                </button>
                            </td>
                        </tr>
                    ))
                }
                </tbody>
            </table>
        </Layout>
    )
}

export default Products;