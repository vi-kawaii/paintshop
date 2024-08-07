import Link from "next/link";
import { ShoppingBagIcon } from "@heroicons/react/outline";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import cartAtom from "../utils/cart";

export default function Header() {
  const [cart] = useAtom(cartAtom);
  const [mount, setMount] = useState(false);

  useEffect(() => {
    setMount(true);
  }, []);

  return (
    <div className="flex justify-center">
      <header className="p-4 pt-3 flex items-center justify-between bg-black w-full max-w-screen-lg z-10 fixed justify-between items-center">
        <Link href="/">
          <a>
            <h1 className="text-3xl font-bold">ПромТехКраски</h1>
          </a>
        </Link>
        {mount && cart.length > 0 ? (
          <Link href="/cart">
            <a>
              <div className="relative">
                <span className="absolute -top-1 -right-1 bg-blue-500 w-5 h-5 text-sm flex justify-center items-center rounded-full">
                  {cart.length}
                </span>
                <ShoppingBagIcon className="w-6 h-6" />
              </div>
            </a>
          </Link>
        ) : (
          <Link href="/cart">
            <a>
              <ShoppingBagIcon className="w-6 h-6" />
            </a>
          </Link>
        )}
      </header>
      <div className="h-12"></div>
    </div>
  );
}
