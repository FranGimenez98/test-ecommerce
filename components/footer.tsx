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
    <footer className="bg-white min-h-[270px]  md:h-[275px] border-t-[1px] border-b-slate-200 mt-[5rem] flex flex-col justify-center items-center py-4">
      <div className="w-full md:w-[80%] h-[100%]">
        <div className="flex flex-col md:flex-row md:justify-between justify-center items-center mb-4">
          <div className="hidden md:flex flex-col">
            <div className="flex flex-col text-black gap-1">
              <h4 className="text-lg font-medium">Contact</h4>
              <div className="flex items-center">
                <MdLocationOn className="mr-1" />
                <span className="text-sm">Berazategui. BA Argentina</span>
              </div>
              <div className="flex items-center">
                <ImPhone className="mr-1" />
                <span className="text-sm">+54 11 2524-5289</span>
              </div>
              <div className="flex items-center">
                <ImPhone className="mr-1" />
                <span className="text-sm">+54 11 2524-5289</span>
              </div>
              <div className="flex items-center">
                <GrMail className="mr-1" />
                <span className="text-sm">bazz-devs@gmail.com</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1 text-center md:text-start">
            <h4 className="text-xl md:text-lg font-medium ">About</h4>
            <Link href="/products">
              <span className="text-lg md:text-sm ">Products</span>
            </Link>
            <Link href="/login">
              <span className="text-lg md:text-sm ">Iniciar sesion</span>
            </Link>
            <span className="text-lg md:text-sm ">Quienes Somos</span>
            <span className="text-lg md:text-sm ">Contacto</span>
          </div>

          <div className="flex flex-col w-[23%]">
            <h4 className="hidden md:block text-lg font-medium">
              Social Media
            </h4>
            <p className="hidden md:block text-sm">
              Follow us on social media to find out the latest updates on our
              progress
            </p>
            <div className="flex gap-5 items-center mt-4 justify-center md:justify-start">
              <a
                href="https://www.instagram.com"
                target="_blank"
                className="text-2xl md:text-xl text-gray-800"
              >
                <BsInstagram />
              </a>

              <a
                href="https://facebook.com"
                target="_blank"
                className="text-2xl md:text-xl text-gray-800"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                className="text-2xl md:text-xl text-gray-800"
              >
                <BsTwitter />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-300 w-[80%]"></div>
      <div className="flex flex-row justify-center m-auto mt-[10px]">
        <Link
          href="/"
          className="flex flex-row text-black items-center h-[35px]"
        >
          <span>👕</span>
          <div className="flex flex-col leading-3">
            <span className="text-xl font-semibold">Bazz</span>
          </div>
        </Link>
      </div>
      <div className="m-auto text-center mt-2">
        <span className="text-black text-[12px]">
          Copyright © <span id="actual-year"></span>. Project developed by Bazz
        </span>
      </div>
    </footer>
  );
}
