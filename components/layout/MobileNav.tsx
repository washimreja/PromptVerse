"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Compass, Sparkles, Cpu, Search, User } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Discover", icon: Compass },
  { href: "/category", label: "Categories", icon: Sparkles },
  { href: "/models", label: "AI Models", icon: Cpu },
  { href: "/search", label: "Search", icon: Search },
  { href: "/profile", label: "Profile", icon: User },
];

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav 
      aria-label="Bottom Navigation"
      className="fixed bottom-3 left-3 right-3 z-50 md:hidden pointer-events-auto"
    >
      <div className="flex h-16 items-center justify-around rounded-2xl border border-white/10 bg-[#090a0f]/90 backdrop-blur-2xl px-2 shadow-[0_16px_40px_rgba(0,0,0,0.8)]">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-1 flex-col items-center justify-center py-2 px-1 rounded-xl transition-all active:scale-95"
            >
              <div className="relative z-10 flex flex-col items-center gap-1">
                <Icon
                  className={cn(
                    "h-5 w-5 transition-all duration-300",
                    isActive
                      ? "text-cyan-400 scale-110"
                      : "text-white/50 hover:text-white"
                  )}
                />
                <span
                  className={cn(
                    "text-[10px] font-bold tracking-tight transition-all duration-300",
                    isActive ? "text-cyan-400 font-extrabold" : "text-white/40"
                  )}
                >
                  {item.label}
                </span>
              </div>

              {isActive && (
                <motion.div
                  layoutId="bottom-nav-active-pill"
                  className="absolute inset-x-1 inset-y-1 rounded-xl bg-cyan-500/10 border border-cyan-500/20"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default BottomNavigation;
