'use client';

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';
import {
  Inbox,
  Calendar,
  List,
  FolderKanban,
  Settings,
  ChevronDown,
  CalendarDays,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const navItems = [
  { href: '/inbox', label: 'Inbox', icon: Inbox },
  {
    label: 'Schedule',
    icon: Calendar,
    subItems: [
      { href: '/today', label: 'Today', icon: Calendar },
      { href: '/tomorrow', label: 'Tomorrow', icon: CalendarDays },
      { href: '/all-tasks', label: 'All Tasks', icon: List },
    ],
  },
  { href: '/projects', label: 'Projects', icon: FolderKanban },
  { href: '/calendar', label: 'Calendar', icon: CalendarDays },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function AppNav() {
  const pathname = usePathname();
  const [isScheduleOpen, setScheduleOpen] = useState(
    ['/today', '/tomorrow', '/all-tasks'].some((p) => pathname.startsWith(p))
  );

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {navItems.map((item) =>
            item.subItems ? (
              <Collapsible
                key={item.label}
                open={isScheduleOpen}
                onOpenChange={setScheduleOpen}
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      className="justify-between"
                      isActive={item.subItems.some((sub) =>
                        pathname.startsWith(sub.href)
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <item.icon />
                        <span>{item.label}</span>
                      </div>
                      <ChevronDown
                        className={cn(
                          'h-4 w-4 transition-transform',
                          isScheduleOpen && 'rotate-180'
                        )}
                      />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                </SidebarMenuItem>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.subItems.map((subItem) => (
                      <SidebarMenuItem key={subItem.href}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={pathname.startsWith(subItem.href)}
                        >
                          <Link href={subItem.href}>
                            <subItem.icon />
                            <span>{subItem.label}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
            ) : (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith(item.href)}
                  tooltip={item.label}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
