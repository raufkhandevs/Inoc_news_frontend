"use client"

import { useState } from "react"
import { TrendingUp } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDebounce } from "@/lib/hooks/use-debounce"
import { useAuth } from "@/lib/hooks/use-auth"
import { useCategory } from "@/lib/hooks/use-category"
import { useAuthor } from "@/lib/hooks/use-author"
import { useArticle } from "@/lib/hooks/use-article"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { NewsCard, NewsCardSkeleton } from "@/components/news-card"
import { cn } from "@/lib/utils"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

export default function Home() {
  const { user, hasPreferences } = useAuth()
  const { categories } = useCategory()
  const { authors } = useAuthor()

  const [selectedAuthorIds, setSelectedAuthorIds] = useState<number[]>([])
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("explore")
  const [page, setPage] = useState(1)
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
    setPage(1)
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
    setPage(1)
  }

  const currentPagination = activeTab === 'explore' ? explorePagination : myFeedsPagination
  const totalPages = currentPagination?.lastPage || 1

  const renderPaginationItems = () => {
    const items = []
    const maxVisible = 5
    const currentPage = currentPagination?.currentPage || 1

    if (totalPages <= maxVisible) {
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

      if (currentPage > 3) {
        items.push(
          <PaginationItem key="start-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        )
      }

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

      if (currentPage < totalPages - 2) {
        items.push(
          <PaginationItem key="end-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        )
      }

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
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setActiveTab={setActiveTab}
        setPage={setPage}
        isLoading={isExploreLoading}
      />

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
          <Sidebar
            categories={categories}
            authors={authors}
            selectedCategoryIds={selectedCategoryIds}
            selectedAuthorIds={selectedAuthorIds}
            onCategoryClick={handleCategoryClick}
            onAuthorClick={handleAuthorClick}
          />
        )}
      </div>
    </div>
  )
}

