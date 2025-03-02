"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Category, Author } from "@/lib/types"

interface SidebarProps {
  categories: Category[]
  authors: Author[]
  selectedCategoryIds: number[]
  selectedAuthorIds: number[]
  onCategoryClick: (categoryId: number) => void
  onAuthorClick: (authorId: number) => void
}

export function Sidebar({
  categories,
  authors,
  selectedCategoryIds,
  selectedAuthorIds,
  onCategoryClick,
  onAuthorClick,
}: SidebarProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Categories</h2>
      <div className="flex flex-wrap gap-2">
        {categories?.map((category) => (
          <Badge
            key={`category-${category.id}`}
            variant={selectedCategoryIds.includes(category.id) ? "default" : "secondary"}
            className="cursor-pointer hover:bg-muted"
            onClick={() => onCategoryClick(category.id)}
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
            onClick={() => onAuthorClick(author.id)}
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
  )
} 