import { SetStateAction } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import axios, { AxiosError } from "axios";
import Image from "next/image";
import { ClipLoader, ClockLoader } from "react-spinners";
import hotToast from "react-hot-toast";

interface Props {
    name: string,
    brandName: string,
    previewUrl: Set<string>,
    isUploading: boolean,
    file: File | undefined,
    setFile: (v: SetStateAction<File | undefined>) => void,
    setIsUploading: (v: SetStateAction<boolean>) => void,
    setPreviewUrl: (v: SetStateAction<Set<string>>) => void,
}

export default function CreateForm({ 
    name, brandName, previewUrl, isUploading, file, setFile, setIsUploading, setPreviewUrl,
}: Props) 
{
    const router = useRouter();
    const { data: session } = useSession();

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
        e.preventDefault();

        if(typeof file === 'undefined') {
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
                // console.log(resp.data);
                axios.post(
                    `/api/upload/create-category?name=${name}&brand=${brandName}&image=${resp.data.url}&adminId=${session?.user._id}`
                )
                    .then(res => {
                        if(res.status === 201 || res.status === 200) {
                            hotToast.success("Image uploaded successfully");
                            router.reload();
                        }
                        else {
                            hotToast.success(res.data.message);
                        }
                    })
                    .catch((err: AxiosError) => {
                        hotToast.error("Brand not created");
                        console.error({
                            response: err.response, message: err.message
                        });
                    })
            })
            .catch((err: AxiosError) => {
                console.error({
                    response: err.response, message: err.message
                });        
                hotToast.error(err.response?.data as string);            
            })
            .finally(() => setIsUploading(false));            
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
                            <div key={index} className="mx-2 flex items-center justify-center">
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
            <button 
                type="submit"
                className={`border bg-gray-300 text-gray-800 rounded-md shadow-lg cursor-pointer px-4 py-2 mb-3 w-full sm:w-[300px]`}
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