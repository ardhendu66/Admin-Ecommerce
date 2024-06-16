import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { toast } from 'react-toastify'
import Layout from "@/components/Layout"
import { CategoryType, CatProperty } from "@/config/config"

export default function Create() {
    const router = useRouter()
    const [name, setName] = useState<string>('')
    const [images, setImages] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [price, setPrice] = useState<number>()
    const [amount, setAmount] = useState<number>()
    const [category, setCategory] = useState<string>('')
    const [categoryName, setCategoryName] = useState<string>('')
    const [categories, setCategories] = useState<CategoryType[]>([])
    const [categoryProperties, setCategoryProperties] = useState<CatProperty[]>([])
    const [allCatProps, setAllCatProps] = useState<Object>({})
    const [properties, setProperties] = useState<Object>({})

    useEffect(() => {
        fetchCategories()
    }, [])

    useEffect(() => {
        const newCategory = categories.find(c => c._id === category)
        if(typeof newCategory !== 'undefined') {
            setProperties(newCategory.properties)
            setCategoryName(newCategory.name)
        }      
    }, [category])

    useEffect(() => {
        setAllCatProps((prev: any) => {
            categoryProperties?.map(cat => {
                prev = {...prev, ...cat.properties}
            })
            console.log("prevObj: ", {...prev}) 
            return {...prev}
        })
        console.log("render");
    }, [categoryProperties])

    function fetchCategories() {
        axios.get<CategoryType[]>('/api/categories/get')
        .then(res => {
            setCategories(res.data)
        })
        .catch(err => {
            console.error(err.message)
            toast.error(err.message)       
        })
    }

    const createNewProduct = async (event: React.MouseEvent<HTMLFormElement>) => {
        event.preventDefault()
        if(name && description && price && images && amount) {
            try {
                let imageArray = images.split(",")
                if(imageArray[imageArray.length - 1] === "") {
                    imageArray.pop()
                }
                const res = await axios.post('/api/products/create-product', {
                    name, images: imageArray, description, price, amount, category,
                    categoryProperties: allCatProps
                })
                if(res.status === 201) {
                    toast(res.data.message)
                    router.push('/products')
                } else {
                    toast.error(res.data.message)
                }
            }
            catch(err: any) {
                console.error(err.message)              
                toast.error(err.message)      
            }
        }
        else {
            toast('Please fill all the details')
        }
    }

    const changePropertyValues = (value: string, key: string) => {        
        setCategoryProperties(prev => {
            return [
                ...prev, 
                ...[{
                    catName: categoryName, 
                    properties: { 
                        [key]: value
                    }
                }]
            ]
        })
    }


    return (
        <Layout>
            <form onSubmit={(event: React.MouseEvent<HTMLFormElement>) => createNewProduct(event)}>
                <h1>New Product</h1>
                <label>Product name</label>
                <input 
                    type="text" 
                    placeholder="name" value={name} 
                    onChange={e => setName(e.target.value)}
                />
                <label>Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)}>
                    <option value='' className="font-medium text-lg"> --Select-- </option>
                    {
                        categories.map((c, index) => (
                            <option value={c._id} key={index}>
                                {c.name}
                            </option>
                        ))
                    }
                </select>
                {
                    Object.entries(properties).map(([key, values]: [string, string[]], index) => (
                        <div key={index} className="flex justify-between gap-2">
                        {
                            <>
                                <div className="w-1/5">{key}</div>
                                <select className="w-4/5" 
                                    onChange={e => changePropertyValues(
                                        e.target.value, key
                                    )} 
                                >
                                <option value={""}>--Select--</option>
                                {
                                    values.map((v, ind) => (
                                        <option key={ind} value={v}>{v}</option>
                                    ))
                                }
                                </select>
                            </>
                        } 
                        </div>
                    ))
                }
                <label>Photos</label>
                <textarea 
                    placeholder="image-link" 
                    value={images} 
                    onChange={e => setImages(e.target.value)}
                    rows={5}
                    className="mb-4"
                ></textarea>
                <label>Product description</label>
                <textarea 
                    rows={7}
                    placeholder="description" 
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="pt-3"
                ></textarea>
                <label>Product price (₹)</label>
                <input 
                    type="number" 
                    placeholder="price" 
                    value={price}
                    onChange={e => setPrice(Number(e.target.value))}
                />
                <label>Product amount</label>
                <input 
                    type="number"
                    placeholder="amount"
                    value={amount}
                    onChange={e => setAmount(Number(e.target.value))}
                />
                <button 
                    type="submit" 
                    className="p-2 px-3 mt-3 text-lg bg-blue-900 text-gray-200 rounded-sm w-full"
                >
                    Create
                </button>
            </form>
        </Layout>
    )
}