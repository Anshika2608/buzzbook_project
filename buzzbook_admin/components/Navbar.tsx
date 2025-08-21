import React from 'react'
import Link from "next/link";
const Navbar = () => {
    const list = [
        { name: "Dashboard", link: "/dashboard" },
        { name: "Theater", link: "/theater" },
        { name: "Movies", link: "/movie" },
        { name: "Snacks", link: "/snacks" },
        { name: "events", link: "/events" },
        { name: "bookings", link: "/bookings" },
        { name: "Users", link: "/users" },

    ]
    return (
        <div className='text-white w-64 '>
            <img
                src="/buzz-1.png"
                alt="Logo"
                className="h-20 min-h-[5rem] w-auto object-contain"
            />
            <ul className='flex flex-col gap-4 p-4 justify-center pt-8'>
                {
                    list.map((item, index) => {
                        return (
                            <li key={index} className='text-lg font-semibold hover:bg-purple-600  cursor-pointer pt-1 h-10 rounded-2xl transition-colors duration-200 pl-5'>
                                <Link href={item.link} >{item.name}</Link>
                            </li>)
                    })
                }

            </ul>
        </div>
    )
}

export default Navbar