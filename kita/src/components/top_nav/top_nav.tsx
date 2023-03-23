import { IconBrandGithub } from "@tabler/icons-react"
import Link from "next/link"

export const TopNav = () => {

    return (
        <div className="sticky relative top-0 z-10 h-16 bg-secondary overflow-hidden">
            <div className="flex flex-row justify-between h-full mx-24 items-center">
                <div>
                    MoeDB
                </div>
                <div>
                    <Link href="https://github.com/nekonako/moedb">
                        <div className="flex flex-row space-x-4">
                            <IconBrandGithub />
                            <span>github</span>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )

}
