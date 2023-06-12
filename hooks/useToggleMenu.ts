import { useState, useEffect, useRef, RefObject } from "react";

export default function useDropdownMenu<T extends HTMLElement>(
  initialState: boolean
) {
  const [showMenu, setShowMenu] = useState(initialState);
  const [showProducts, setShowProducts] = useState(initialState);
  const [showMenuMobile, setShowMenuMobile] = useState(initialState);
  const ref = useRef<T>(null);

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        setShowMenu(false);
        setShowProducts(false);
        setShowMenuMobile(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  function toggleMenu() {
    setShowMenu(!showMenu);
  }

  function toggleProducts() {
    setShowProducts(!showProducts);
  }

  function toggleMenuMobile() {
    setShowMenuMobile(!showMenuMobile);
  }

  return {
    showMenu,
    showProducts,
    showMenuMobile,
    toggleMenu,
    toggleProducts,
    toggleMenuMobile,
    ref,
  };
}
