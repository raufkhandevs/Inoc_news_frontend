"use client"

import { useState } from "react"
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
import { useCategory } from "@/lib/hooks/use-category"
import { useAuthor } from "@/lib/hooks/use-author"
import { useArticle } from "@/lib/hooks/use-article"
import { Article } from "@/lib/types"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { cn } from "@/lib/utils"

export default function Home() {
  const router = useRouter()
  const { setTheme } = useTheme()
  const { user, logout, hasPreferences } = useAuth()
  const { categories } = useCategory()
  const { authors } = useAuthor()

  const [selectedAuthorIds, setSelectedAuthorIds] = useState<number[]>([])
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("explore")
  const [page, setPage] = useState(1)
  const [showProfile, setShowProfile] = useState(false)
  const debouncedSearch = useDebounce(searchQuery, 300)

  const {
    exploreArticles,
    myFeedArticles,
    explorePagination,
    myFeedsPagination,
    isExploreLoading,
    isMyFeedsLoading
  } = useArticle({
    search: debouncedSearch,
    page,
    author_ids: selectedAuthorIds,
    category_ids: selectedCategoryIds
  })

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

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const handleCategoryClick = (categoryId: number) => {
    setSelectedCategoryIds(prev => {
      const isSelected = prev.includes(categoryId)
      if (isSelected) {
        return prev.filter(id => id !== categoryId)
      } else {
        return [...prev, categoryId]
      }
    })
    setPage(1) // Reset to first page when changing filters
  }

  const handleAuthorClick = (authorId: number) => {
    setSelectedAuthorIds(prev => {
      const isSelected = prev.includes(authorId)
      if (isSelected) {
        return prev.filter(id => id !== authorId)
      } else {
        return [...prev, authorId]
      }
    })
    setPage(1) // Reset to first page when changing filters
  }

  const currentPagination = activeTab === 'explore' ? explorePagination : myFeedsPagination
  const totalPages = currentPagination?.lastPage || 1

  const renderPaginationItems = () => {
    const items = []
    const maxVisible = 5
    const currentPage = currentPagination?.currentPage || 1

    if (totalPages <= maxVisible) {
      // Show all pages if total is less than or equal to maxVisible
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        )
      }
    } else {
      // Always show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            onClick={() => handlePageChange(1)}
            isActive={currentPage === 1}
          >
            1
          </PaginationLink>
        </PaginationItem>
      )

      // Show ellipsis if needed
      if (currentPage > 3) {
        items.push(
          <PaginationItem key="start-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        )
      }

      // Show current page and surrounding pages
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        )
      }

      // Show ellipsis if needed
      if (currentPage < totalPages - 2) {
        items.push(
          <PaginationItem key="end-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        )
      }

      // Always show last page
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            onClick={() => handlePageChange(totalPages)}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      )
    }

    return items
  }

  const showSidebar = activeTab === 'explore'

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
              setPage(1)
            }}
          />
          {isExploreLoading && debouncedSearch && (
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

      <div className={cn(
        "grid gap-6",
        showSidebar ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1"
      )}>
        <div className={cn(
          "space-y-6",
          showSidebar ? "md:col-span-2" : ""
        )}>
          {(isExploreLoading && !exploreArticles.length) || (isMyFeedsLoading && !myFeedArticles.length) ? (
            <NewsCardSkeleton count={3} />
          ) : (
            <>
              {user ? (
                <Tabs value={activeTab} className="w-full">
                  <TabsContent value="explore" className="space-y-6">
                    {exploreArticles.map((article) => (
                      <NewsCard key={article.id} article={article} />
                    ))}
                  </TabsContent>
                  <TabsContent value="my" className="space-y-6">
                    {myFeedArticles.map((article) => (
                      <NewsCard key={article.id} article={article} />
                    ))}
                  </TabsContent>
                </Tabs>
              ) : (
                <>
                  {exploreArticles.map((article) => (
                    <NewsCard key={article.id} article={article} />
                  ))}
                </>
              )}

              {currentPagination && (
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                      />
                    </PaginationItem>
                    {renderPaginationItems()}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPages}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </div>

        {showSidebar && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Categories</h2>
            <div className="flex flex-wrap gap-2">
              {categories?.map((category) => (
                <Badge
                  key={`category-${category.id}`}
                  variant={selectedCategoryIds.includes(category.id) ? "default" : "secondary"}
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => handleCategoryClick(category.id)}
                >
                  {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
                </Badge>
              ))}
            </div>

            <h2 className="text-xl font-bold mt-8">Popular Authors</h2>
            <div className="space-y-3 max-h-[50vh] overflow-y-auto">
              {authors?.map((author) => (
                <div
                  key={author.id}
                  className={cn(
                    "flex items-center gap-2 p-2 rounded-md cursor-pointer",
                    selectedAuthorIds.includes(author.id)
                      ? "bg-primary/10 hover:bg-primary/20"
                      : "hover:bg-muted"
                  )}
                  onClick={() => handleAuthorClick(author.id)}
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={`/placeholder.svg?height=24&width=24`} alt={author.name} />
                    <AvatarFallback>
                      {author.name
                        .split(" ")
                        .map((word) => word[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span>{author.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <ProfileDialog open={showProfile} onOpenChange={setShowProfile} />
    </div>
  )
}

function NewsCard({ article }: { article: Article }) {
  const [isLoading, setIsLoading] = useState(false)

  const handleReadMore = async () => {
    setIsLoading(true)
    try {
      window.open(article.url, '_blank')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg hover:text-primary cursor-pointer">{article.title}</CardTitle>
            <CardDescription className="flex items-center gap-1 mt-1">
              <Clock className="h-3 w-3" />
              <span>{new Date(article.published_at).toLocaleDateString()}</span>
              <span className="mx-1">•</span>
              <span>Source {article.author.source_id}</span>
            </CardDescription>
          </div>
          <Badge variant="outline">{article.category.name}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: article.description }} />
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={article.image_url || `/placeholder.svg?height=24&width=24`} alt={article.author.name} />
            <AvatarFallback>
              {article.author.name
                .split(" ")
                .map((word) => word[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">{article.author.name}</span>
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

