'use client'
import links from '@/utils/links'
import { usePathname } from 'next/navigation'
import ConnectButton from '../modals/wallet-modal'

export default function Header() {
  const pathname = usePathname();
  const allLinks = links.flatMap((link) => [link, ...(link.subLinks || [])]);
  
  const activeLink = allLinks.find((link) => {
    if (link.url.includes('[nodeId]')) {
      return pathname.startsWith('/nodezpad/');
    }
    return link.url === pathname;
  });

  if (!activeLink) throw new Error('No active link found')

  return (
    <header className="flex justify-between gap-4 px-2 py-6">
      <div className="flex items-center gap-4">
        <activeLink.icon size={32} className="text-primary" />
        <h1 className="text-3xl font-medium text-primary">
          {activeLink.label}
        </h1>
      </div>
      <ConnectButton />
    </header>
  );
}
