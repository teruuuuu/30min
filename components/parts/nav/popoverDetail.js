


import React, { useContext, useState } from "react";
import LocaleContext from "../../context/localeContext";
import { ChevronDownIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/20/solid'
import { useLocale } from "../../../utils/locale";
import { createNavUrl, PAYMENT_URL } from "../../../const/pageUrl";
import Link from "next/link";

export default function PopoverDetail({ item }) {
  const { locale } = useContext(LocaleContext);
  const { json } = useLocale(locale)
  const [isHovered, setIsHovered] = useState(false);


  let parent = item.parent 
  let parentLink = createNavUrl(parent)
  let parentKey = parent.PAGE_KEY
  let parentTitle = json.navigation[parentKey]

  let hoverdClass = isHovered ? "opacity-100 visible" : "opacity-0 invisible" 

  return (
    <>
    {/* {parentKey == PAYMENT_URL.PAGE_KEY && (
            
        )} */}
    {item.dropdowns.length == 0 && (
          parentKey === PAYMENT_URL.PAGE_KEY ? (
            <div className="flex items-center justify-center text-white no-underline hover:text-gray-200">
              <ArrowTopRightOnSquareIcon aria-hidden="true" className="h-4 w-4 mr-1" />
              <a className="text-sm font-semibold leading-6 " href="https://tucsonhosyuko.square.site/" target="_blank">{parentTitle}</a>
            </div>
          ) : (
            <Link className="text-sm font-semibold leading-6 text-white no-underline hover:text-gray-200" href={parentLink}>{parentTitle}</Link>
          )
    )}
    {item.dropdowns.length > 0 && (
        <div className="relative dropdown" 
        onMouseEnter={() => setIsHovered(true)}   // ホバー開始時に呼ばれる
        onMouseLeave={() => setIsHovered(false)} // ホバー終了時に呼ばれる
        >
            <div className="flex items-center gap-x-1 text-sm text-white font-semibold leading-6 hover:text-gray-200">
              <span href={parentLink}>{parentTitle}</span><ChevronDownIcon aria-hidden="true" className="h-5 w-5 flex-none " />
            </div>

            <div
            transition
            className={`dropdown-menu absolute -left-8 top-full z-10 shadow w-screen max-w-60 overflow-hidden ${hoverdClass} rounded-lg bg-white shadow-lg transition-opacity duration-500`}
            style={{
                opacity: isHovered ? '100' : '0',
            }}
            >
            <div className="">
                {item.dropdowns.map((dropdown) => {
                return (
                    <div
                    key={dropdown.key}
                    className="relative flex items-center p-4 text-sm leading-6 hover:bg-cyan-500 hover:text-gray-50"
                    >
                    {/* <div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                        <dropdown.icon aria-hidden="true" className="h-6 w-6 text-gray-600 group-hover:text-indigo-600" />
                    </div> */}
                    <div className="flex-auto">
                        <Link href={createNavUrl(dropdown)} className="block font-semibold ">
                        {json.navigation[dropdown.PAGE_KEY]}
                        <span className="absolute inset-0" />
                        </Link>
                        {/* <p className="mt-1 text-gray-600">{item.description}</p> */}
                    </div>
                    </div>
                )
                })}
            </div>
            </div>
        </div>
    )}
    </>
  );
}
