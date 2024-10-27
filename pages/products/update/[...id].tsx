import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import axios from "axios"
import { toast } from 'react-toastify'
import Layout from "@/components/Layout"
import ViewProduct from "@/components/ViewProductImages"
import { CategoryClass } from "@/config/CategoryTypes";
import { Product } from "@/config/ProductTypes";
import { defaultProductAttributes } from "@/config/defaultValues";
import { destructDescriptionArray } from "@/components/functions";
import { ClockLoader } from "react-spinners";
import Link from "next/link"

export default function UpdateSingleProduct() {
    const [productAttribute, setProductAttribute] = useState<Product>(defaultProductAttributes)
    const [name, setName] = useState('');
    const [images, setImages] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState<number>();
    const [discount, setDiscount] = useState<number>();
    const [amount, setAmount] = useState<number>();
    const [sellerName, setSellerName] = useState('');
    const [category, setCategory] = useState('');
    const [subCategory, setSubCategory] = useState('');
    const [singleCategory, setSingleCategory] = useState<CategoryClass | null>(null);
    const [categories, setCategories] = useState<CategoryClass[]>([]);
    const [categoryProperties, setCategoryProperties] = useState<any>({});
    const [properties, setProperties] = useState<Object>({});
    const [isLoadingProduct, setIsLoadingProduct] = useState(false);
    const [isUpdatingProduct, setIsUpdatingProduct] = useState(false);
    const router = useRouter();
    const { id } = router?.query;
    const { data: session } = useSession();

    async function fetchSingleProduct() {
        try {
            setIsLoadingProduct(true)
            const res = await axios.get<Product>(
                `/api/products/get-product?id=${id}&adminId=${session?.user._id}`
            )
            const responseData = res?.data
            if(responseData) {
                setProductAttribute(responseData)
                setName(responseData.name)
                setCategory(responseData.category._id)
                setImages(destructDescriptionArray(responseData.images))
                setDescription(responseData.description)
                setPrice(responseData.price)
                setDiscount(responseData.discountPercentage) 
                setAmount(responseData.amount) 
                setSubCategory(responseData.subCategory as string);
                setCategoryProperties(responseData.categoryProperties);
                setSellerName(responseData.seller)
            }
        }
        catch(err: any) {
            console.error(err.message)               
        }
        finally {
            setIsLoadingProduct(false)
        }
    }

    useEffect(() => {
        if(id && session?.user._id) {
            fetchSingleProduct();
        }
    }, [id, session])

    const fetchCategories = () => {
        axios.get<CategoryClass[]>('/api/categories/get')
        .then(res => {
            setCategories(res.data)
        })
        .catch(err => {
            console.error(err.message)      
        })
    }

    useEffect(() => {
        fetchCategories();
    }, [])
    
    useEffect(() => {
        const newCategory = categories.find(c => c._id === category)
        if(typeof newCategory !== 'undefined') {
            setSingleCategory(newCategory);
        }      
    }, [category])

    useEffect(() => {
        setProperties(prev => {
            const subCategoryObject = singleCategory?.subCategory.find(
                s => s.name === subCategory
            );
            if(typeof subCategoryObject !== "undefined") {
                prev = subCategoryObject.properties;
            }
            return prev;
        })
    }, [subCategory])


    const changePropertyValues = (value: string, key: string) => {  
        setCategoryProperties((prev: any) => {
            if(Object.keys(prev).includes(key)) {
                delete prev[key];
                const obj = {
                    [key]: value
                }
                return { ...prev, ...obj };
            }
            const obj = {
                [key]: value
            }
            return { ...prev, ...obj };
        })
    }

    useEffect(() => {
        // if(subCategory === productAttribute.subCategory) {
        //     setCategoryProperties(productAttribute.categoryProperties);
        // }
        // else {
            const c = categories.find(c => c._id === category);
            if(typeof c !== "undefined") {
                const s = c.subCategory.find(s => s.name === subCategory);
                if(typeof s !== "undefined") {
                    Object.entries(categoryProperties).map(([key, value]) => {
                        if(
                            Object.keys(s.properties).includes(key) === false
                        ) {
                            const propertyObject: any = categoryProperties;
                            delete propertyObject[key];
                            setCategoryProperties((prev: any) => ({...prev, ...propertyObject}));
                        }
                    })
                }
            }
        // }
        // console.log(properties);
        // console.log(categoryProperties);
        console.log("Check unnecessary Render");    
    }, [changePropertyValues])


    const updateExistingProduct= async (event: React.MouseEvent<HTMLFormElement>, id: string | string[] | undefined) => {       
        event.preventDefault()
        try {
            setIsUpdatingProduct(true);
            let imageArray = images.split(",")
            if(imageArray[imageArray.length - 1] === "") {
                imageArray.pop()
            }

            /** Remember this... */
            /** If last useEffect() hooks causes unnecessary render then uncomment this to prevent unnecessary render and comment that last useEffect() hook. */

            // const c = categories.find(c => c._id === category);
            // if(typeof c !== "undefined") {
            //     const s = c.subCategory.find(s => s.name === subCategory);
            //     if(typeof s !== "undefined") {
            //         Object.entries(categoryProperties).map(([key, value]) => {
            //             if(
            //                 !Object.keys(s.properties).includes(key)
            //             ) {
            //                 delete categoryProperties[key];
            //             }
            //         })
            //     }
            // }
            // console.log(categoryProperties);

            const res = await axios.put(`/api/products/update-product`, {
                id, name, imageArray, description, price, amount, category, subCategory,
                categoryProperties, discount, sellerName, adminId: session?.user._id
            })
            if(res.status === 202 || res.status === 205) {
                toast.success(`${res.data.message} 😊`, {position: "top-center"});
                setTimeout(() => {
                    router.reload();
                }, 500)
            }
        }
        catch(err: any) {
            toast.error(err.message, {position: "top-center"})         
        }
        finally {
            setTimeout(() => {
                setIsUpdatingProduct(false);
            }, 500)
        }
    }

    
    return (
        <Layout>
            <div className="flex justify-between mb-4">
                <h1 className="text-3xl font-semibold underline">
                    Update... {productAttribute.name}
                </h1>
                <Link 
                    href={'/products'} 
                    className="text-gray-500 border-[1.4px] border-gray-400 text-xl font-semibold px-3 py-2 rounded-md no-underline"
                >
                    ← &nbsp;Go Back to Products
                </Link>
            </div>
            <form 
                className="text-lg"
                onSubmit={(event: React.MouseEvent<HTMLFormElement>) => updateExistingProduct(event, id)}
            >
                <label>Name</label>
                <input 
                    type="text" 
                    placeholder="name" 
                    value={name} 
                    onChange={e => setName(e.target.value)}
                    className="mb-4"
                />
                <label>Category</label>
                <select 
                    value={category} 
                    onChange={e => setCategory(e.target.value)}
                >
                    <option value='' className="font-medium text-lg">
                        Select category
                    </option>
                    {categories.map((c, index) => <option key={index} value={c._id}> 
                            {c.name} 
                        </option>
                    )}
                </select>
                <label>SubCategory</label>
                <select
                    value={subCategory}
                    onChange={e => setSubCategory(e.target.value)}
                >
                    <option value='' className="font-medium text-lg">
                        Select subcategory
                    </option>
                    {singleCategory?.subCategory.map((sub_cat, ind) => (
                        <option key={ind} value={sub_cat.name}>
                            {sub_cat.name}
                        </option> 
                    ))}
                </select>
                {
                    Object.entries(properties).map(([key, values]: any, index) => (
                        <div key={index} className="flex items-center justify-between gap-2">
                            <div className="ml-6 w-1/5"> {key} </div>
                            <select className="w-4/5"
                                onChange={e => changePropertyValues(
                                    e.target.value, key
                                )}
                            >
                            {
                                //     subCategory === productAttribute.subCategory
                                //         ?
                                //     <option value={`${productAttribute.categoryProperties[key as keyof typeof productAttribute.categoryProperties]}`}>
                                //     {
                                //         `${productAttribute.categoryProperties[key as keyof typeof productAttribute.categoryProperties]}`
                                //     }
                                //    </option>    
                                //         :
                               Object.keys(categoryProperties).includes(key)
                                    ?
                               <option value={categoryProperties[key]}>
                                    {categoryProperties[key]}
                               </option> 
                                    : 
                                <option value="">
                                    —— Select ——
                               </option> 
                            }
                            {values.map((v: string, ind: number) => {
                                if(categoryProperties[key] === v) {
                                    return;
                                }
                                return <option key={ind} value={v}> 
                                    {v} 
                                </option>
                            })}
                            </select>
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
                <label>Description</label>
                <textarea 
                    placeholder="description" 
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows={7}
                    className="pt-3"
                ></textarea>
                <label>Price (₹)</label>
                <input 
                    type="number" 
                    placeholder="price" 
                    value={price}
                    onChange={e => setPrice(Number(e.target.value))}
                />
                <label>Discount (%)</label>
                <input 
                    type="number"
                    placeholder="discount percentage"
                    value={discount}
                    onChange={e => setDiscount(Number(e.target.value))}
                />
                <label>Quantity</label>
                <input 
                    type="number"
                    placeholder="quantity"
                    value={amount}
                    onChange={e => setAmount(Number(e.target.value))}
                />
                <label>Seller Name</label>
                <input 
                    type="text"
                    placeholder="Seller"
                    value={sellerName}
                    onChange={e => setSellerName(e.target.value)}
                />
                <button 
                    type="submit"
                    className="py-2 px-3 mt-3 text-2xl bg-blue-900 text-gray-200 rounded-sm w-full shadow-md tracking-wide font-semibold hover:bg-blue-700"
                >
                {
                    isUpdatingProduct
                        ?
                    <span className="flex justify-center text-2xl font-semibold">
                        Updating...
                        <ClockLoader color="white" size={25} className="ml-2 mt-[3px]" />
                    </span>
                        :
                    "Update"
                }
                </button>
            </form>
            
            <ViewProduct 
                id={id}
                product={productAttribute}
                fetchProduct={fetchSingleProduct}
            />            
        </Layout>
    )
}