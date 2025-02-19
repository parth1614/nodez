import Header from '@/components/layouts/header'
import Sidebar from '@/components/layouts/sidebar'
import { headers } from 'next/headers'
import { cookieToInitialState } from 'wagmi'
import { config } from '@/lib/auth.config'
import WagmiProviderComp from '@/lib/wagmi-provider'

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  let initialState
  try {
    const cookieHeader = headers().get('cookie') || ''
    initialState = cookieToInitialState(config, cookieHeader)
  } catch (error) {
    console.error('Error parsing cookie:', error)
    initialState = undefined 
  }
  return (
    <WagmiProviderComp initialState={initialState}>
      <main className="relative grid h-screen grid-cols-5 items-stretch overflow-y-hidden  md:gap-4">
        <Sidebar />
        <div className="col-span-4 flex flex-col overflow-y-auto pr-2 md:col-span-4 md:p-4">
          <Header />
          {children}
        </div>
      </main>
    </WagmiProviderComp>
  )
}
