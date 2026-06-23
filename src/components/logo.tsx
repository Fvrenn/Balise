import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  iconOnly?: boolean
}

export function Logo({ className, iconOnly }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="rounded-[10px] bg-primary px-[5px] py-[10px] font-heading text-[0.7rem] font-bold leading-none tracking-[-0.02em] text-secondary-foreground">
        {"<B/>"}
      </span>
      {!iconOnly && (
        <span className="font-heading text-xl font-extrabold text-sidebar-foreground">
          balise
        </span>
      )}
    </div>
  )
}
