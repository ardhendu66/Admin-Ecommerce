import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import Image from "next/image"
import axios from "axios"
import Layout from "@/components/Layout"
import { Product } from "@/config/config"
import { constructDescriptionArray } from "@/components/functions"
import { PiCurrencyInrBold } from "react-icons/pi"
import { withSwal } from 'react-sweetalert2'
import { toast } from "react-toastify"

const defaultProductAttributes: Product = {
    _id: '',
    name: '',
    description: '',
    images: [],
    price: Number(),
    amount: Number(),
    __v: 0,
    category: {
        _id: '',
        name: '',
        parent: {
            _id: '',
            name: '',
            __v: 0
        },
        __v: 0,
        properties: [{
            name: "",
            values: [""]
        }]
    },
    categoryProperties: {}
}

function DeleteSingleProduct({swal}: any) {
    const [productAttribute, setProductAttribute] = useState<Product>(defaultProductAttributes)
    const router = useRouter()
    const { id } = router.query
    
    useEffect(() => {
        if(!id) return

        async function fetchProduct() {
            const res = await axios.get<Product>(`/api/products/get-product?id=${id}`)
            const data = res?.data
            setProductAttribute(data)     
        }
        fetchProduct()
    }, [id]) 
  
    const deleteSingleProduct = (product: Product) => {
        swal.fire({
            title: 'Are you sure ?',
            text: `Do you want to delete ${product.name}`,
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Yes, Delete',
            confirmButtonColor: "#f51616",
            reverseButtons: true,
        })
        .then((res: any) => {
            if(res.isConfirmed) {
                axios.delete(`/api/products/delete-product?id=${id}`)
                .then(res => {
                    swal.fire(`Deleted ${product.name}! 😒`, '', 'success')
                })
                .catch(err => toast.error(err.message))
                .finally(() => {
                    setTimeout(() => {
                        console.log("setTimeout success render....")                        
                        router.push('/products')
                    }, 3000)
                })
            }
            else {
                swal.fire('Deletion failed! 🥲', '', 'info')
                setTimeout(() => {
                    console.log("setTimeout cancelled render....")                    
                    router.push('/products')
                }, 3000)
            }
        })
        .catch((err: any) => {
            console.error(err.message)
        })
    }
    
    return (
        <Layout>
            <div className="mb-12 text-center border-2 border-sky-800 p-8 flex justify-between">
                <div className="text-3xl font-semibold w-[70%]">Do you really want to delete 
                    <span className="font-bold ml-4">{productAttribute?.name}</span>
                </div>
                <div className="w-[30%] mr-8">
                    <button className="mt-2 ml-4 px-3 py-2 bg-red-700 w-full text-white" 
                        onClick={() => deleteSingleProduct(productAttribute)}
                    >Delete</button>
                </div>
            </div>

            <div className="flex justify-evenly pb-4 border-b">
                <div className="w-[80%]">
                    <div className="relative w-full h-[500px] p-10 rounded-md mb-10 border-black">
                        <Image
                            src={productAttribute?.images[0]}
                            alt="error"
                            fill
                            objectFit="cover"
                            className="w-full h-full rounded-md"
                        />
                    </div>
                    <div className="text-center text-4xl font-medium">
                        {productAttribute.name}
                    </div>
                </div>
                <div>
                    <h1 className="text-black text-3xl font-bold mt-6 mb-4">
                        {productAttribute.name}
                    </h1>
                    <div className="text-3xl font-medium mb-10 p-3 w-44">
                        <div className="text-green-700 text-lg">
                            Price
                        </div>
                        <div className="flex justify-start">
                            <PiCurrencyInrBold className="w-7 h-7 mt-1.5" /> 
                            {productAttribute?.price}
                        </div>
                    </div>
                    {constructDescriptionArray(productAttribute?.description)?.map((desc, index) => {
                        return (
                            <div key={index} 
                                className="bg-slate-200 text-sky-700 font-medium px-3 py-1 my-2 rounded-sm"
                            >
                                {desc}
                            </div>
                        )
                    })}
                </div>
            </div>
        </Layout>
    )
}

export default withSwal(({swal}: any, ref: any) => (
    <DeleteSingleProduct swal={swal} />
))