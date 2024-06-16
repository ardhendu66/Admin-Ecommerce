import axios from "axios"
import { toast } from 'react-toastify'
import { Product } from "@/config/config"
import Image from "next/image"

interface Props {
    product: Product,
    id: string | string[] | undefined,
    fetchProduct: () => Promise<void>
}

export default function ViewProductImages({product, id, fetchProduct}: Props) {
    const deleteImagesOnClick = async (index: number) => {      
        try {
            const res = await axios.delete(`/api/delete/image?id=${id}`, {
                data: { ind: index },
            })
            if(res.status === 202) {
                toast(`${res.data.message} 😊`)
            }
            else {
                toast(`${res.data.message} 😕`)
            }
            fetchProduct()
        }
        catch(err: any) {
            toast.error('server error')
        }
    } 
    
    return (
        <>
            <h2 className="text-2xl font-medium text-sky-800 mt-6">
                All Photos of this Product
            </h2>
            <div className="grid lg:grid-cols-4 md:grid-cols-3 xsm:grid-cols-2 max-xsm:grid-cols-1 gap-2 pb-4 border-b my-5">
            {
                product?.images.map((image, index) => {
                    return (
                        <div key={index} className="col-span-1 mr-5 pb-2">
                            <div className="relative w-full h-60 m-auto border border-black mb-2 rounded-sm">
                                <Image 
                                    src={image}
                                    alt="error"
                                    fill
                                    objectFit="cover"
                                    className="w-full h-full rounded-sm"
                                />
                            </div>
                            <button 
                                type="button" 
                                className="w-full bg-red-600 text-white py-1"
                                onClick={() => deleteImagesOnClick(index)}
                            >Delete</button>
                        </div>
                    )
                })
            }
            </div>
        </>
    )
}