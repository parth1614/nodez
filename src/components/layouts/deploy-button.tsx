'use client'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import React from 'react'
import { useAccount } from 'wagmi'
import MultiStateButton from '../ui/multi-state-button'

const DeployButton = ({
  handleDeploy,
}: {
  nodeId: string
  handleDeploy: () => Promise<void>
}) => {
  const [state, setState] = React.useState<'initial' | 'loading' | 'success'>(
    'initial',
  )
  const { isConnected } = useAccount()
  const { open } = useWeb3Modal()
  return (
    <MultiStateButton
      setState={setState}
      state={state}
      className="mx-4 w-full rounded-full py-6 text-lg font-semibold"
      onClick={async () => {
        if (!isConnected) {
          open()
          return
        }
        await handleDeploy()
      }}
    >
      {isConnected ? 'Deploy' : 'Connect Wallet'}
    </MultiStateButton>
  )
}

const ClaimButton = ({
  handleClaim,
}: {
  handleClaim: () => Promise<void>
}) => {
  const [state, setState] = React.useState<'initial' | 'loading' | 'success'>(
    'initial',
  )

  return (
    <MultiStateButton
      setState={setState}
      state={state}
      className="mx-4 w-full rounded-full py-6 text-lg font-semibold"
      onClick={handleClaim}
      // onClick={async () => {
      //   if (!isConnected) {
      //     open()
      //     return
      //   }
      //   await handleClaim()
      // }}
    >
      Claim Rewards
    </MultiStateButton>
  )
}

export { DeployButton, ClaimButton }
