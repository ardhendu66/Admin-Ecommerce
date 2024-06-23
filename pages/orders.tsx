import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "@/components/Layout";
import { BounceLoader, ClipLoader } from "react-spinners";
import { HiBadgeCheck } from "react-icons/hi";
import { MdCancel } from "react-icons/md";
import { IoMdSend } from "react-icons/io";

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
    const [orders, setOrders] = useState<OrderType[]>([])
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
                <div className="text-start w-[27%] ml-2 py-2">Date & id</div>
                <div className="text-start w-[6%] py-2">Paid?</div>
                <div className="text-start w-[31%]">Recipients</div>
                <div className="text-start w-[20%]">Product</div>
                <div className="text-center w-[15%]">Send Email</div>
            </div>
            <div>
            {
                isLoading
                    ?
                <div 
                    className="flex items-center justify-around bg-gray-200 w-full text-2xl font-bold text-white mb-3 rounded-sm p-6 border-black border-[1.5px]"
                >
                    <div className="w-[27%]">
                        <BounceLoader 
                            color="#1b6ea5"
                            size={60}
                            speedMultiplier={2}
                            loading={isLoading}
                        />
                    </div>
                    <div className="w-[6%]">
                        <BounceLoader 
                            color="#1b6ea5"
                            size={60}
                            speedMultiplier={2}
                            loading={isLoading}
                        />
                    </div>
                    <div className="w-[31%]">
                        <BounceLoader 
                            color="#1b6ea5"
                            size={60}
                            speedMultiplier={2}
                            loading={isLoading}
                        />
                    </div>
                    <div className="w-[25%]">
                        <BounceLoader 
                            color="#1b6ea5"
                            size={60}
                            speedMultiplier={2}
                            loading={isLoading}
                        />
                    </div>
                    <div className="w-[11%]">
                        <BounceLoader 
                            color="#1b6ea5"
                            size={60}
                            speedMultiplier={2}
                            loading={isLoading}
                        />
                    </div>
                </div>
                    :
                orders.length > 0
                    ?
                orders?.map((order, index) => (
                    <div 
                        key={index} 
                        className="flex justify-between text-lg font-semibold bg-gray-200 w-full mb-4 p-5 rounded-md border-black border-[1.5px]"
                    >
                        <div className="flex flex-col w-[27%]">
                            <div className="text-gray-500">
                                {String((new Date(order.createdAt)).toLocaleString())}
                            </div>
                            <div>
                                <span className="italic">Id - </span>
                                <span className="text-gray-500 font-bold"> 
                                    {order._id} 
                                </span>
                            </div>
                        </div>
                        <div className="text-start w-[6%] mr-3">
                        {
                            order.paid
                                ?
                            <HiBadgeCheck className="w-12 h-12 text-green-600" />
                                :
                            <MdCancel
                                className="w-10 h-10 bg-red-500 rounded-full text-white" 
                            />
                        }
                        </div>
                        <div className="flex flex-col justify-start items-start w-[32%]">
                            <div className="flex">
                                <span className="text-sky-600 mr-2">Name</span>-
                                <span className="text-gray-600 ml-2">{order?.name}</span>
                            </div>
                            <div className="flex">
                                <span className="text-sky-600 mr-2">Phone</span>-
                                <span className="text-gray-600 ml-2">{order?.phoneNumber}</span>
                            </div>
                            <div className="flex">
                                <span className="text-sky-600 mr-2">Email</span>-
                                <span className="text-gray-600 ml-2">{order?.email}</span>
                            </div>
                            <div className="flex">
                                <span className="text-sky-600 mr-2">City</span>-
                                <span className="text-gray-600 ml-2">{order?.city}</span>
                            </div>
                            <div className="flex">
                                <span className="text-sky-600 mr-2">PIN Code</span>-
                                <span className="text-gray-600 ml-2">{order?.pinCode}</span>
                            </div>
                            <div className="flex">
                                <span className="text-sky-600 mr-2">Street</span>-
                                <span className="text-gray-600 ml-2">
                                    {order?.streetAddress}
                                </span>
                            </div>
                        </div>
                        <div className="text-center pr-2 w-[27%]">
                        {
                            order.items.length > 0 && order?.items.map((item: any, ind) => (
                                <div key={ind} className="flex justify-between items-start flex-col">
                                    <div className="flex">
                                        <span className="text-sky-600 mr-1">
                                            Name
                                        </span>-
                                        <span className="text-gray-600 ml-1">
                                        { item.price_data?.product_data?.name }
                                        </span>
                                    </div>
                                    <div className="flex">
                                        <span className="text-sky-600 mr-1">
                                            Amount
                                        </span>-
                                        <span className="text-gray-600 ml-1">
                                            ₹{ item.price_data?.unit_amount / 100 }
                                        </span>
                                    </div>
                                    <div className="flex">
                                        <span className="text-sky-600 mr-1">
                                            Quantity :
                                        </span>
                                        <span 
                                            className="bg-gray-400 text-white ml-1 px-2 rounded-full"
                                        >
                                            { item.quantity }
                                        </span>
                                    </div>
                                </div>
                            ))
                        }
                        </div>
                        <div className="w-[8%] flex flex-col justify">
                            <IoMdSend 
                                className="w-10 h-10 text-blue-800 mb-6 ml-4 hover:cursor-pointer"
                            />
                            {/* <ClipLoader 
                                size={40}
                                color="#0369A1"
                                className="ml-4 mb-6"
                            /> */}
                            <div className="flex justify-evenly">
                                <p className="text-gray-500">Done</p>
                                <div 
                                    className="w-6 h-6 border-[1.5px] border-black rounded"
                                >

                                </div>
                            </div>
                        </div>
                    </div>
                ))
                    :
                <div className="text-center font-semibold text-xl">No Orders found</div>
            }
            </div>
        </Layout>
    )
}