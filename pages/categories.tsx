import React, { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import Layout from "@/components/Layout"
import { withSwal } from "react-sweetalert2"
import { CategoryType } from "@/config/config"
import { MdDelete } from "react-icons/md";

function CategoriesPage({swal}: any) {
    const [categoryList, setCategoryList] = useState<CategoryType[]>([])
    const [category, setCategory] = useState<CategoryType | null>(null)
    const [categoryName, setCategoryName] = useState('')
    const [properties, setProperties] = useState<Object>({})
    const [parentCategory, setParentCategory] = useState('')
    const [editedCategoryName, setEditedCategoryName] = useState<string | null>(null)
    const [isEditingDone, setIsEditingDone] = useState(false)

    useEffect(() => {
        fetchCategories()
    }, [])

    const fetchCategories = () => {
        axios.get<CategoryType[]>('/api/categories/get')
        .then((res: any) => {           
            setCategoryList(res.data)
            // console.log(res.data) 
        })
    }

    const saveCategory = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()       
        if(editedCategoryName) {
            for(const key in properties) {
                const value: any = properties[key as keyof typeof properties]
                if(Array.isArray(value) === false) {
                    properties[key as keyof typeof properties] = value.split(",")
                }
            }
            
            const axiosBody = { 
                name: categoryName, parent: parentCategory, id: category?._id, properties
            }
            const res = await axios.put('/api/categories/update', axiosBody)
            res.status === 202
                ?
            (
                toast(res.data.message),
                setIsEditingDone(false)
            )
                :
            toast.error(res.data.message)
        }
        else {
            for(const key in properties) {
                const value: any = properties[key as keyof typeof properties]
                if(Array.isArray(value) === false) {
                    properties[key as keyof typeof properties] = value.split(",")
                }
            }

            const axiosBody = {
                name: categoryName, parent: parentCategory, properties
            }
            const res = await axios.post('/api/categories/create', axiosBody)
            res.status === 201 
                ?
            toast(res.data.message)
                :
            toast.error(res.data.message)
        }
        setCategoryName('')
        setParentCategory('')
        setProperties([])
        fetchCategories()
    }

    const editCategory = (eCategory: CategoryType) => {
        setIsEditingDone(true)
        setEditedCategoryName(eCategory.name)
        setCategoryName(eCategory?.name)
        setCategory(eCategory)
        setProperties((prev: any) => {
            if(eCategory.properties) {
                Object.entries(eCategory.properties).map(([key, value]: [string, string[]]) => {
                    prev[key] = value
                })
            }
            return prev;
        })
    }

    const deleteSelectedCategory = (category: CategoryType) => {
        swal.fire({
            title: 'Are you sure ?',
            text: `Do you want to delete ${category.name}`,
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Yes, Delete',
            confirmButtonColor: "#f51616",
            reverseButtons: true,
        })
        .then((res: any) => {
            if(res.isConfirmed) {
                axios.delete('/api/categories/delete', {
                    data: { id: category._id }
                })
                .then(res => {
                    swal.fire(`Deleted ${category.name}! 😒`, '', 'success')
                })
                .catch(err => toast.error(err.message))
                .finally(() => fetchCategories())
            }
            else {
                swal.fire('Delete action aborted! 🥲', '', 'info')
            }
        })
        .catch((err: any) => {
            console.error(err.message)
        })
    }

    const addNewProperties = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        const newObject = {
            [""]: ""
        }
        setProperties(prev => ({...prev, ...newObject}))
    }

    const handlePropertyNameChange = (newKey: string, key: string) => {
        const oldObject: any = properties
        const values = oldObject[key]
        oldObject[newKey] = values
        delete oldObject[key]
        setProperties(prev => ({...prev, ...oldObject}))
    }

    const handlePropertyValueChange = (value: string, key: string, previousValues: string) => {
        const oldObject: any = properties
        oldObject[key] = value
        setProperties(prev => ({...prev, ...oldObject}))
    }

    const removeProperty = (key: string) => {
        const oldObject: any = properties
        delete oldObject[key]
        setProperties(prev => ({...prev, ...oldObject}))
    }


    return (
        <Layout>
            <div className="flex justify-between">
                <h1 className="font-semibold">Categories</h1>
                <button className={
                    `${!isEditingDone && "hidden"} bg-gray-500 text-white px-3 rounded-md`}
                    onClick={() => {
                        setIsEditingDone(false)
                        setProperties({})
                        setCategory(null)
                        setEditedCategoryName('')
                        setCategoryName('')
                        setParentCategory('')
                    }}
                >
                    Go back →
                </button>
            </div>
            <label>{editedCategoryName ? `Edit ${editedCategoryName}` : 'New Category Name'}</label>
            <form className="flex flex-col mt-2" onSubmit={e => saveCategory(e)}>
                <div className="flex justify-start gap-4">
                    <input 
                        type="text" 
                        placeholder="Category name"
                        value={categoryName}
                        className="w-full h-full py-2 pl-2"
                        onChange={e => setCategoryName(e.target.value)}
                    />
                    <select className="w-full" value={parentCategory}
                        onChange={e => setParentCategory(e.target.value)}
                    >
                        <option value={""}> Select parent category </option>
                        {   
                            categoryList.length > 0 && categoryList?.map((category, index) => (
                                <option key={index} value={(category._id)} className="text-black">
                                    {category.name}
                                </option>
                            ))
                        }
                    </select>
                </div>
                <div className="mt-1 mb-3">
                    <label>Properties</label>
                    <button type="button" className="bg-slate-600 px-4 py-2 ml-3 rounded-md"
                        onClick={e => addNewProperties(e)}
                    >
                        Add new property
                    </button>
                </div>
                <div className="mb-3">
                {
                    Object.keys(properties).length > 0 && 
                    Object.entries(properties)?.map(([key, value], index) => (
                        <div key={index} className="flex justify-between gap-1">
                            <input type="text" value={key}
                                className="w-[47%] text-black" 
                                placeholder="Property name (example: color)"
                                onChange={e => handlePropertyNameChange(
                                    e.target.value, key
                                )}
                            />
                            <input type="text" value={value}
                                className="w-[47%] text-black" 
                                placeholder="Property values (comma seperated)"
                                onChange={e => handlePropertyValueChange(
                                    e.target.value, key, value
                                )}
                            />
                            <MdDelete 
                                type="button"
                                className="w-10 h-10 text-red-600 cursor-pointer -mt-1"
                                onClick={() => removeProperty(key)}
                            />
                        </div>
                    ))
                }
                </div>
                <button type="submit" className={`bg-blue-900 px-3 py-3 rounded-md text-xl`}>
                { isEditingDone ? "Update" : "Create"}
                </button>
            </form>
            
            <table className="w-full mt-4">
                <thead className="w-full">
                    <tr className="w-full">
                        <td className="w-1/3 bg-sky-200 p-2 font-medium text-lg">
                            Category Name
                        </td>
                        <td className="w-1/3 bg-sky-200 p-2 font-medium text-lg">
                            Parent Category
                        </td>
                        <td className="w-1/3 bg-sky-200 p-2"></td>
                    </tr>
                </thead>
                <tbody className="w-full">
                {
                    category && isEditingDone
                        ? 
                    (
                        <tr>
                            <td className="p-2">{category.name}</td>
                            <td className="p-2">{category?.parent?.name}</td>
                            <td className="flex justify-around p-2 max-lg:justify-between max-md:flex-col max-lg:px-3 max-md:px-2 max-lg:gap-2 border-none">
                                <button 
                                    type="button"
                                    className="w-1/3 max-lg:w-1/2 max-md:w-full bg-blue-800 text-white text-lg px-1 py-2 rounded-md tracking-widest"
                                    onClick={() => editCategory(category)}
                                >
                                    Edit
                                </button>
                                <button
                                    type="button"
                                    className="w-1/3 max-lg:w-1/2 max-md:w-full bg-red-700 text-white text-lg px-1 py-2 rounded-md tracking-wide"
                                    onClick={() => {
                                        deleteSelectedCategory(category)
                                    }}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    )
                        :
                    categoryList.length > 0 && categoryList?.map((cat, index) => (
                        <tr key={index}>
                            <td className="p-2">{cat.name}</td>
                            <td className="p-2">{cat?.parent?.name}</td>
                            <td className="flex justify-around p-2 max-lg:justify-between max-md:flex-col max-lg:px-3 max-md:px-2 max-lg:gap-2 border-none">
                                <button 
                                    type="button"
                                    className={`w-1/3 max-lg:w-1/2 max-md:w-full bg-blue-800 text-white text-lg px-1 py-2 rounded-md tracking-widest`}
                                    onClick={() => editCategory(cat)}
                                >
                                    Edit
                                </button>
                                <button
                                    type="button"
                                    className="w-1/3 max-lg:w-1/2 max-md:w-full bg-red-700 text-white text-lg px-1 py-2 rounded-md tracking-wide"
                                    onClick={() => deleteSelectedCategory(cat)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))
                }
                </tbody>
            </table>
        </Layout>
    )
}

const Categories =  withSwal(({swal}: any, ref: any) => (
    <CategoriesPage swal={swal} />
))

export default Categories;