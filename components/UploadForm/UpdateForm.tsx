import axios from "axios"
import { useRouter } from "next/router"
import Image from "next/image"
import { ClockLoader, ClipLoader } from "react-spinners"
import { toast } from "react-toastify"
import { SetStateAction } from "react"

interface Props {
    brandName: string,
    previewUrl: Set<string>,
    isUploading: boolean,
    file: File | undefined,
    setFile: (v: SetStateAction<File | undefined>) => void,
    setIsUploading: (v: SetStateAction<boolean>) => void,
    setPreviewUrl: (v: SetStateAction<Set<string>>) => void,
    fetchAllBrands: () => void,
}

export default function UpdateForm({ 
    brandName, previewUrl, isUploading, file, setFile, setIsUploading, setPreviewUrl, fetchAllBrands
}: Props) 
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

    const UploadImage = async (e: React.MouseEvent<HTMLFormElement>) => {
        e.preventDefault() 
        if(typeof file !== 'undefined') {
            setIsUploading(true)
            const formData = new FormData();
            formData.append('upload_image', file); 
            try {
                const resp = await axios.post('/api/upload/cloud', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })
                if(resp.data) {
                    try {
                        const res = await axios.put('/api/upload/update', {
                            name: 'smartphones', brand: brandName, image: resp.data.url,
                        })
                        if(res.status === 202)
                            toast.success(res.data.message, { position: "top-center" });
                        else toast.info(res.data.message, { position: "top-center" });
                        // console.log(resp.data);
                    }
                    catch(e: any) {
                        toast.error("Brand not updated", { position: "top-center" });
                        console.error(e.message);
                    }
                }
            }
            catch(e: any) {
                toast.error("Image not uploaded to cloud", { position: "top-center" });
                console.error(e.message);
            }
            finally {
                setIsUploading(false);
            }
        }
    }

    return (
        <form onSubmit={(e: React.MouseEvent<HTMLFormElement>) => UploadImage(e)}>
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
                    <div className="w-full flex px-2">
                    { 
                        Array.from(previewUrl).map((value, index) => (
                            <div key={index} className="mx-2">
                            {
                                isUploading && index === Array.from(previewUrl).length - 1
                                    ?
                                <div className="flex items-center p-1 h-16">
                                    <ClockLoader 
                                        color="#5cbdfd"
                                        size={60}
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
                className={`border bg-gray-300 text-gray-800 rounded-md shadow-lg cursor-pointer p-3 mb-3 w-full sm:w-[300px]`}
                disabled={isUploading}
            >
            {
                isUploading 
                ? 
                <div className="flex items-center justify-center">
                    <span className="mr-3 text-xl font-bold">Uploading</span> 
                    <ClipLoader 
                        size={30} 
                        color="white" 
                        className="w-8 h-8" 
                    /> 
                </div>
                : 
                <span className="text-xl font-bold">Upload</span>
            }
            </button>
        </form>
    )
}