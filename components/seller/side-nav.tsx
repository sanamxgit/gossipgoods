"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Package, ShoppingBag, Settings, Users, BarChart, Store } from "lucide-react"

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/seller",
    color: "text-sky-500",
  },
  {
    label: "Products",
    icon: Package,
    href: "/seller/products",
    color: "text-violet-500",
  },
  {
    label: "Orders",
    icon: ShoppingBag,
    href: "/seller/orders",
    color: "text-pink-700",
  },
  {
    label: "Customers",
    icon: Users,
    href: "/seller/customers",
    color: "text-orange-700",
  },
  {
    label: "Analytics",
    icon: BarChart,
    href: "/seller/analytics",
    color: "text-emerald-500",
  },
  {
    label: "Seller Portal",
    icon: Store,
    href: "/seller/portal",
    color: "text-indigo-500",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/seller/settings",
  },
]

export function SideNav() {
  const pathname = usePathname()

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-black text-white">
      <div className="px-3 py-2 flex-1">
        <Link href="/seller" className="flex items-center pl-3 mb-14">
          <h1 className="text-2xl font-bold">Seller Portal</h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                pathname === route.href ? "text-white bg-white/10" : "text-zinc-400",
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
