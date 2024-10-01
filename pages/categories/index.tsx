import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Layout from "@/components/Layout";
import { CategoryClass } from "@/config/CategoryTypes";
import { ClipLoader } from "react-spinners";
import { loaderColor } from "@/config/config";
import { withSwal } from "react-sweetalert2";

const CategoryPage = ({swal}: any) => {
    const [categoryList, setCategoryList] = useState<CategoryClass[]>([]);
    const [isLoadingCategories, setisLoadingCategories] = useState(false);

    const fetchCategories = async () => {
        try {
            const res = await axios.get<CategoryClass[]>('/api/categories/get');
            setCategoryList(res.data);
        }
        catch(err: any) {
            console.error(err.message);
        }
        finally {
            setisLoadingCategories(false);
        }
    }

    useEffect(() => {
        setisLoadingCategories(true);
        fetchCategories();
    }, [])

    const deleteSelectedCategory = async (id: string, subCategory: string) => {
        try {
            const response = await swal.fire({
                title: 'Are you sure ?',
                text: `Do you want to delete ${subCategory}`,
                showCancelButton: true,
                cancelButtonText: 'Cancel',
                confirmButtonText: 'Yes, Delete',
                confirmButtonColor: "#f51616",
                reverseButtons: true,
            })
            if(response.isConfirmed) {
                const res = await axios.delete(
                    `api/categories/delete?id=${id}&sname=${subCategory}`
                )
                if(res.status === 202) {
                    swal.fire(`${subCategory} ${res.data.message} 🙂`, '', 'success');
                }
                else if(res.status === 200) {
                    swal.fire(`${subCategory} ${res.data.message} 🥲`, '', 'info');
                }
            }
        }
        catch(err: any) {
            console.error(err.message);            
        }
        finally {
            fetchCategories();
        }
    }

    return (
        <Layout>
            <Link 
                href={'/categories/create'} 
                className="bg-blue-800 text-white text-lg font-semibold px-10 py-2 rounded-[4px] mb-4"
            >
                Create New Category
            </Link>
            <h1 className="text-3xl font-semibold mt-6 mb-2 underline">All Categories</h1>
            {
                isLoadingCategories
                    ?
                <div className="text-center mt-6">
                    <ClipLoader color={loaderColor} size={90} />
                </div>
                    :
                <div className="mt-6">
                    <div className="grid grid-cols-3 gap-4 max-md:grid-cols-2 max-xsm:grid-cols-1">
                    {
                        categoryList.length > 0
                            &&
                        categoryList?.map(category => (
                            <div 
                                key={category._id}
                                className={`${!category.subCategory.length && "hidden"} col-span-1 border-gray-300 border rounded-md py-3 px-4`}
                            >
                                <div className="px-2 text-3xl font-bold mb-4 rounded-sm tracking-wide uppercase text-center font-mono text-gray-500">
                                    {category.name}
                                </div>
                                <div className="mb-3">
                                {
                                    category.subCategory.length > 0
                                        &&
                                    category.subCategory?.map((subCat, index) => (
                                        <div key={index}
                                            className="flex items-center justify-between text-lg text-gray-500 font-semibold border border-gray-300 px-4 py-2 my-2 rounded-md"
                                        >
                                            <div>
                                            {
                                                subCat.name.length > 20
                                                    ?
                                                `${subCat.name.substring(0, 19)}...`
                                                    : 
                                                subCat.name
                                            }
                                            </div>
                                            <div className="flex flex-col gap-y-2">
                                                <Link 
                                                    href={`/categories/update/${category._id}?cname=${category.name}&sname=${subCat.name}&id=${category._id}`}
                                                    className="bg-gray-500 text-white py-1 rounded-lg text-center"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    type="button"
                                                    className="bg-red-600 text-white px-3 py-1 rounded-lg"
                                                    onClick={
                                                        () => deleteSelectedCategory(
                                                            category._id,subCat.name
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                }
                                </div>
                            </div>
                        ))
                    }
                    </div>
                </div>
            }
        </Layout>
    )
}

const Categories = withSwal(({swal}: any, ref: any) => (
    <CategoryPage swal={swal} />
))

export default Categories;