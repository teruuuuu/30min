import React, { useContext } from "react";
import LocaleContext from "../../context/localeContext";
import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel
  } from '@headlessui/react'
import { ChevronDownIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/20/solid'
import { useLocale } from "../../../utils/locale";
import { createNavUrl, PAYMENT_URL } from "../../../const/pageUrl";
import Link from "next/link";
// モバイル用
export default function DisclosureDetail({ item }) {
  const { locale } = useContext(LocaleContext);
  const { json } = useLocale(locale)
  let parent = item.parent 
  let parentLink = createNavUrl(parent)
  let parentKey = parent.PAGE_KEY
  let parentTitle = json.navigation[parentKey]

  return (
    
    <Disclosure as="div" className="-mx-3">
    {item.dropdowns.length == 0 && (
      parentKey === PAYMENT_URL.PAGE_KEY ? (
        <div className="flex px-3 py-2 items-center no-underline text-blue-800 hover:bg-gray-50 leading-7 -mx-3 rounded-lg">
          <ArrowTopRightOnSquareIcon  aria-hidden="true" className="h-4 w-4 mr-1" />
          <a className="text-base font-semibold text-blue-800 hover:bg-gray-50" href="https://tucsonhosyuko.square.site/" target="_blank">{parentTitle}</a>
        </div>
      ) : (
        <Link className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-blue-800 hover:bg-gray-50" href={parentLink}>{parentTitle}</Link>
      )
    )}
    {item.dropdowns.length > 0 && (
      <>
        <DisclosureButton className="group w-full font-semibold flex px-3 py-2 items-center no-underline text-blue-800 hover:bg-gray-50 leading-7 -mx-3 rounded-lg">
          {parentTitle}
          <ChevronDownIcon aria-hidden="true" className="h-5 w-5 flex-none group-data-[open]:rotate-180" />
        </DisclosureButton>

        <DisclosurePanel className="mt-2 space-y-2">
          {item.dropdowns.map((dropdown) => (
            <Link
              key={dropdown.PAGE_KEY}
              href={createNavUrl(dropdown)}
              className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-blue-800 hover:bg-gray-50"
            >
              {json.navigation[dropdown.PAGE_KEY]}
            </Link>
          ))}
        </DisclosurePanel>
      </>
    )}
    </Disclosure>
  );
}
