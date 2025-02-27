"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Newspaper, ArrowLeft, Check } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export default function PreferencesPage() {
  const router = useRouter()
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [isEditing, setIsEditing] = useState(false)

  // Available options
  const authors = [
    "Tech Chronicle",
    "Business Daily",
    "Science Today",
    "Sports Network",
    "Health Insights",
    "Political Review",
    "Entertainment Weekly",
    "Global News Network",
  ]

  const categories = [
    "Technology",
    "Business",
    "Politics",
    "Health",
    "Science",
    "Sports",
    "Entertainment",
    "World News",
    "Economy",
    "Education",
  ]

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem("user")
    if (!user) {
      router.push("/login")
      return
    }

    // Check if this is an edit (user already has preferences)
    const preferences = localStorage.getItem("preferences")
    if (preferences) {
      const parsedPrefs = JSON.parse(preferences)
      setSelectedAuthors(parsedPrefs.authors || [])
      setSelectedCategories(parsedPrefs.categories || [])
      setIsEditing(true)
    }
  }, [router])

  const toggleAuthor = (author: string) => {
    setSelectedAuthors((prev) => (prev.includes(author) ? prev.filter((a) => a !== author) : [...prev, author]))
  }

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const handleSubmit = () => {
    // Validate at least 3 selections from each
    if (selectedAuthors.length < 3) {
      toast({
        title: "Selection Required",
        description: "Please select at least 3 news sources",
        variant: "destructive",
      })
      return
    }

    if (selectedCategories.length < 3) {
      toast({
        title: "Selection Required",
        description: "Please select at least 3 categories",
        variant: "destructive",
      })
      return
    }

    // Save preferences
    localStorage.setItem(
      "preferences",
      JSON.stringify({
        authors: selectedAuthors,
        categories: selectedCategories,
      }),
    )

    toast({
      title: isEditing ? "Preferences Updated" : "Preferences Saved",
      description: "Your news feed preferences have been saved",
    })

    // Redirect to home
    router.push("/")
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
              {isEditing ? "Edit Your Preferences" : "Personalize Your News Feed"}
            </CardTitle>
            <CardDescription className="text-center">
              Select at least 3 news sources and 3 categories that interest you
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">News Sources</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Selected: {selectedAuthors.length} (minimum 3 required)
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {authors.map((author) => (
                  <div key={author} className="flex items-start space-x-2">
                    <Checkbox
                      id={`author-${author}`}
                      checked={selectedAuthors.includes(author)}
                      onCheckedChange={() => toggleAuthor(author)}
                    />
                    <Label htmlFor={`author-${author}`} className="text-sm font-normal cursor-pointer">
                      {author}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Categories</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Selected: {selectedCategories.length} (minimum 3 required)
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categories.map((category) => (
                  <div key={category} className="flex items-start space-x-2">
                    <Checkbox
                      id={`category-${category}`}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={() => toggleCategory(category)}
                    />
                    <Label htmlFor={`category-${category}`} className="text-sm font-normal cursor-pointer">
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleSubmit}
              className="w-full"
              disabled={selectedAuthors.length < 3 || selectedCategories.length < 3}
            >
              <Check className="mr-2 h-4 w-4" />
              {isEditing ? "Save Changes" : "Complete Setup"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

