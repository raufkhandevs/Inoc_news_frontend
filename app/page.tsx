"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Newspaper, TrendingUp, Clock, ExternalLink, Settings, LogOut, Search, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useTheme } from "next-themes"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { useDebounce } from "@/lib/hooks/use-debounce"
import { ProfileDialog } from "@/components/profile-dialog"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/hooks/use-auth"

export default function Home() {
  const router = useRouter()
  const { setTheme } = useTheme()
  const { user, logout, hasPreferences } = useAuth()

  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("explore")
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isSearching, setIsSearching] = useState<boolean>(false)
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false)
  const debouncedSearch = useDebounce(searchQuery, 300)
  const [showProfile, setShowProfile] = useState<boolean>(false)

  // Check if user is logged in on component mount
  useEffect(() => {
    const checkAuth = async () => {
      // const user = localStorage.getItem("user") // No longer needed
      // if (user) {
      //   setIsLoggedIn(true)
      // }
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsLoading(false)
    }
    checkAuth()
  }, [])

  // Handle search
  useEffect(() => {
    const performSearch = async () => {
      if (debouncedSearch) {
        setIsSearching(true)
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 800))
        setIsSearching(false)
      }
    }
    performSearch()
  }, [debouncedSearch])

  // Mock news data
  const allNews = [
    {
      id: 1,
      title: "Major Tech Company Announces Revolutionary AI Product",
      description:
        "A major tech company has unveiled a groundbreaking AI product that promises to revolutionize how we interact with technology. Industry experts are calling it a game-changer.",
      category: "Technology",
      source: "Tech Chronicle",
      time: "3 hours ago",
    },
    {
      id: 2,
      title: "Global Markets React to New Economic Policies",
      description:
        "Stock markets worldwide showed mixed reactions today as new economic policies were announced by several major economies. Analysts predict volatility in the coming weeks.",
      category: "Business",
      source: "Business Daily",
      time: "5 hours ago",
    },
    {
      id: 3,
      title: "Breakthrough in Renewable Energy Storage",
      description:
        "Scientists have developed a new type of battery that could solve one of the biggest challenges in renewable energy: efficient, long-term storage. This could accelerate the transition to clean energy.",
      category: "Science",
      source: "Science Today",
      time: "1 day ago",
    },
    {
      id: 4,
      title: "Major Sports Team Announces Surprising Trade Deal",
      description:
        "In an unexpected move, one of the leading teams has traded their star player in what analysts are calling 'the deal of the decade'. Fans have expressed mixed reactions on social media.",
      category: "Sports",
      source: "Sports Network",
      time: "12 hours ago",
    },
    {
      id: 5,
      title: "New Study Reveals Benefits of Mediterranean Diet",
      description:
        "A comprehensive study spanning over a decade has confirmed significant health benefits of following a Mediterranean diet, including reduced risk of heart disease and improved longevity.",
      category: "Health",
      source: "Health Insights",
      time: "2 days ago",
    },
  ]

  // Mock personalized news (would come from API based on user preferences)
  const myNews = allNews.filter(
    (news) =>
      ["Technology", "Science", "Health"].includes(news.category) ||
      ["Tech Chronicle", "Science Today"].includes(news.source),
  )

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

  if (isLoading) {
    return <PageSkeleton />
  }

  return (
    <div className="container mx-auto py-6">
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
            }}
          />
          {isSearching && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Spinner />
            </div>
          )}
        </div>
      </header>

      {user && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          {hasPreferences && <TabsList className="grid w-[200px] grid-cols-2">
            <TabsTrigger value="explore">Explore</TabsTrigger>
            <TabsTrigger value="my">My Feeds</TabsTrigger>
          </TabsList>}
          <TabsContent value="explore">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5" />
              {searchQuery ? "Search Results" : "Explore News"}
            </h2>
          </TabsContent>
          <TabsContent value="my">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5" />
              Personalized News
            </h2>
          </TabsContent>
        </Tabs>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {isSearching ? (
            <NewsCardSkeleton count={3} />
          ) : (
            <>
              {user ? (
                <Tabs value={activeTab} className="w-full">
                  <TabsContent value="explore" className="space-y-6">
                    {allNews
                      .filter((news) =>
                        searchQuery
                          ? news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          news.description.toLowerCase().includes(searchQuery.toLowerCase())
                          : true,
                      )
                      .map((news) => (
                        <NewsCard key={news.id} news={news} />
                      ))}
                  </TabsContent>
                  <TabsContent value="my" className="space-y-6">
                    {myNews.map((news) => (
                      <NewsCard key={news.id} news={news} />
                    ))}
                  </TabsContent>
                </Tabs>
              ) : (
                <>
                  {allNews
                    .filter((news) =>
                      searchQuery
                        ? news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        news.description.toLowerCase().includes(searchQuery.toLowerCase())
                        : true,
                    )
                    .map((news) => (
                      <NewsCard key={news.id} news={news} />
                    ))}
                </>
              )}
            </>
          )}

          {!isSearching && (
            <div className="flex justify-center pt-4">
              <Button
                variant="outline"
                onClick={async () => {
                  setIsLoadingMore(true)
                  // Simulate loading more content
                  await new Promise((resolve) => setTimeout(resolve, 1000))
                  setIsLoadingMore(false)
                }}
                disabled={isLoadingMore}
              >
                {isLoadingMore ? (
                  <>
                    <Spinner className="mr-2" />
                    Loading more...
                  </>
                ) : (
                  "Load More"
                )}
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold">Categories</h2>
          <div className="flex flex-wrap gap-2">
            {["Technology", "Business", "Politics", "Health", "Science", "Sports", "Entertainment"].map((category) => (
              <Badge key={category} variant="secondary" className="cursor-pointer">
                {category}
              </Badge>
            ))}
          </div>

          <h2 className="text-xl font-bold mt-8">Popular Sources</h2>
          <div className="space-y-3">
            {["Tech Chronicle", "Business Daily", "Science Today", "Sports Network", "Health Insights"].map(
              (source) => (
                <div key={source} className="flex items-center gap-2 p-2 hover:bg-muted rounded-md cursor-pointer">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={`/placeholder.svg?height=24&width=24`} alt={source} />
                    <AvatarFallback>
                      {source
                        .split(" ")
                        .map((word) => word[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span>{source}</span>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
      <ProfileDialog open={showProfile} onOpenChange={setShowProfile} />
    </div>
  )
}

// TODO: Remove this once the type is defined
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function NewsCard({ news }: { news: any }) {
  const [isLoading, setIsLoading] = useState(false)

  const handleReadMore = async () => {
    setIsLoading(true)
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))
    setIsLoading(false)
    // Handle read more action
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg hover:text-primary cursor-pointer">{news.title}</CardTitle>
            <CardDescription className="flex items-center gap-1 mt-1">
              <Clock className="h-3 w-3" />
              <span>{news.time}</span>
              <span className="mx-1">•</span>
              <span>{news.source}</span>
            </CardDescription>
          </div>
          <Badge variant="outline">{news.category}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{news.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={`/placeholder.svg?height=24&width=24`} alt="Publisher" />
            <AvatarFallback>
              {news.source
                .split(" ")
                .map((word: string) => word[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">{news.source}</span>
        </div>
        <Button variant="ghost" size="sm" className="gap-1" onClick={handleReadMore} disabled={isLoading}>
          {isLoading ? <Spinner className="mr-2" /> : <ExternalLink className="h-4 w-4" />}
          {isLoading ? "Loading..." : "Read More"}
        </Button>
      </CardFooter>
    </Card>
  )
}

function NewsCardSkeleton({ count = 1 }: { count?: number }) {
  return (
    <>
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-[250px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
                <Skeleton className="h-5 w-[100px]" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-4 w-[100px]" />
              </div>
              <Skeleton className="h-8 w-[100px]" />
            </CardFooter>
          </Card>
        ))}
    </>
  )
}

function PageSkeleton() {
  return (
    <div className="container mx-auto py-6">
      <header className="flex flex-col gap-6 mb-8">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-[200px]" />
          <div className="flex gap-4">
            <Skeleton className="h-10 w-[80px]" />
            <Skeleton className="h-10 w-[80px]" />
          </div>
        </div>
        <Skeleton className="h-10 w-full" />
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <NewsCardSkeleton count={3} />
        </div>

        <div className="space-y-6">
          <Skeleton className="h-6 w-[100px] mb-4" />
          <div className="flex flex-wrap gap-2">
            {Array(7)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-6 w-[100px]" />
              ))}
          </div>

          <Skeleton className="h-6 w-[120px] mt-8 mb-4" />
          <div className="space-y-3">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-6 w-[150px]" />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

