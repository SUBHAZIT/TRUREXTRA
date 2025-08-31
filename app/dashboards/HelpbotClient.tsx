"use client"
import dynamic from "next/dynamic"

const Helpbot = dynamic(() => import("../../components/helpbot/floating-helpbot"), { ssr: false })

export default Helpbot
