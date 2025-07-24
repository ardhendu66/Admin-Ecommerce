import { useState, useEffect } from "react";
import Link from "next/link"
import { useRouter } from "next/router"
import { signOut } from "next-auth/react"
import { withSwal } from "react-sweetalert2"
import { AiFillHome } from "react-icons/ai"
import { FaCartArrowDown } from "react-icons/fa"
import { BiSolidCategory } from "react-icons/bi"
import { IoClipboard } from "react-icons/io5"
import { IoSettings } from "react-icons/io5"
import { ImUpload2 } from "react-icons/im"
import { IoLogOut } from "react-icons/io5"
import { GiHamburgerMenu } from "react-icons/gi";
import { RxCross1 } from "react-icons/rx";
import { RiAdminFill } from "react-icons/ri";
import { toast } from "react-toastify";

const SidebarComponent = ({swal}: any) => {
    const [showSideBar, setShowSideBar] = useState(false);
    const inactiveLink = 'flex gap-1 pl-8 py-2 pr-2 -ml-4'
    const activeLink = `${inactiveLink} bg-sky-600 text-gray-100`
    const inActiveIcon = 'w-6 h-6 mb-1 mr-1'
    const activeIcon = `${inActiveIcon} text-white`
    const router = useRouter()
    const { pathname } = router

    useEffect(() => {
        setShowSideBar(
          window.localStorage.getItem("openSideBar") === "1" ? true : false
        );
    }, []);
    
    useEffect(() => {
        window.localStorage.setItem("openSideBar", showSideBar ? "1" : "0");
    }, [showSideBar]);

    const confirmLogoutAction = () => {
        swal.fire({
            title: 'Are you sure ?',
            text: `Do you want to Log-out ?`,
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: `Log-out 🔐`,
            confirmButtonColor: "#0EA5E9",
            reverseButtons: true,
        })
        .then((res: any) => {
            if(res.isConfirmed) {
                signOut({callbackUrl: '/'})
                .then(res => {
                    toast.success("Logged-out successfully", { position: "top-center" })
                })
            }
        })
        .catch((err: any) => {
            swal.fire(err.message, '', 'error')
        })
    }

    return (
        <aside 
            className={`sticky top-0 text-black pl-4 py-4 w-full h-full md:w-auto md:h-auto transition-all ${!showSideBar && "max-md:h-[88px]"}`}
        >
            <div
                className={`${!showSideBar && "bg-white w-full"} bg-bgGray text-black cursor-pointer rounded-full`}
                onClick={() => setShowSideBar(!showSideBar)}
            >
                {
                    showSideBar ? (
                        <div className="flex items-center justify-center w-10 h-10 border-gray-400 border-[1.4px] p-1 bg-white rounded">
                            <RxCross1 
                                className="w-8 h-8 rounded-full bg-transparent text-gray-500" 
                            />
                        </div>
                    ) 
                    : (
                        <div className="flex w-full bg-bgGray pb-1 flex-col">
                            <div className="border-gray-400 border-[1.4px] px-1 mt-2 ml-1 bg-white rounded w-12 h-12 flex items-center justify-center">
                                <GiHamburgerMenu className="w-10 h-10 text-gray-500" />
                            </div>
                        </div>
                    )
                }
            </div>
            <nav className={`flex flex-col text-gray-500 text-xl ${!showSideBar && "hidden"} -mr-2 font-semibold gap-y-2`}>
                <Link href={'/dashboard'} className="flex -mt-8 mb-6 ml-12 gap-1 mr-2 text-sky-700">
                    <RiAdminFill className="w-6 h-6 text-sky-700"/>
                    EcomstoreAdmin
                </Link>
                <Link href={'/dashboard'} 
                    className={pathname === '/dashboard' ? activeLink : inactiveLink}
                >
                    <AiFillHome 
                        className={pathname === '/dashboard' ? activeIcon : inActiveIcon} 
                    /> 
                    Dashboard
                </Link>
                <Link 
                    href={'/products'} 
                    className={pathname.includes('/products') ? activeLink : inactiveLink}
                >
                    <FaCartArrowDown className={pathname.includes('/products') ? activeIcon : inActiveIcon} /> 
                    Products
                </Link>
                <Link 
                    href={'/categories'} 
                    className={pathname.includes('/categories') ? activeLink : inactiveLink}
                >
                    <BiSolidCategory className={pathname.includes('/categories') ? activeIcon : inActiveIcon} /> Categories
                </Link>
                <Link 
                    href={'/orders'} 
                    className={pathname.includes('/orders') ? activeLink : inactiveLink}
                >
                    <IoClipboard className={pathname.includes('/orders') ? activeIcon : inActiveIcon}/> Orders
                </Link>
                <Link 
                    href={'/settings'} 
                    className={pathname.includes('/settings') ? activeLink : inactiveLink}
                >
                    <IoSettings className={pathname.includes('/settings') ? activeIcon : inActiveIcon}/> 
                    Settings
                </Link>
                <Link 
                    href={'/upload'} 
                    className={pathname.includes('/upload') ? activeLink : inactiveLink}
                >
                    <ImUpload2 className={pathname.includes('/upload') ? activeIcon : inActiveIcon}/> 
                    Upload
                </Link>
                <button type="button" className={`text-gray-500 ${inactiveLink}`} 
                    onClick={confirmLogoutAction}
                >
                    <IoLogOut className="w-6 h-6"/> Logout
                </button>
            </nav>
        </aside>
    );
}

const Sidebar = withSwal(({swal}: any, ref: any) => <SidebarComponent swal={swal} />);

export default Sidebar;