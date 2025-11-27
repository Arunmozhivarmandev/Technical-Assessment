"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Users, Plus, Home, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  isOpen: boolean
  role : string
  onClose: () => void
}

export function Sidebar({ isOpen, role, onClose }: SidebarProps) {
  const pathname = usePathname()

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: Home }
  ]

  if(role === "admin"){
    links.push({ href: "/dashboard/employees/add", label: "Add Employee", icon: Plus })
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed md:static top-0 left-0 z-50 h-screen w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300 md:translate-x-0 flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-sidebar-primary-foreground" />
            </div>
            <span className="font-semibold text-sidebar-foreground">Portal</span>
          </div>
          <button onClick={onClose} className="md:hidden text-sidebar-foreground hover:bg-sidebar-accent rounded p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {links.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => onClose()}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent",
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{link.label}</span>
              </Link>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
