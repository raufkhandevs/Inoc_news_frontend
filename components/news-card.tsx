"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Clock, ExternalLink } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import { Article } from "@/lib/types"

interface NewsCardProps {
  article: Article
}

export function NewsCard({ article }: NewsCardProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleReadMore = async () => {
    setIsLoading(true)
    try {
      if (window) {
        window.open(article.url, '_blank')
      }
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

export function NewsCardSkeleton({ count = 1 }: { count?: number }) {
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