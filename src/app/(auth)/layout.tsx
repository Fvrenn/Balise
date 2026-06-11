import type { ReactNode } from "react"
import { Zap, BarChart2, Download } from "lucide-react"
import { Logo } from "@/components/logo"

const features = [
  {
    icon: Zap,
    title: "Audit automatique",
    description: "Vérifiez des centaines de critères en quelques minutes.",
  },
  {
    icon: BarChart2,
    title: "Suivi et progression",
    description: "Suivez l'évolution de vos sites et priorisez vos actions.",
  },
  {
    icon: Download,
    title: "Livrables prêts à partager",
    description: "Exportez des rapports clairs et professionnels.",
  },
]

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh bg-background">
      <aside
        className="hidden flex-col justify-between bg-sidebar p-20 px-22 text-sidebar-foreground lg:flex lg:w-[45%]"
        style={{ clipPath: 'polygon(0 0, 100% 0, 94% 100%, 0 100%)' }}
      >
        <Logo />

        <div className="max-w-md space-y-8">
          <div className="space-y-4">
            <p className="heading text-3xl font-bold leading-tight">
              L&apos;audit d&apos;accessibilité numérique, sans la paperasse.
            </p>
            <p className="text-sm leading-relaxed text-sidebar-foreground/70">
              Balise vous aide à analyser, suivre et améliorer la qualité de vos
              sites web grâce à des audits automatisés et des recommandations
              concrètes.
            </p>
          </div>

          <ul className="space-y-5">
            {features.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex items-start gap-3">
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary/15 text-sidebar-primary">
                  <Icon className="size-4" strokeWidth={2} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-sidebar-foreground">
                    {title}
                  </p>
                  <p className="text-xs text-sidebar-foreground/60">
                    {description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-sidebar-muted">
          © {new Date().getFullYear()} Balise — Conformité RGAA pour cabinets de
          conseil.
        </p>
      </aside>

      <main className="flex flex-1 items-center justify-center p-6 sm:p-12 mr-10">
        <div className="w-full max-w-sm">{children}</div>
      </main>
    </div>
  )
}
