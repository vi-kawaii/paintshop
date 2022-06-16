import Header from "../components/Header";
import Card from "../components/Card";
import Content from "../components/Content";
import Head from "next/head";
import { useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import fetcher from "../utils/fetcher";
import { useEffect } from "react";
import { getCookie, setCookies } from "cookies-next";
import { CardSkeleton } from "../components/Card";
import { InformationCircleIcon } from "@heroicons/react/outline";
import client, { urlFor } from "../client";
import slugify from "slugify";

export default function Cart({ contacts }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);

  const { data, mutate } = useSWR(
    getCookie("cart") ? "/api/cart" : null,
    fetcher
  );

  function onRemoveFromCart(publicId) {
    mutate(() => {
      const filteredIds = JSON.parse(getCookie("cart")).filter(
        (p) => p !== publicId
      );
      setCookies("cart", JSON.stringify(filteredIds));
      const filteredProducts = products.filter((p) => p._id !== publicId);
      setProducts(filteredProducts);
      return filteredProducts;
    }, false);
  }

  useEffect(() => {
    if (!getCookie("cart")) {
      setLoading(false);
    }

    if (data) {
      setTotalPrice(data.reduce((a, b) => a + Number(b.price), 0));
      setProducts(data);
      setLoading(false);
    }
  }, [data]);

  return (
    <Content>
      <Head>
        <title>Корзина</title>
      </Head>
      <Header />
      <div>
        <p className="text-3xl">
          Итого: <span className="font-bold">{totalPrice} ₽</span>
        </p>
        <div className="alert shadow-lg my-5">
          <div>
            <InformationCircleIcon className="stroke-info flex-shrink-0 h-6 w-6" />
            <span>
              Чтобы заказать товары, напишите нам на почту{" "}
              <a
                className="link link-primary"
                href={`mailto:${
                  contacts.find((c) => c.name === "Email").value
                }`}
              >
                {contacts.find((c) => c.name === "Email").value}
              </a>
              . В тексте письма укажите товары, которые вы хотите приобрести.
            </span>
          </div>
        </div>
      </div>
      {loading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      )}
      {!loading && !products.length && (
        <div className="text-center mt-24">
          Корзина пуста. Добавьте любой товар из{" "}
          <Link href="/">
            <a className="link link-primary">каталога</a>
          </Link>
        </div>
      )}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map(({ name, price, photo, _id }) => (
          <Card
            src={urlFor(photo).width(500).url()}
            cart
            key={_id}
            title={name}
            price={price}
            href={`/product/${_id}/${slugify(name)}`}
            publicId={_id}
            onRemoveFromCart={onRemoveFromCart}
          />
        ))}
      </div>
    </Content>
  );
}

export async function getStaticProps() {
  const contacts = await client.fetch(`*[_type == "contacts"]`);

  return {
    props: { contacts },
    revalidate: 60,
  };
}
