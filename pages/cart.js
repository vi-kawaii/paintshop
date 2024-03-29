import Header from "../components/Header";
import Card from "../components/Card";
import Content from "../components/Content";
import Head from "next/head";
import { useState } from "react";
import Link from "next/link";
import { useEffect } from "react";
import { useAtom } from "jotai";
import data from "../data";
import total from "../utils/total";
import slugify from "slugify";
import cartAtom from "../utils/cart";

export default function Cart() {
  const [cart] = useAtom(cartAtom);
  const [totalPrice, setTotalPrice] = useState(0);
  const [mount, setMount] = useState(false);

  useEffect(() => {
    setTotalPrice(total(cart));
  }, [cart]);

  useEffect(() => {
    setMount(true);
  }, []);

  return (
    <>
      <Header />
      <Content>
        <Head>
          <title>Корзина</title>
        </Head>
        <div>
          <div className="fixed bg-[#121212] bottom-0 left-0 right-0 z-10 text-3xl">
            <div className="max-w-screen-lg mx-auto p-4 flex items-center justify-between">
              <span className="font-bold">{totalPrice} ₽</span>
              <Link href="/order">
                <a className="bg-blue-500 px-4 py-2 rounded-xl text-lg">
                  Заказать
                </a>
              </Link>
            </div>
          </div>
        </div>
        {mount &&
          (cart.length === 0 ? (
            <div className="text-center mt-48 text-xl">
              Корзина пуста. Добавьте любой товар из{" "}
              <Link href="/">
                <a className="text-blue-500">каталога</a>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-500">
              {cart.map(({ name }, i) => (
                <Card
                  image={
                    data.products.find(
                      (p) => name === slugify(p.name).toLowerCase()
                    ).image
                  }
                  key={i}
                  name={
                    data.products.find(
                      (p) => name === slugify(p.name).toLowerCase()
                    ).name
                  }
                  price={
                    data.products.find(
                      (p) => name === slugify(p.name).toLowerCase()
                    ).price
                  }
                  forCart
                />
              ))}
            </div>
          ))}
        <div className="h-16"></div>
      </Content>
    </>
  );
}
