import { LoaderIcon } from "lucide-react"

import { cn } from "@/lib/utils.js"

function Spinner({ className, ...props }) {
  return (
    <LoaderIcon
      role="status"
      aria-label="Loading"
      className={cn("size-8 animate-spin text-white", className)}
      {...props}
    />
  )
}

export function AuthLoader() {
  return (
    <div className="flex justify-center items-center w-screen h-screen gap-4 bg-transparent backdrop-blur-sm">
      <Spinner />
    </div>
  )
}

