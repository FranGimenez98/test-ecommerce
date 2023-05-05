import Link from 'next/link'
import React from 'react'
import {GiClothes} from 'react-icons/gi';

export default function Navbar() {
  return (
    <div className="w-full h-16 bg-black flex justify-between">
      <div className="md:w-[95vw] m-auto flex items-center justify-between">
        <div className="flex items-center justify-center text-white">
          <Link href="/" className='flex flex-row text-[#8dc572] items-center'>
            <GiClothes size="2rem" className='mr-1'/>
            <div className='flex flex-col leading-3'>
              <span className='text-sm'>E-Commerce</span>
              <span className='text-base'>Clothes Shop</span>
            </div>
          </Link>
        </div>
        <div className="flex items-center justify-center text-white">
          <ul className="flex items-center gap-5">
            <Link href="/products">
              <li>Products</li>
            </Link>
            <li>LINK</li>
            <li>Cart</li>
            <li>User</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
