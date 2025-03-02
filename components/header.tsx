"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Newspaper, Settings, LogOut, Search, User } from "lucide-react"
import { useAuth } from "@/lib/hooks/use-auth"
import { toast } from "@/components/ui/use-toast"
import { ProfileDialog } from "@/components/profile-dialog"

interface HeaderProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  setActiveTab: (tab: string) => void
  setPage: (page: number) => void
  isLoading: boolean
}

export function Header({ searchQuery, setSearchQuery, setActiveTab, setPage, isLoading }: HeaderProps) {
  const router = useRouter()
  const { setTheme } = useTheme()
  const { user, logout } = useAuth()
  const [showProfile, setShowProfile] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      toast({
        title: "Success",
        description: "You have been logged out successfully",
      })
    } catch (error) {
      console.error("Error logging out:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to logout",
        variant: "destructive",
      })
    }
  }

  return (
    <header className="flex flex-col gap-6 mb-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Newspaper className="h-6 w-6" />
          <h1 className="text-2xl font-bold">NewsAggregator</h1>
        </div>
        <div className="flex gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowProfile(true)}>
                  <User className="h-4 w-4 mr-2" />
                  View Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/preferences")}>Edit Preferences</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("light")}>Light Mode</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>Dark Mode</DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Register</Button>
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search news articles..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setActiveTab("explore")
            setPage(1)
          }}
        />
        {isLoading && searchQuery && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Spinner />
          </div>
        )}
      </div>
      <ProfileDialog open={showProfile} onOpenChange={setShowProfile} />
    </header>
  )
} 