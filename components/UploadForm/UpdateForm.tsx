import axios, { AxiosError } from "axios"
import Image from "next/image"
import { ClockLoader, ClipLoader } from "react-spinners"
import { toast } from "react-toastify"
import { SetStateAction, useState } from "react"
import { UploadItemType } from "@/config/UploadTypes"
import { useSession } from "next-auth/react"

interface Props {
    name: string,
    brandName: string,
    previewUrl: Set<string>,
    isUploading: boolean,
    file: File | undefined,
    setFile: (v: SetStateAction<File | undefined>) => void,
    setIsUploading: (v: SetStateAction<boolean>) => void,
    setPreviewUrl: (v: SetStateAction<Set<string>>) => void,
    fetchAllBrands: () => void,
    product: UploadItemType | null,
}

export default function UpdateForm({ 
    name, brandName, previewUrl, isUploading, file, setFile, setIsUploading, setPreviewUrl, fetchAllBrands, product
}: Props) 
{
    const [canUpload, setCanUpload] = useState(true);
    const { data: session } = useSession();

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files === null) {
            return;
        }
        setFile(e.target.files[0]);
        setPreviewUrl(prev => {
            if(e.target.files) {
                prev.add(URL.createObjectURL(e.target.files[0]))
            }
            return prev;
        })
    }

    const UploadImage = async (e: React.MouseEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(typeof file === 'undefined') {
            return;
        }

        const filteredBrand = product?.brand.find(br => br.name === brandName);
        if(filteredBrand && filteredBrand.adminId !== session?.user._id) {
            setCanUpload(false);
            return;
        }
        
        setIsUploading(true);

        const formData = new FormData();
        formData.append('upload_image', file); 

        axios.post('/api/upload/cloud', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then(resp => {
                axios.put('/api/upload/update', {
                    name, brand: brandName, image: resp.data.url,
                })
                .then(res => {
                    if(res.status === 202) {
                        toast.success(
                            "Image uploaded successfully", { position: "top-center" }
                        );
                    }
                    else {
                        toast.info(res.data.message, { position: "top-center" });
                    }
                })
                .catch((err: AxiosError) => {
                    toast.error("Brand not updated", { position: "top-center" });
                    console.error(err);
                })
            })
            .catch((err: AxiosError) => {
                toast.error("Image not uploaded to cloud", { position: "top-center" });
                console.error(err);
            })
            .finally(() => {
                setIsUploading(false);
                fetchAllBrands();
            });
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
            <p className={`w-60 text-sm ${canUpload && "hidden"} bg-red-600 text-white pl-3 p-2 rounded-sm shadow-md mt-2 mb-5`}>
                ⓘ{"  "}You're not authorized to upload image for brand <strong>{brandName}</strong>
            </p>
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