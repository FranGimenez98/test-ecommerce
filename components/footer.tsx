import Link from "next/link";
import React, { useEffect } from "react";
import { GiClothes } from "react-icons/gi";
import { BsInstagram, BsTwitter } from "react-icons/bs";
import { FaFacebookF } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { ImPhone } from "react-icons/im";
import { GrMail } from "react-icons/gr";

export default function Footer() {
  useEffect(() => {
    const yearElement = document.getElementById("actual-year");
    if (yearElement) {
      yearElement.innerHTML = new Date().getFullYear().toString();
    }
  }, []);

  return (
    <div className="bg-black h-[270px]  md:h-[275px] mt-3">
      <div className="w-[100%] h-[100%] p-6">
        <div className="flex flex-row justify-between mb-4">
          <div className="flex flex-col">
            <Link
              href="/"
              className="flex flex-row text-[#8dc572] items-center h-[35px]"
            >
              <GiClothes size="2rem" className="mr-1" />
              <div className="flex flex-col leading-3">
                <span className="text-sm">E-Commerce</span>
                <span className="text-base">Clothes Shop</span>
              </div>
            </Link>
            <div className="flex flex-col text-white mt-2 text-[12px]">
              <h4>Contactanos</h4>
              <div className="flex items-center">
                <MdLocationOn className="mr-1"/>
                <span>Berazategui. BA Argentina</span>
              </div>
              <div className="flex items-center">
                <ImPhone className="mr-1" />
                <span>+54 11 2524-5289</span>
              </div>
              <div className="flex items-center">
                <ImPhone className="mr-1" />
                <span>+54 11 2524-5289</span>
              </div>
              <div className="flex items-center">
                <GrMail className="mr-1" />
                <span>bazz-devs@gmail.com</span>
              </div>
            </div>
          </div>
          <div className="w-[140px]">
            <div className="text-white flex flex-col text-right text-[12px] md:text-[15px]">
              <Link href="/products" className="hover:text-[#8dc572]">
                <span>Products</span>
              </Link>
              <span>Iniciar sesion</span>
              <span>Quienes Somos</span>
              <span>Contacto</span>
            </div>
          </div>
        </div>
        <div className="border-t border-[#8dc572]"></div>
        <div className="flex flex-row justify-center m-auto mt-[10px] md:mt-[20px]">
          <a
            href="https://www.instagram.com"
            target="_blank"
            className="border-2 border-[#8dc572] rounded-full text-[#8dc572] p-2 w-[36px] md:w-[36px] h-[36px] md:h-[36px] ml-2 mr-2 hover:border-[#fff] hover:text-white"
          >
            <BsInstagram />
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            className="border-2 border-[#8dc572] rounded-full text-[#8dc572] p-2 w-[36px] md:w-[36px] h-[36px] md:h-[36px] ml-2 mr-2 hover:border-[#fff] hover:text-white"
          >
            <FaFacebookF />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            className="border-2 border-[#8dc572] rounded-full text-[#8dc572] p-2 w-[36px] md:w-[36px] h-[36px] md:h-[36px] ml-2 mr-2 hover:border-[#fff] hover:text-white"
          >
            <BsTwitter />
          </a>
        </div>
        <div className="m-auto text-center mt-2">
          <span className="text-white text-[12px]">
            Copyright © <span id="actual-year"></span>. Project developed by
            Bazz
          </span>
        </div>
      </div>
    </div>
  );
}
