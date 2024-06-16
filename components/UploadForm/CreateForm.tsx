import axios from "axios"
import { useRouter } from "next/router"
import Image from "next/image"
import { CircleLoader, ClipLoader } from "react-spinners"
import { toast } from "react-toastify"
import { SetStateAction } from "react"
import { envVariables } from "@/config/config"

interface Props {
    brandName: string,
    previewUrl: Set<string>,
    isUploading: boolean,
    file: File | undefined,
    setFile: (v: SetStateAction<File | undefined>) => void,
    setIsUploading: (v: SetStateAction<boolean>) => void,
    setPreviewUrl: (v: SetStateAction<Set<string>>) => void,
}

export default function CreateForm({ 
    brandName, previewUrl, isUploading, file, setFile, setIsUploading, setPreviewUrl}: Props) 
{
    const router = useRouter()

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files === null) return
        setFile(e.target.files[0])
        setPreviewUrl(prev => {
            if(e.target.files) {
                prev.add(URL.createObjectURL(e.target.files[0]))
            }
            return prev
        })
    } 

    const UploadImageForFreshBrand = (e: React.MouseEvent<HTMLFormElement>) => {
        e.preventDefault() 
        if(typeof file !== 'undefined') {
            setIsUploading(true)
            const formData = new FormData()
            formData.append('file', file)
            formData.append('upload_preset', envVariables.cloudinaryUploadPreset)
            formData.append('upload_cloud', envVariables.cloudinaryUploadCloud)
            formData.append('api_key', envVariables.cloudinaryApiKey)   

            axios.post('https://api.cloudinary.com/v1_1/next-ecom-cloud/image/upload', formData)
            .then(res => {
                setIsUploading(false)
                axios.post('/api/upload/create', {
                    name: "smartphones", brand: brandName, image: res.data.url
                })
                .then(res => {
                    res.status === 200 || res.status === 201 
                        ?
                    toast.success(res.data.message)
                        :
                    toast.info(res.data.message)
                    router.reload()                
                })
                .catch(err => {
                    toast.error(err.message)
                })
            })
            .catch(err => toast.error('Image not uploaded!'))
        }
    }

    return (
        <form onSubmit={(e: React.MouseEvent<HTMLFormElement>) => UploadImageForFreshBrand(e)}>
            <label>Photos</label>
            <div className="mb-3 mt-2 flex flex-col">
                <div className="flex justify-between w-full">
                    <input 
                        type="file" 
                        className="border-none bg-white w-full -ml-2"
                        onChange={
                            (event: React.ChangeEvent<HTMLInputElement>) => handleOnChange(event)
                        }
                    />
                    <div className="w-full flex px-2"> { 
                        Array.from(previewUrl).map((value, index) => (
                            <div key={index} className="mx-2">
                            {
                                isUploading && index === Array.from(previewUrl).length - 1
                                    ?
                                <div className="flex items-center p-1 h-16">
                                    <ClipLoader 
                                        color="#a6abb8" 
                                        speedMultiplier={2}
                                        size={10}
                                        className="w-12 h-12"
                                    />
                                </div>
                                    :
                                <div className="relative w-20 h-20 border-[1.5px] border-sky-500 rounded-sm">
                                    <Image
                                        src={value}
                                        alt="error"
                                        fill
                                        objectFit="cover"
                                        className="w-full h-full rounded-sm"
                                    />
                                </div>
                            }
                            </div>
                        ))
                    }
                    </div>
                </div>
            </div>
            <button type="submit"
                className={`border bg-gray-300 text-gray-800 rounded-md shadow-lg cursor-pointer px-4 py-2 mb-3 w-full`}
                disabled={isUploading}
            >
            {
                isUploading 
                ? 
                <div className="flex items-center justify-center">
                    <span className="mr-1">Uploading</span> 
                    <ClipLoader size={10} color="#5cbdfd" className="mt-2 w-8 h-8" /> 
                </div>
                : 
                <span>Upload</span>
            }
            </button>
        </form>
    )
}