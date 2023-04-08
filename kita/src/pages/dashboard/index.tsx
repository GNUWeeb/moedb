'use client';

import React from "react"
import { PrimaryNavigation } from "@/components/side_nav/primary"
import { Loading } from "@/components/loading";

export default function Dashboard() {
    return <div className="min-w-screen min-h-screen flex flex-row">
        <PrimaryNavigation />
        <div className="flex flex-col w-full h-screen">
            <Loading />
        </div>
    </div >
}