"use client"
import { SessionProvider } from "next-auth/react"
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css"

export default function App({Component, pageProps: {session, ...pageProps}}: AppProps) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps}/>
      <ToastContainer />
    </SessionProvider>
  )
}