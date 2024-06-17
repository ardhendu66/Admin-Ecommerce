import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "@/components/Layout";
import { BounceLoader, ClipLoader } from "react-spinners";

interface OrderType {
    _id: string,
    items: Object[],
    name: string,
    phoneNumber: string,
    email: string,
    city: string,
    pinCode: string,
    streetAddress: string,
    paid: string,
    createdAt: Date,
    updatedAt: Date,
    __v: number
}
const defaultOrder: OrderType[] = [{
    _id: "",
    items: [],
    name: "",
    phoneNumber: "",
    email: "",
    city: "",
    pinCode: "",
    streetAddress: "",
    paid: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    __v: 0,
}]


export default function Orders() {
    const [showMessage, setShowMessage] = useState("")
    const [orders, setOrders] = useState<OrderType[]>(defaultOrder)
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function getOrders() {
            setIsLoading(true);
            try {
                const res = await axios.get('/api/orders/get-orders');
                if(res.status === 202) {
                    setShowMessage("No Orders found");
                }
                else if(res.status === 200) {
                    setOrders(res.data)
                    console.log(res.data);                    
                }
            }
            catch(err) {
                console.error(err);                
            }
            finally {
                setTimeout(() => {
                    setIsLoading(false);
                }, 1500)
            }
        }
        getOrders();
    }, [])

    return (
        <Layout>
            <h1 className="text-4xl uppercase underline">Orders</h1>
            <div 
                className="flex items-center justify-between bg-sky-600 w-full text-2xl font-bold text-white mb-3 rounded-sm"
            >
                <div className="text-start w-[20%] ml-2 py-2">Date</div>
                <div className="text-start w-[10%] py-2">Paid?</div>
                <div className="text-start w-[37%]">Recipients</div>
                <div className="text-start w-[28%]">Product</div>
            </div>
            <div>
            {
                isLoading
                    ?
                <div 
                    className="flex items-center justify-around bg-gray-200 w-full text-2xl font-bold text-white mb-3 rounded-sm p-6"
                >
                    <div className="w-1/3">
                        <BounceLoader 
                            color="#1b6ea5"
                            size={60}
                            speedMultiplier={2}
                            loading={isLoading}
                        />
                    </div>
                    <div className="w-1/3">
                        <BounceLoader 
                            color="#1b6ea5"
                            size={60}
                            speedMultiplier={2}
                            loading={isLoading}
                        />
                    </div>
                    <div className="w-1/3">
                        <BounceLoader 
                            color="#1b6ea5"
                            size={60}
                            speedMultiplier={2}
                            loading={isLoading}
                        />
                    </div>
                </div>
                    :
                orders && orders?.map((order, index) => (
                    <div 
                        key={index} 
                        className="flex justify-between text-lg font-semibold bg-gray-200 w-full mb-4 p-5 rounded-md"
                    >
                        <div className="text-start w-[20%]">
                            {String((new Date(order.createdAt)).toLocaleString())}
                        </div>
                        <div className="text-start w-[10%]">
                        {
                            order.paid
                                ?
                            <span>YES</span>
                                :
                            <span>NO</span>
                        }
                        </div>
                        <div className="flex flex-col justify-start items-start w-[37%]">
                            <div className="flex">
                                <span className="text-sky-600 mr-2">Name</span>-
                                <span className="text-gray-600 ml-2">{order.name}</span>
                            </div>
                            <div className="flex">
                                <span className="text-sky-600 mr-2">Phone</span>-
                                <span className="text-gray-600 ml-2">{order.phoneNumber}</span>
                            </div>
                            <div className="flex">
                                <span className="text-sky-600 mr-2">Email</span>-
                                <span className="text-gray-600 ml-2">{order.email}</span>
                            </div>
                            <div className="flex">
                                <span className="text-sky-600 mr-2">City</span>-
                                <span className="text-gray-600 ml-2">{order.city}</span>
                            </div>
                            <div className="flex">
                                <span className="text-sky-600 mr-2">PIN Code</span>-
                                <span className="text-gray-600 ml-2">{order.pinCode}</span>
                            </div>
                            <div className="flex">
                                <span className="text-sky-600 mr-2">Street</span>-
                                <span className="text-gray-600 ml-2">{order.streetAddress}</span>
                            </div>
                        </div>
                        <div className="text-center pr-2 w-[28%]">
                        {
                            order.items.map((item: any, ind) => (
                                <div key={ind} className="flex justify-between items-start flex-col">
                                    <div className="flex">
                                        <span className="text-sky-600 mr-1">
                                            Name
                                        </span>-
                                        <span className="text-gray-600 ml-1">
                                        { item.price_data?.product_data.name }
                                        </span>
                                    </div>
                                    <div className="flex">
                                        <span className="text-sky-600 mr-1">
                                            Total Paid
                                        </span>-
                                        <span className="text-gray-600 ml-1">₹
                                        { item.price_data?.unit_amount / 100 }
                                        </span>
                                    </div>
                                    <div className="flex">
                                        <span className="text-sky-600 mr-1">
                                            Quantity :
                                        </span>
                                        <span className="text-gray-600 ml-1 px-2 border-black border-[1.7px] rounded">
                                        { item.quantity }
                                        </span>
                                    </div>
                                </div>
                            ))
                        }
                        </div>
                    </div>
                ))
            }
            </div>
        </Layout>
    )
}