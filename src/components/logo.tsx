import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  iconOnly?: boolean
}

export function Logo({ className, iconOnly }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span
        className="font-heading font-bold leading-none text-secondary-foreground"
        style={{
          backgroundColor: "var(--primary)",
          padding: "10px 5px",
          borderRadius: "10px",
          fontSize: "0.7rem",
          letterSpacing: "-0.02em",
        }}
      >
        {"<B/>"}
      </span>
      {!iconOnly && (
        <span className="font-heading text-xl font-extrabold text-white">
          balise
        </span>
      )}
    </div>
  )
}
