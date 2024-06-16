import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import axios from "axios"
import { toast } from 'react-toastify'
import Layout from "@/components/Layout"
import ViewProduct from "@/components/ViewProductImages"
import { Product, PropertyType, CategoryType, CatProperty } from "@/config/config"
import { destructDescriptionArray } from "@/components/functions"

const defaultProductAttributes: Product = {
    _id: '',
    name: '',
    description: '',
    images: [],
    price: Number(),
    amount: Number(),
    __v: 0,
    category: {
        _id: '',
        name: '',
        parent: {
            _id: '',
            name: '',
            __v: 0
        },
        __v: 0,
        properties: [{
            name: '',
            values: []
        }]
    },
    categoryProperties: {}
}

export default function UpdateSingleProduct() {
    const [productAttribute, setProductAttribute] = useState<Product>(defaultProductAttributes)
    const [isLoadingProduct, setIsLoadingProduct] = useState(false)
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
    const router = useRouter()
    const { id } = router?.query

    useEffect(() => {
        if(!id) return
        fetchSingleProduct()
    }, [id])

    useEffect(() => {
        fetchCategories()
    },)
    
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
                const newCategory = categories.find(c => c._id === category)
                if(newCategory?.name !== cat.catName) {
                    prev = {}
                }
                else {
                    prev = {...prev, ...cat.properties}
                }
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
        })
    }

    async function fetchSingleProduct() {
        try {
            setIsLoadingProduct(true)
            const res = await axios.get<Product>(`/api/products/get-product/?id=${id}`)
            const responseData = res?.data
            
            if(responseData) {
                setProductAttribute(responseData)
                setName(responseData.name)
                setDescription(responseData.description)
                setPrice(responseData.price)   
                setAmount(responseData.amount) 
                setImages(destructDescriptionArray(responseData.images))
                setCategory(responseData.category._id)
            }
            else {
                toast('failed to fetch data')
            }
        }
        catch(err: any) {
            console.error(err)               
        }
        finally {
            setIsLoadingProduct(false)
        }
    }

    const updateExistingProduct= async (event: React.MouseEvent<HTMLFormElement>, id: string | string[] | undefined) => {       
        event.preventDefault()
        try {
            let imageArray = images.split(",")
            if(imageArray[imageArray.length - 1] === "") {
                imageArray.pop()
            }
            const res = await axios.put('/api/products/update-product', {
                id, name, imageArray, description, price, amount, category,
                categoryProperties: allCatProps
            })
            if(res.status === 202) {
                toast.success(`${res.data.message} 😊`)
                setCategoryProperties(categoryProperties)
                setAllCatProps({})
                router.reload()
            }
        }
        catch(err: any) {
            toast.error(err.message)         
        }
    }

    const changePropertyValues = (value: string, key: string) => {  
        setCategoryProperties(prev => [
            ...prev, 
            ...[{
                catName: categoryName, 
                properties: { 
                    [key]: value
                }
            }]
        ])
    }

    
    return (
        <Layout>
            <form onSubmit={
                (event: React.MouseEvent<HTMLFormElement>) => updateExistingProduct(event, id)
            }>
                <label>Product name</label>
                <input type="text" placeholder="name" value={name} 
                    onChange={e => setName(e.target.value)}
                    className="mb-4"
                />
                <label>Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)}>
                    <option 
                        value={productAttribute?.category?._id || ''}
                        className="font-medium text-lg"
                    > 
                        {productAttribute?.category?.name || "Uncategorized"}
                    </option>
                    {
                        categories.map((c, index) => (
                            <option value={c._id} key={index}>
                                {c.name}
                            </option>
                        ))
                    }
                </select>
                {
                    Object.entries(properties).map(([key, values]: [string, string[]], index) =>(
                        <div key={index} className="flex justify-between gap-2">
                        {
                            <>
                                <div className="w-1/5">{key}</div>
                                <select 
                                    className="w-4/5" 
                                    onChange={e => changePropertyValues(
                                        e.target.value, key
                                    )}
                                    value={String(allCatProps[key as keyof typeof allCatProps] 
                                        || productAttribute.categoryProperties[key as keyof typeof productAttribute.categoryProperties]
                                    )}
                                >
                                    <option value={""}>--Select--</option>
                                    {
                                        values.map((v, ind) => (
                                            <option key={ind} value={v}>
                                                {v}
                                            </option>
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
                    placeholder="description" 
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows={7}
                    className="pt-3"
                ></textarea>
                <label>Product price (₹)</label>
                <input type="number" placeholder="price" value={price}
                    onChange={e => setPrice(Number(e.target.value))}
                />
                <label>Product amount</label>
                <input 
                    type="number"
                    placeholder="amount"
                    value={amount}
                    onChange={e => setAmount(Number(e.target.value))}
                />
                <button type="submit"
                    className="py-2 px-3 mt-3 text-xl bg-blue-900 text-gray-200 rounded-sm w-full shadow-md tracking-wide"
                > Update </button>
            </form>
            
            <ViewProduct id={id}
                product={productAttribute}
                fetchProduct={fetchSingleProduct}
            />            
        </Layout>
    )
}