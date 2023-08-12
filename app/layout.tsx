import type { Metadata } from 'next'
import "../styles/globals.scss";
import {ApolloWrapper} from '@/components/apollo'
export const metadata: Metadata = {
  title: 'Notes App'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
    <body><div id={"main-container"}>
      <ApolloWrapper>{children}</ApolloWrapper>
      </div></body>
    </html>
  )
}