'use client'

import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { LogOut, User, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

export function TopBar() {
  const { currentUser, logout } = useAuth()
  const { theme, setTheme } = useTheme()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const userInitials = currentUser?.displayName
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || currentUser?.email?.[0].toUpperCase() || 'U'

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
      {/* Left side - could add breadcrumbs or search later */}
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold">Welcome back!</h2>
      </div>

      {/* Right side - user menu and theme toggle */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar>
                <AvatarImage src={currentUser?.photoURL || undefined} />
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">
                  {currentUser?.displayName || 'User'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {currentUser?.email}
                </p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
