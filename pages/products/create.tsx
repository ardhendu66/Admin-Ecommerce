import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from 'react-toastify';
import Layout from "@/components/Layout";
import { CategoryClass } from "@/config/CategoryTypes";

export default function Create() {
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
    const [categoryProperties, setCategoryProperties] = useState<Object>({});
    const [properties, setProperties] = useState<Object>({});
    const router = useRouter();
    const { data: session } = useSession();

    const fetchCategories = () => {
        axios.get<CategoryClass[]>('/api/categories/get')
        .then(res => {
            setCategories(res.data)
        })
        .catch(err => {
            console.error(err.message)
            toast.error(err.message)       
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

    const createNewProduct = async (event: React.MouseEvent<HTMLFormElement>) => {
        event.preventDefault();
        if(name && description && price && images && amount && session?.user._id) {
            try {
                let imageArray = images.split(",")
                if(imageArray[imageArray.length - 1] === "") {
                    imageArray.pop()
                }
                const res = await axios.post(`/api/products/create-product`, {
                    name, images: imageArray, description, price, discount, amount, category,
                    subCategory, categoryProperties, sellerName, adminId: session.user._id
                })
                if(res.status === 201) {
                    toast.success(res.data.message, { position:"top-center" })
                    // router.push('/products')
                }
            }
            catch(err: any) {
                console.error(err.message)              
                toast.info(err.message, {position:"top-center"})      
            }
        }
        else {
            toast.info('Please fill all the details', { position: "top-center" })
        }
    }

    const changePropertyValues = (value: string, key: string) => {        
        setCategoryProperties(prev => {
            const obj = {
                [key]: value
            }
            return { ...prev, ...obj };
        })
    }


    return (
        <Layout>
            <form 
                onSubmit={(event: React.MouseEvent<HTMLFormElement>) => createNewProduct(event)}
            >
                <h1 className="text-3xl font-semibold underline">New Product Creation</h1>
                <label>Name</label>
                <input 
                    type="text" 
                    placeholder="name" value={name} 
                    onChange={e => setName(e.target.value)}
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
                    (typeof properties !== "undefined" || properties !== null) 
                        &&
                    Object.entries(properties).map(([key, values]: any, index) => (
                        <div key={index} className="flex items-center justify-between gap-2">
                            <div className="ml-6 w-1/5"> {key} </div>
                            <select className="w-4/5 text-lg font-bold"
                                onChange={e => changePropertyValues(
                                    e.target.value, key
                                )}
                            >
                                <option value=""> — Select {key} options — </option>
                            {values.map((v: string, ind: number) => (
                                <option 
                                    key={ind} 
                                    value={v} 
                                    className={`${ind%2 === 0 ? "bg-gray-200" : "bg-gray-300"} text-lg font-bold`}
                                > {v} </option>
                            ))}
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
                    rows={7}
                    placeholder="description" 
                    value={description}
                    onChange={e => setDescription(e.target.value)}
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
                    className="p-2 px-3 mt-3 text-2xl font-semibold bg-blue-900 text-gray-200 rounded-sm w-full"
                >
                    Create New Product
                </button>
            </form>
        </Layout>
    )
}