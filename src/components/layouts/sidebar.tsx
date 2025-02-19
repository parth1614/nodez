"use client";

import links from '@/utils/links'
import Image from 'next/image'
import Link from '../utils/link'
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();

  return (
    <div className="m-2 h-[96vh] w-full max-w-16 rounded-[2rem] bg-card-foreground/5 py-4 md:m-4 md:max-w-xs">
      <nav className="grid items-start gap-2 px-2 text-sm font-medium lg:px-4">
        <Link href="/" className="grid place-items-center py-6 md:p-3">
          <Image
            src="/logo.svg"
            width={200}
            height={60}
            alt="Logo"
            className="object-contain"
          />
        </Link>
        {links.map((link) => (
          <div key={link.label}>
            <Link
              href={link.url}
              onClick={() => router.push(link.url)}
              className="flex items-center rounded-full p-2 py-3 text-lg text-muted-foreground transition-all hover:text-primary max-md:justify-center md:gap-3 md:px-6"
              activeclassname="text-primary bg-primary/10"
            >
              <link.icon size={20} />
              <span className="max-md:hidden">{link.label}</span>
            </Link>
            {/* {link.subLinks && (
              <div className="ml-6 mt-2 space-y-1">
                {link.subLinks.map((subLink) => (
                  <Link
                    key={subLink.label}
                    href={subLink.url}
                    onClick={() => router.push(subLink.url)}
                    className="flex items-center rounded-full p-2 py-3 text-lg text-muted-foreground transition-all hover:text-primary max-md:justify-center md:gap-3 md:px-6"
                    activeclassname="text-primary bg-primary/10"
                  >
                    <subLink.icon size={16} />
                    <span className="ml-2">{subLink.label}</span>
                  </Link>
                ))}
              </div>
            )} */}
          </div>
        ))}
      </nav>
    </div>
  )
}
