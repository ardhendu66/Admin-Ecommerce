import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";
import { SubCategoryExtended } from "@/config/CategoryTypes";
import Layout from "@/components/Layout";
import { toast } from "react-toastify";
import { ClockLoader } from "react-spinners";

export default function UpdateCategory() {
    const [category, setCategory] = useState<SubCategoryExtended | null>(null);
    const [properties, setProperties] = useState<any>({});
    const [isUpdating, setIsUpdating] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [editSubCategoryName, setEditSubCategoryName] = useState(false);
    const [subCategoryName, setSubCategoryName] = useState("");
    const router = useRouter();
    const { cname, sname, id } = router?.query;
    const { data: session } = useSession();

    useEffect(() => {
        if (!sname || !cname || !id) {
            return;
        }
        setIsLoading(true);
        const fetchCategory = async () => {
            try {
                const res = await axios.get(
                    `/api/categories/get?id=${id as string}&sname=${sname as string}`
                );
                if (res.status === 200) {
                    setCategory(res.data);
                    setSubCategoryName(res.data.name);
                    setProperties((prev: any) => {
                        if (
                            typeof res.data.properties !== "undefined" &&
                            res.data.properties !== null
                        ) {
                            Object.entries(res.data.properties).map(([key, value]: any) => {
                                prev = {
                                    ...prev,
                                    [key]: value.join(","),
                                };
                            });
                        }
                        return prev;
                    });
                } else if (res.status === 205) {
                    toast.info(res.data.message, { position: "top-center" });
                }
            } catch (err: any) {
                console.error(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCategory();
    }, [cname, sname, id]);

    const addProperties = () => {
        setProperties((prev: any) => {
            const obj = {
                [""]: "",
            };
            return {
                ...prev,
                ...obj,
            };
        });
    };

    const handlePropertyNameChange = (targetKey: string, key: string) => {
        const oldObject: any = properties;
        const values = oldObject[key];
        oldObject[targetKey] = values;
        delete oldObject[key];
        setProperties((prev: any) => ({ ...prev, ...oldObject }));
    };

    const handlePropertyValueChange = (targetValue: string, key: string) => {
        const oldObject: any = properties;
        oldObject[key] = targetValue;
        setProperties((prev: any) => ({ ...prev, ...oldObject }));
    };

    const deleteCertainProperty = (key: string) => {
        const propertyObject: any = properties;
        delete propertyObject[key];
        setProperties((prev: any) => ({ ...prev, ...propertyObject }));
    };

    const updateSubCategory = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!cname || !sname || !id || Object.entries(properties).length === 0) {
            return;
        }
        setIsUpdating(true);
        try {
            let obj: any = {};
            Object.entries(properties).map(([key, value]: any) => {
                obj[key] = Array.from(new Set(value.split(",")));
            });
            const res = await axios.put("/api/categories/update", {
                id,
                subCategoryName: sname,
                updatedSubCategoryName: subCategoryName,
                properties: obj,
                adminId: session?.user._id
            });
            if (res.status === 202) {
                toast.success(res.data.message, { position: "top-center" });
            } else if (res.status === 200) {
                toast.info(res.data.message, { position: "top-center" });
            }
        } catch (err: any) {
            console.error(err.message);
        } finally {
            setIsUpdating(false);
        }
    };

    if (cname && sname && id) {
        return (
            <Layout>
                <div className="text-end">
                    <Link
                        href={"/categories"}
                        className="border-[1.5px] border-gray-400 text-gray-500 px-4 py-2 mb-5 rounded-md"
                    >
                        ← &nbsp;&nbsp;Go Back To Category
                    </Link>
                </div>
                <div className="flex flex-col text-xl font-semibold mt-5">
                    <label className="mb-1 text-sky-700">Category Name</label>
                    <input
                        type="text"
                        value={cname as string}
                        disabled
                        className="cursor-not-allowed border-[1.2px] border-gray-300"
                    />
                </div>
                <div className="flex flex-col text-xl font-semibold">
                    <label className="mb-1 text-sky-700">Sub-Category Name</label>
                    <div className={`flex items-center justify-between bg-gray-100 rounded-md ${!editSubCategoryName ? "cursor-not-allowed border-[1.2px] border-gray-300" : "border-[1.5px] border-gray-700"}`}>
                        <input
                            type="text"
                            value={subCategoryName as string}
                            disabled={!editSubCategoryName}
                            className={`outline-none border-none mt-[2px] ${!editSubCategoryName && "cursor-not-allowed"}`}
                            onChange={e => setSubCategoryName(e.target.value)}
                        />
                        <button
                            type="button"
                            className="bg-blue-800 text-white mr-3 px-4 py-[2px]"
                            onClick={() => setEditSubCategoryName(prev => !prev)}
                        >{!editSubCategoryName ? "Edit" : "Cancel"}</button>
                    </div>
                </div>
                <form
                    className="mt-3"
                    onSubmit={(e: React.FormEvent<HTMLFormElement>) =>
                        updateSubCategory(e)
                    }
                >
                    <div className="text-sky-700 text-xl font-semibold mb-3">
                        Category Properties
                        <button
                            type="button"
                            className="bg-gray-600 text-white ml-5 px-5 py-[5px] rounded-md"
                            onClick={addProperties}
                        >
                            Add Properties
                        </button>
                    </div>
                    {category &&
                        Object.entries(properties)?.map(([key, value]: any, index) => (
                            <div key={index} className="flex gap-2 my-1">
                                <input
                                    type="text"
                                    value={key}
                                    placeholder="properties eg. Color, Power etc."
                                    className="w-[28%] border-[1.4px] border-gray-300 focus:outline-none"
                                    onChange={(e) =>
                                        handlePropertyNameChange(e.target.value, key)
                                    }
                                />
                                <input
                                    type="text"
                                    value={value}
                                    placeholder="values eg. Blue,Red etc. comma seperated"
                                    className="border-[1.4px] border-gray-300 focus:outline-none"
                                    onChange={(e) =>
                                        handlePropertyValueChange(e.target.value, key)
                                    }
                                />
                                <button
                                    type="button"
                                    className="h-9 bg-red-600 text-white px-4 rounded-md"
                                    onClick={() => deleteCertainProperty(key)}
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    <button
                        type="submit"
                        className="bg-blue-800 w-full text-2xl font-semibold rounded-md py-2 mt-2"
                    >
                        {isUpdating ? (
                            <span className="flex items-center justify-center">
                                Updating...
                                <ClockLoader color="white" size={30} className="ml-2" />
                            </span>
                        ) : isLoading ? (
                            "Update"
                        ) : (
                            `Update ${category?.name}`
                        )}
                    </button>
                </form>
            </Layout>
        );
    }

    return <Layout>
        404. Page Not Found.
    </Layout>;
}
