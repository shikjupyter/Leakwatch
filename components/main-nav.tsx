import Link from "next/link"
import { Shield } from "lucide-react"

export function MainNav() {
  return (
    <div className="flex items-center gap-6 md:gap-10">
      <Link href="/" className="flex items-center gap-2">
        <Shield className="h-6 w-6 text-primary" />
        <span className="hidden font-bold sm:inline-block">Leakwatch</span>
      </Link>
    </div>
  )
}
