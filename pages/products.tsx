import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import axios from "axios"
import { ClipLoader } from "react-spinners"
import { withSwal } from "react-sweetalert2"
import { toast } from "react-toastify"
import Layout from "@/components/Layout"
import { Product } from "@/config/ProductTypes"
import { loaderColor } from "@/config/config"

const ProductComponent = ({swal}: any) => {
    const [products, setProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const fetchProducts = async () => {
        try {
            setIsLoading(true)
            const res = await axios.get<Product[]>('/api/products/get-products')
            const data = res?.data
            setProducts(data)
        }
        catch(err: any) {
            console.log(err);
        }
        finally {
            setTimeout(() => {
                setIsLoading(false)
            }, 1500)
        }
    }

    const deleteSingleProduct = (product: Product) => {
        swal.fire({
            title: 'Are you sure ?',
            text: `Do you want to delete ${product.name} ?`,
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Yes, Delete',
            confirmButtonColor: "#f51616",
            reverseButtons: true,
        })
        .then((res: any) => {
            if(res.isConfirmed) {
                axios.delete(`/api/products/delete-product?id=${product._id}`)
                .then(res => {
                    swal.fire(`Deleted ${product.name}! 😒`, '', 'success')
                })
                .catch(err => toast.error(err.message, { position: "top-center" }))
                .finally(() => {
                    fetchProducts().then(() => {});
                })
            }
        })
        .catch((err: any) => {
            swal.fire('Deletion failed! 🥲', '', 'error')
            console.log(err.message)
        })
    }

    useEffect(() => {
        fetchProducts().then(() => {})
    }, [])

    return (
        <Layout>
            <h1 className="text-5xl font-bold underline">Products</h1>
            <div 
                className="w-full bg-blue-800 rounded-md text-white p-3 text-2xl tracking-wider font-medium text-center shadow-md hover:bg-blue-600"
            >
                <Link href={'/products/create'}> Create New Product </Link>
            </div>
            <table className="w-full mt-6 shadow-xl">
                <thead className="w-full">
                    <tr className="w-full">
                        <td className="w-2/3 bg-sky-600 text-white p-2 text-2xl text-center font-bold"> 
                            Product Name
                        </td>
                        <td className="w-1/3 bg-sky-600 text-white p-2  text-2xl text-center font-bold">
                            Action
                        </td>
                    </tr>
                </thead>
                <tbody className="w-full bg-gray-200">
                {
                    isLoading
                        ?
                    <tr>
                        <td className="text-center p-3">
                            <ClipLoader 
                                color={loaderColor}
                                size={60}
                                speedMultiplier={2}
                                loading={true}
                            />
                        </td>
                        <td className="text-center p-3">
                            <ClipLoader 
                                color={loaderColor}
                                size={60}
                                speedMultiplier={2}
                                loading={true}
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
                                <button 
                                    type="button" 
                                    className="w-1/3 max-lg:w-1/2 max-md:w-full bg-blue-800 text-white text-lg px-1 py-2 rounded-md tracking-widest"
                                >
                                    <Link href={`/products/update/${item?._id}`}> 
                                        Edit
                                    </Link>
                                </button>
                                <button 
                                    type="button" 
                                    className="w-1/3 max-lg:w-1/2 max-md:w-full bg-red-700 text-white text-lg px-1 py-2 rounded-md tracking-wide"
                                    onClick={() => deleteSingleProduct(item)}
                                >
                                    Delete
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

const ProductPage = withSwal(({swal}: any, ref: any) => (
    <ProductComponent swal={swal} />
))

export default ProductPage;