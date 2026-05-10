import React from 'react'
import { MdCastForEducation } from "react-icons/md";
import { SiOpenaccess } from "react-icons/si";
import { FaSackDollar } from "react-icons/fa6";
import { BiSupport } from "react-icons/bi";
import { FaUsers } from "react-icons/fa";

function Logos() {
    const items = [
        { icon: <MdCastForEducation className='w-8 h-8 text-[var(--neon-blue)]' />, text: "20k+ Online Courses" },
        { icon: <SiOpenaccess className='w-8 h-8 text-[var(--neon-purple)]' />, text: "Lifetime Access" },
        { icon: <FaSackDollar className='w-8 h-8 text-yellow-400' />, text: "Value For Money" },
        { icon: <BiSupport className='w-8 h-8 text-green-400' />, text: "Lifetime Support" },
        { icon: <FaUsers className='w-8 h-8 text-red-400' />, text: "Community Support" },
    ];

    return (
        <div className='w-full py-10 flex items-center justify-center flex-wrap gap-6 px-4'>
            {items.map((item, index) => (
                <div key={index} className='flex items-center justify-center gap-3 px-6 py-4 rounded-full glass hover:bg-white/10 transition-colors cursor-pointer border border-white/5 shadow-lg'>
                    {item.icon}
                    <span className='text-gray-200 font-medium text-sm md:text-base'>{item.text}</span>
                </div>
            ))}
        </div>
    )
}

export default Logos
