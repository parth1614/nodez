'use client'
import NextLink, { LinkProps } from 'next/link'
import { usePathname } from 'next/navigation'

export default function Link(
  props: LinkProps & {
    className: string;
    activeclassname?: string;
    children: React.ReactNode;
    isSubLink?: boolean;
  },
) {
  const pathname = usePathname();
  const subLinkClass = props.isSubLink ? " ml-4 text-sm" : "";
  return (
    <NextLink
      {...props}
      className={
        props.className +
        (pathname === props.href ? ` ${props.activeclassname}` : "") 
         + subLinkClass
      }
    />
  )
}
