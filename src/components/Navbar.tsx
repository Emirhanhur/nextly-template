"use client";
import Link from "next/link";
import ThemeChanger from "./DarkSwitch";
import Image from "next/image"
import { Disclosure, Menu } from "@headlessui/react";
import { useEffect, useState, useRef } from "react";
import CartWidget from "./CartWidget";
import { Container } from "./Container";

// Kategori tipi
interface Category {
  id: number;
  title: string;
  image?: any;
}

export const Navbar = () => {
  const navigation = [
    { label: "Anasayfa", path: "/" },

    { label: "Satıştaki Ürünlerimiz", path: "/product", dropdown: true },
    //{ label: "Özellikler", path: "/features" },
    //{ label: "Fiyatlandırma", path: "/pricing" },
    { label: "Kategoriler", path: "/categories" },
    
    { label: "İletişim", path: "/contact" },
    
    //{ label: "Şirket", path: "/company" },
  //  { label: "Blog", path: "/blog" },
  ];

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownTimeout = useRef<NodeJS.Timeout | null>(null);
  const [userInfo, setUserInfo] = useState<{ name?: string; email?: string } | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");
      setIsLoggedIn(!!token || !!user);
      if (user) {
        try {
          const parsed = JSON.parse(user);
          setUserInfo({ name: parsed.name, email: parsed.email });
        } catch {}
      } else {
        setUserInfo(null);
      }
    }
  }, []);

  // Satış kategorilerini çek
  useEffect(() => {
    fetch("http://localhost:3001/api/sales-categories?limit=1000")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCategories(data as Category[]);
        else if (Array.isArray(data?.docs)) setCategories(data.docs as Category[]);
        else setCategories([]);
      })
      .catch(() => setCategories([]));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    window.location.href = "/login";
  };

  // Dropdown mouse events
  const handleDropdownEnter = () => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setDropdownOpen(true);
  };
  const handleDropdownLeave = () => {
    dropdownTimeout.current = setTimeout(() => setDropdownOpen(false), 150);
  };

  return (
    <div className=" rounded-xl h-full bg-transparent h-20 dark:bg-transparent shadow-md w-full border-b border-gray-200 dark:border-gray-800 backdrop-blur-md bg-opacity-60 sticky top-0 z-[999]">
      <nav className=" max-w-7xl mx-auto px-4 md:px-8  w-full h-full bg-transparent backdrop-blur-md bg-opacity-60">
        <div className="   flex flex-wrap items-center justify-between p-4 md:p-6 lg:justify-between xl:px-1">
          {/* Logo  */}
          <Link href="/">
            <span className="flex items-center space-x-2 text-2xl font-medium text-indigo-500 dark:text-gray-100">
                <span>
                <Image
                    src="/img/roinmax.svg"
                    alt="Powered by Vercel"
                    width="212"
                    height="44"
                    color="blue"
                  />
                </span>
            </span>
          </Link>

          {/* get started  */}
          <div className="gap-3 nav__item mr-2 lg:flex ml-auto lg:ml-0 lg:order-2">
              <ThemeChanger />
              <div className="hidden mr-3 lg:flex nav__item">
                {isLoggedIn ? (
                  <Menu as="div" className="relative inline-block text-left">
                    <Menu.Button className="flex items-center gap-2 px-3 py-2 bg-indigo-100 hover:bg-indigo-200 rounded-full focus:outline-none transition-all duration-300 shadow-sm hover:shadow-xl hover:scale-105">
                      <span className="w-8 h-8 flex items-center justify-center bg-indigo-500 text-white rounded-full font-bold text-lg transition-all duration-300 shadow hover:shadow-lg hover:scale-110">
                        {userInfo?.name ? userInfo.name[0].toUpperCase() : "U"}
                      </span>
                    </Menu.Button>
                    <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 rounded-xl shadow-lg focus:outline-none z-50 animate-fade-in">
                      <div className="px-4 py-3">
                        <div className="font-semibold text-gray-900 dark:text-white">{userInfo?.name || "Kullanıcı"}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-300">{userInfo?.email || "-"}</div>
                      </div>
                      <div className="py-1">
                        <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-gray-700 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-md">
                          Profilim
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-gray-700 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-md"
                        >
                          Çıkış Yap
                        </button>
                      </div>
                    </Menu.Items>
                  </Menu>
                ) : (
                  <Link href="/login" className="px-6 py-2 text-white bg-indigo-600 rounded-full md:ml-5 transition-all duration-300 hover:bg-indigo-700 hover:scale-105 hover:shadow-lg">
                    Giriş Yap
                  </Link>
                )}
              </div>
              <CartWidget />
          </div>
                
          <Disclosure>
            {({ open }) => (
              <>
                  <Disclosure.Button
                    aria-label="Toggle Menu"
                    className="4 w-100 px-2 py-1 text-gray-500 rounded-md lg:hidden hover:text-indigo-500 focus:text-indigo-500 focus:bg-indigo-100 focus:outline-none dark:text-gray-300 dark:focus:bg-trueGray-700">
                    <svg
                      className="w-6 h-6 fill-current"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24">
                      {open && (
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
                        />
                      )}
                      {!open && (
                        <path
                          fillRule="evenodd"
                          d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
                        />
                      )}
                    </svg>
                  </Disclosure.Button>

                  <Disclosure.Panel className="flex flex-wrap w-full my-5 lg:hidden">
                    <>
                      {navigation.map((item, index) => (
                        <Link key={index} href={item.path} className="w-full px-4 py-2 -ml-4 text-gray-500 rounded-full dark:text-gray-300 hover:text-indigo-500 hover:bg-indigo-100 dark:hover:bg-gray-800 focus:text-indigo-500 focus:bg-indigo-100 dark:focus:bg-gray-800 focus:outline-none transition-all duration-300 hover:scale-105 hover:shadow-md">
                            {item.label}
                        </Link>
                      ))}
                      {isLoggedIn ? (
                        <button
                          onClick={handleLogout}
                          className="w-full px-6 py-2 mt-3 text-center text-white bg-indigo-600 rounded-full lg:ml-5 transition-all duration-300 hover:bg-indigo-700 hover:scale-105 hover:shadow-lg"
                        >
                          Çıkış Yap
                        </button>
                      ) : (
                        <Link href="/login" className="w-full px-6 py-2 mt-3 text-center text-white bg-indigo-600 rounded-full lg:ml-5 transition-all duration-300 hover:bg-indigo-700 hover:scale-105 hover:shadow-lg">
                          Giriş Yap
                        </Link>
                      )}
                    </>
                  </Disclosure.Panel>
              </>
            )}
          </Disclosure>
          
          {/* menu  */}
          <div className="hidden text-center lg:flex lg:items-center">
            <ul className="items-center justify-end flex-1 pt-6 list-none lg:pt-0 lg:flex">
              {navigation.map((menu, index) => (
                <li
                  className="mr-3 nav__item relative transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  key={index}
                  onMouseEnter={menu.dropdown ? handleDropdownEnter : undefined}
                  onMouseLeave={menu.dropdown ? handleDropdownLeave : undefined}
                >
                  <Link
                    href={menu.path}
                    className="inline-block px-4 py-2 text-lg font-normal text-gray-800 no-underline rounded-full dark:text-gray-200 hover:text-indigo-500 focus:text-indigo-500 focus:bg-indigo-100 focus:outline-none dark:focus:bg-gray-800 transition-all duration-300 hover:bg-indigo-100 hover:scale-105 hover:shadow-md"
                  >
                    {menu.label}
                  </Link>
                  {/* Dropdown for Satıştaki Ürünlerimiz */}
                  {menu.dropdown && dropdownOpen && (
                    <div
                      className="absolute left-1/2 -translate-x-1/2 z-50 mt-4 w-[1200px] bg-white border border-gray-200 rounded-2xl shadow-2xl py-10 px-10 animate-dropdown-grow-from-top transition-all duration-400"
                      style={{
                        boxShadow: '0 12px 48px 0 rgba(80,80,120,0.18), 0 2px 8px 0 rgba(80,80,120,0.10)',
                        transformOrigin: 'top center'
                      }}
                    >
                      {categories.length === 0 ? (
                        <div className="px-4 py-2 text-gray-500">Kategori yok</div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                          {categories.map((cat) => {
                            let imgUrl = "https://via.placeholder.com/160x120?text=No+Image";
                            if (cat.image && typeof cat.image === "object") {
                              if (cat.image.sizes?.thumbnail?.url) {
                                imgUrl = cat.image.sizes.thumbnail.url.startsWith("/")
                                  ? `http://localhost:3001${cat.image.sizes.thumbnail.url}`
                                  : cat.image.sizes.thumbnail.url;
                              } else if (cat.image.url) {
                                imgUrl = cat.image.url.startsWith("/")
                                  ? `http://localhost:3001${cat.image.url}`
                                  : cat.image.url;
                              }
                            } else if (cat.image && typeof cat.image === "string") {
                              imgUrl = cat.image.startsWith("/")
                                ? `http://localhost:3001${cat.image}`
                                : cat.image;
                            }
                            return (
                              <Link
                                key={cat.id}
                                href={`/categories/${cat.id}`}
                                className="flex flex-col items-center bg-white rounded-full shadow-lg hover:shadow-2xl hover:scale-110 transition-all duration-300 cursor-pointer p-4 hover:-translate-y-1 border-2 border-transparent hover:border-indigo-400"
                                onClick={() => setDropdownOpen(false)}
                              >
                                <img
                                  src={imgUrl}
                                  alt={cat.title}
                                  className="w-32 h-32 object-contain rounded-full mb-4 border transition-all duration-300 hover:scale-110 hover:shadow-lg"
                                  loading="lazy"
                                />
                                <span className="text-lg sm:text-xl font-bold text-gray-800 text-center transition-all duration-300 group-hover:text-indigo-600">
                                  {cat.title}
                                </span>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </nav>
    </div>
  );
}

