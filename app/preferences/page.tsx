"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Newspaper, ArrowLeft, Check } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/hooks/use-auth"
import { useCategory } from "@/lib/hooks/use-category"
import { useAuthor } from "@/lib/hooks/use-author"
import { Author, Category } from "@/lib/types"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { truncateText } from "@/lib/utils"

export default function PreferencesPage() {
  const router = useRouter()
  const { user, updateUserPreferences } = useAuth()
  const { categories, isLoading: categoriesLoading } = useCategory()
  const { authors, isLoading: authorsLoading } = useAuthor()
  const [selectedAuthorIds, setSelectedAuthorIds] = useState<number[]>([])
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([])

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    // Set initial selections from user preferences
    if (user.preferences) {
      setSelectedAuthorIds(user.preferences.authors.map(author => author.id))
      setSelectedCategoryIds(user.preferences.categories.map(category => category.id))
    }
  }, [user, router])

  const toggleAuthor = (authorId: number) => {
    setSelectedAuthorIds((prev) => 
      prev.includes(authorId) ? prev.filter(id => id !== authorId) : [...prev, authorId]
    )
  }

  const toggleCategory = (categoryId: number) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(categoryId) ? prev.filter(id => id !== categoryId) : [...prev, categoryId]
    )
  }

  const handleSubmit = async () => {
    // Validate at least 3 selections from each
    if (selectedAuthorIds.length < 3) {
      toast({
        title: "Selection Required",
        description: "Please select at least 3 news authors",
        variant: "destructive",
      })
      return
    }

    if (selectedCategoryIds.length < 3) {
      toast({
        title: "Selection Required",
        description: "Please select at least 3 categories",
        variant: "destructive",
      })
      return
    }

    try {
      // Update user preferences
      await updateUserPreferences({
          author_ids: selectedAuthorIds,
          category_ids: selectedCategoryIds
      })

      toast({
        title: "Preferences Updated",
        description: "Your news feed preferences have been saved",
      })

      router.push("/")
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Failed to save preferences",
        variant: "destructive",
      })
    }
  }

  if (categoriesLoading || authorsLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center py-12">
      <div className="container max-w-4xl">
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <div className="flex justify-between items-center">
              <Button variant="ghost" size="sm" className="flex items-center gap-1" onClick={() => router.push("/")}>
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Home</span>
              </Button>
              <div className="flex items-center gap-1">
                <Newspaper className="h-5 w-5" />
                <span className="font-bold">NewsAggregator</span>
              </div>
            </div>
            <CardTitle className="text-2xl text-center mt-6">
              {user?.preferences ? "Edit Your Preferences" : "Personalize Your News Feed"}
            </CardTitle>
            <CardDescription className="text-center">
              Select at least 3 news authors and 3 categories that interest you
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
          <div>
              <h3 className="text-lg font-semibold mb-4">Categories</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Selected: {selectedCategoryIds.length} (minimum 3 required)
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categories?.map((category: Category) => (
                  <div key={category.id} className="flex items-start space-x-2">
                    <Checkbox
                      id={`category-${category.id}`}
                      checked={selectedCategoryIds.includes(category.id)}
                      onCheckedChange={() => toggleCategory(category.id)}
                    />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Label htmlFor={`category-${category.id}`} className="text-sm font-normal cursor-pointer">
                            {truncateText(category.name)}
                          </Label>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{category.name}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">News Authors</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Selected: {selectedAuthorIds.length} (minimum 3 required)
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {authors?.map((author: Author) => (
                  <div key={author.id} className="flex items-start space-x-2">
                    <Checkbox
                      id={`author-${author.id}`}
                      checked={selectedAuthorIds.includes(author.id)}
                      onCheckedChange={() => toggleAuthor(author.id)}
                    />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Label htmlFor={`author-${author.id}`} className="text-sm font-normal cursor-pointer">
                            {truncateText(author.name)}
                          </Label>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{author.name}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleSubmit}
              className="w-full"
              disabled={selectedAuthorIds.length < 3 || selectedCategoryIds.length < 3}
            >
              <Check className="mr-2 h-4 w-4" />
              {user?.preferences ? "Save Changes" : "Complete Setup"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
