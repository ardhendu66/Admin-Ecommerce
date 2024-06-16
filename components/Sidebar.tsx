import Link from "next/link"
import { useRouter } from "next/router"
import { signOut } from "next-auth/react"
import { RiAdminFill } from "react-icons/ri"
import { AiFillHome } from "react-icons/ai"
import { FaCartArrowDown } from "react-icons/fa"
import { BiSolidCategory } from "react-icons/bi"
import { IoClipboard } from "react-icons/io5"
import { IoSettings } from "react-icons/io5"
import { ImUpload2 } from "react-icons/im"
import { IoLogOut } from "react-icons/io5"
import { Dispatch, SetStateAction } from "react"

type Props = {
    showSideBar:boolean, 
    setShowSideBar: Dispatch<SetStateAction<boolean>>
}

export default function Sidebar({showSideBar, setShowSideBar}: Props) {
    const inactiveLink = 'flex gap-1 pl-6 py-2 pr-2 -ml-4'
    const activeLink = `${inactiveLink} bg-sky-600 text-gray-100`
    const inActiveIcon = 'w-6 h-6 mb-1 mr-1'
    const activeIcon = `${inActiveIcon} text-white`
    const router = useRouter()
    const { pathname } = router

    return (
        <aside 
            className={`${!showSideBar && "hidden"} top-0 text-black pl-4 py-4 w-full h-full static md:w-auto md:h-auto transition-all`}
        >
            <Link href={'/dashboard'} className="flex mb-6 ml-8 gap-1 mr-10 text-sky-700">
                <RiAdminFill className="w-6 h-6 text-sky-700"/>
                AdminDashboard
            </Link>
            <nav className="flex flex-col gap-2 text-gray-500">
                <Link href={'/dashboard'} 
                    className={pathname === '/dashboard' ? activeLink : inactiveLink}
                >
                    <AiFillHome className={
                        pathname === '/dashboard' ? activeIcon : inActiveIcon} 
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
                    onClick={() => 
                        signOut({callbackUrl: '/'})
                    }
                >
                    <IoLogOut className="w-6 h-6"/> Logout
                </button>
            </nav>
        </aside>
    );
}