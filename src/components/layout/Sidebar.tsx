'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  Inbox, 
  Calendar as CalendarIcon, 
  FolderKanban, 
  Settings,
  CheckSquare,
  ChevronDown,
  ChevronRight
} from 'lucide-react'
import { useState } from 'react'

const navigationItems = [
  {
    name: 'Inbox',
    href: '/inbox',
    icon: Inbox,
  },
  {
    name: 'Today',
    href: '/today',
    icon: CheckSquare,
    subItems: [
      { name: 'Tomorrow', href: '/tomorrow' },
      { name: 'All Tasks', href: '/all-tasks' },
    ],
  },
  {
    name: 'Projects',
    href: '/projects',
    icon: FolderKanban,
  },
  {
    name: 'Calendar',
    href: '/calendar',
    icon: CalendarIcon,
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>(['Today'])

  const toggleExpand = (itemName: string) => {
    setExpandedItems(prev =>
      prev.includes(itemName)
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    )
  }

  return (
    <aside className="w-64 border-r border-border bg-card">
      {/* Logo/Brand */}
      <div className="flex h-16 items-center border-b border-border px-6">
        <h1 className="text-xl font-headline font-bold text-primary">
          FlowZone
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href || 
            item.subItems?.some(sub => pathname === sub.href)
          const isExpanded = expandedItems.includes(item.name)
          const Icon = item.icon

          return (
            <div key={item.name}>
              {/* Main Nav Item */}
              <Link
                href={item.href}
                onClick={(e) => {
                  if (item.subItems) {
                    e.preventDefault()
                    toggleExpand(item.name)
                  }
                }}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="flex-1">{item.name}</span>
                {item.subItems && (
                  isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )
                )}
              </Link>

              {/* Sub Items */}
              {item.subItems && isExpanded && (
                <div className="ml-8 mt-1 space-y-1">
                  {item.subItems.map((subItem) => (
                    <Link
                      key={subItem.href}
                      href={subItem.href}
                      className={cn(
                        'block rounded-lg px-3 py-2 text-sm transition-colors',
                        pathname === subItem.href
                          ? 'bg-accent text-accent-foreground font-medium'
                          : 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground'
                      )}
                    >
                      {subItem.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}
