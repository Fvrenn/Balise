import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
}

export function Logo({ className }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <span
        className="heading font-bold leading-none text-secondary-foreground"
        style={{
          backgroundColor: "var(--primary)",
          padding: "13px 6.5px",
          borderRadius: "12px",
          fontSize: "0.75rem",
          letterSpacing: "-0.02em",
        }}
      >
        {"<B/>"}
      </span>
      <span className="heading text-2xl font-extrabold text-white">
        balise
      </span>

    </div>
  )
}
