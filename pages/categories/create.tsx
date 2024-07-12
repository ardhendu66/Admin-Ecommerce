import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Layout from "@/components/Layout";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

export default function CreateCategory() {
    const [name, setName] = useState("");
    const [subName, setSubName] = useState("");
    const [properties, setProperties] = useState<Object>({});
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    const addProperties = () => {
        setProperties(prev => {
            const obj = {
                [""]: ""
            }
            return {
                ...prev,
                ...obj
            }
        })
    }

    const changePropertyKey = (target: string, key: string) => {
        const propertyObject: any = properties;
        const value = propertyObject[key];
        propertyObject[target] = value;
        delete propertyObject[key];
        setProperties(prev => ({...propertyObject, ...prev}));
    }

    const changePropertyValue = (target: string, key: string) => {
        const propertyObject: any = properties;
        propertyObject[key] = target;
        setProperties(prev => ({...prev, ...propertyObject}));
    }
    
    const deleteCertainProperty = (key: string) => {
        const propertyObject: any = properties
        delete propertyObject[key]
        setProperties(prev => ({...prev, ...propertyObject}))
    }

    const createNewCategory = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        if(name === "" || subName === "" || Object.keys(properties).length === 0) {
            toast.info("Fill all the details", { position: "top-center" });
            return;
        }
        try {
            const propertiesObject: any = {}
            Object.entries(properties).map(([key, value]) => {
                Object.assign(propertiesObject, {[key]: value.split(",")})
            })
            const res = await axios.post('/api/categories/create', {
                name, subCategory: subName, properties: propertiesObject
            })
            if(res.status === 202 || 201) {
                toast.success(res.data.message, { position: "top-center" });
                setTimeout(() => {
                    router.push("/categories");
                }, 1000)
            }
            else if(res.status === 200) {
                toast.info(res.data.message, { position: "top-center" });
            }
        }
        catch(err: any) {
            console.error(err.message);
            toast.error("Category creation failed", { position: "top-center" });      
        }
        finally {
            setIsLoading(false);
        }
    }

    return (
        <Layout>
            <h1 className="text-4xl font-semibold text-sky-600">
                New Category Creation
            </h1>
            <form 
                className="text-lg font-semibold"
                onSubmit={(e) => createNewCategory(e)}
            >
                <div>
                    <label>Name</label>
                    <input 
                        type="text" 
                        placeholder="Category name"
                        className=""
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <label>Sub-Category Name</label>
                    <input 
                        type="text" 
                        placeholder="Category name"
                        className=""
                        value={subName}
                        onChange={(e) => setSubName(e.target.value)}
                    />
                </div>
                <div className="flex items-center">
                    <h2 className="mr-3">Category Properties</h2>
                    <button 
                        type="button"
                        className="bg-gray-500 text-white px-4 py-2 rounded-md mb-3 w-52"
                        onClick={addProperties}
                    >
                        Add Properties
                    </button>
                </div>
                <div>
                {
                    Object.entries(properties).length > 0 
                        &&
                    Object.entries(properties).map(([key, value], index) => (
                        <div key={index} className="flex justify-between gap-2">
                            <input 
                                type="text"
                                value={key}
                                placeholder="Example... Color"
                                className="w-[28%]"
                                onChange={e => changePropertyKey(e.target.value, key)}
                            />
                            <input 
                                type="text"
                                value={value}
                                placeholder="Example... Blue,Red (comma seperated)"
                                className="w-[64%]"
                                onChange={e => changePropertyValue(e.target.value, key)}
                            />
                            <button 
                                type="button"
                                className="bg-red-600 text-white rounded-md px-3 h-[37px]"
                                onClick={() => deleteCertainProperty(key)}
                            >
                                Delete
                            </button>
                        </div>
                    ))
                }
                </div>
                <button 
                    type="submit"
                    className={`bg-blue-800 text-2xl w-full mt-2 py-[10px] rounded-[4px]`}
                >
                {
                    isLoading
                        ?
                    <span>
                        Creating...
                        <ClipLoader 
                            color="white"
                            size={40}
                            className="-mb-2 ml-2"
                        />
                    </span>
                        :
                    "Create New Category"
                }
                </button>
            </form>
        </Layout>
    )
}