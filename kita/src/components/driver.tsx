import Image from "next/image"

export const DriverIcon: React.FC<{ driver: string }> = ({ driver }) => {
    switch (driver) {
        case "postgres":
            return <Image src="/assets/postgres.png" alt="postgres" width={64} height={64} />
        default:
            return null
    }
}