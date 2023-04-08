import Image from "next/image"

export const Loading: React.FC = () => {
    return <div className="flex flex-col w-auto">
        <div className="h-full overflow-auto">
            <div className="w-full h-full flex flex-col justify-center items-center">
                <div>
                    <Image src="/assets/bochi.webp" alt="bochi" width={400} height={400} />
                </div>
            </div>
        </div>
    </div>
}