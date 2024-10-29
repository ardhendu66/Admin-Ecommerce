import { useState, useEffect } from "react"
import axios, { AxiosError } from "axios"
import Image from "next/image"
import Layout from "@/components/Layout"
import { toast } from "react-toastify"
import CreateForm from "@/components/UploadForm/CreateForm"
import UpdateForm from "@/components/UploadForm/UpdateForm"
import { IoIosArrowDropup } from "react-icons/io"
import { IoIosArrowDropdown } from "react-icons/io"
import { useRouter } from "next/router"

export default function Smartphones() {
    const [product, setProduct] = useState<Object>({})
    const [singleProduct, setSingleProduct] = useState<Object>({})
    const [brandName, setBrandName] = useState('')
    const [file, setFile] = useState<File | undefined>()
    const [previewUrl, setPreviewUrl] = useState<Set<string>>(new Set<string>())
    const [isUploading, setIsUploading] = useState<boolean>(false)
    const [isNewBrandCreation, setIsNewBrandCreation] = useState<boolean>(false)
    const [showBrandImages, setShowBrandImages] = useState({ index: -1, open: false })
    const router = useRouter();
    const { item } = router.query;

    useEffect(() => {
        if(item) {
            fetchAllBrands()
        }
    }, [item])

    const fetchAllBrands = () => {
        axios.get<Object>(`/api/upload/get?name=${item}`)
        .then(res => {
            setSingleProduct({})              
            setProduct(res.data)
        })
        .catch((err: AxiosError) => {
            console.error(err.response);
        })
    }

    const deleteImagesOnClick = async (image: string, index: number, brand: string) => {       
        try {
            const res = await axios.delete('/api/upload/delete', {
                data: {
                    name: item as string, brand, image, index
                }
            })
            if(res.status === 202) {
                toast.success(`${res.data.message} 😊`, {position: "top-center"})
                fetchAllBrands()
            }
            else toast(`${res.data.message} 😕`, {position: "top-center"})
        }
        catch(err: any) {
            toast.error(err.message, {position: "top-center"})
        }
    }

    const getProductsOnBrandFilter = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        axios.get(`/api/upload/get?name=${item}&brand=${brandName}`)
        .then(res => {
            setSingleProduct(res.data)
        })
        .catch(err => {
            console.error(err.message)
        })
    }

    return (
        <Layout>
        {   isNewBrandCreation 
        ?
        (
            <div>
                <h1 className="font-medium">New Brand Creation</h1>
                <input 
                    type="text" 
                    placeholder="enter brand-name"
                    onChange={(e) => setBrandName(e.target.value)}
                />
                <CreateForm 
                    name={item as string}
                    brandName={brandName} 
                    previewUrl={previewUrl} 
                    isUploading={isUploading}
                    file={file}
                    setFile={setFile}
                    setIsUploading={setIsUploading}
                    setPreviewUrl={setPreviewUrl}
                />
            </div>
        )
        :
        (
            <div>
                <button type="button"
                    className="bg-sky-700 py-3 mb-6 text-xl rounded-md min-w-full"
                    onClick={() => setIsNewBrandCreation(true)}
                > Create a new Brand </button>

                <select value={brandName} className="mb-6" 
                    onChange={e => setBrandName(e.target.value)}
                >
                    <option value="">Select Brand</option>
                    {
                        Object.entries(product).map(([key, value]) => (
                            <option value={key} key={key}> {key} </option>
                        ))
                    }
                </select>

                <button type="button" 
                    onClick={getProductsOnBrandFilter}
                    className="bg-sky-700 py-3 mb-6 text-xl rounded-md min-w-full"
                >Fetch brands</button>

                <UpdateForm 
                    name={item as string}
                    brandName={brandName} 
                    previewUrl={previewUrl} 
                    isUploading={isUploading}
                    file={file}
                    setFile={setFile}
                    setIsUploading={setIsUploading}
                    setPreviewUrl={setPreviewUrl}
                    fetchAllBrands={fetchAllBrands}
                />

                <div className="mb-5 border-b"></div>
                {
                    Object.keys(singleProduct).length > 0 
                        ?
                    Object.entries(singleProduct)?.map(([key, value], index) => (
                        <div key={index} 
                            className={`my-10 border-[1.4px] p-3 rounded ${value.length ? "border-gray-300" : "border-none"}`}
                        > 
                            {
                                value.length > 0 &&
                                <div className="text-xl font-bold mb-4">{key} Brand</div>
                            }
                            <div 
                                className="grid lg:grid-cols-4 md:grid-cols-3 xsm:grid-cols-2 max-xsm:grid-cols-1 gap-2 py-1"
                            >
                            {
                                value.map((img: string, ind: number) => (
                                    <div className="col-span-1" key={ind}>
                                        <div className="relative border border-gray-500 rounded-sm w-full h-60">
                                            <Image
                                                src={img}
                                                alt="error"
                                                fill
                                                objectFit="cover"
                                                className="w-full h-full rounded-sm"
                                            />
                                        </div>
                                        <div className="flex justify-between gap-1 mt-1 mb-2">
                                            <button 
                                                type="button"
                                                className="w-1/2 bg-red-600 text-white py-1"
                                                onClick={
                                                    () => deleteImagesOnClick(img, ind, key)
                                                }
                                            >Delete</button>
                                            <button 
                                                type="button"
                                                className="w-1/2 bg-gray-700 text-white py-1"
                                                onClick={() => {
                                                    window.navigator.clipboard.writeText(img)
                                                    toast.info("Copied to clipboard")
                                                }}
                                            > Copy-Link </button>
                                        </div>
                                    </div>
                                ))
                            }
                            </div>
                        </div>
                    ))
                        :
                    Object.entries(product).length > 0 
                        && 
                    Object.entries(product)?.map(([key, value], index) => (
                        <div key={index} 
                            className={`my-10 border-[1.4px] rounded p-3 ${value.length ? "border-gray-300" : "border-none"}`}
                        > 
                            {
                                value.length > 0 &&
                                <div 
                                    className="flex items-center justify-between text-xl font-bold"
                                    onClick={() => setShowBrandImages(prev => ({index, open: !prev.open}))}
                                >
                                    <div className="flex items-center justify-start gap-x-2">
                                        <div>{key}</div>
                                        <div>Brand</div>
                                    </div>
                                    <div className="bg-gray-400 h-[1px] w-full mx-4"></div>
                                    {showBrandImages.index === index && showBrandImages.open 
                                    ? <IoIosArrowDropup className="w-6 h-6" /> :
                                    <IoIosArrowDropdown className="w-6 h-6" />}
                                </div>
                            }
                            <div 
                                className={`grid lg:grid-cols-4 md:grid-cols-3 xsm:grid-cols-2 max-xsm:grid-cols-1 gap-2 py-1 ${showBrandImages.index === index && showBrandImages.open ? "mt-3" : "hidden"}`}
                            >
                            {
                                value.map((img: string, ind: number) => (
                                    <div className="col-span-1" key={ind}>
                                        <div className="relative border border-gray-500 rounded-sm w-full h-60">
                                            <Image
                                                src={img}
                                                alt="error"
                                                fill
                                                objectFit="cover"
                                                className="w-full h-full rounded-sm"
                                            />
                                        </div>
                                        <div className="flex justify-between gap-1 mt-1 mb-2">
                                            <button 
                                                type="button"
                                                className="w-1/2 bg-red-600 text-white py-1"
                                                onClick={
                                                    () => deleteImagesOnClick(img, ind, key)
                                                }
                                            >Delete</button>
                                            <button 
                                                type="button"
                                                className="w-1/2 bg-gray-700 text-white py-1"
                                                onClick={() => {
                                                    window.navigator.clipboard.writeText(img)
                                                    toast.info("Copied to clipboard")
                                                }}
                                            > Copy-Link </button>
                                        </div>
                                    </div>
                                ))
                            }
                            </div>
                        </div>
                    ))
                }
            </div>
        )}
        </Layout>
    )
}