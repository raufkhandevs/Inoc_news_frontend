"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { User } from "lucide-react"
import { useAuth } from "@/lib/hooks/use-auth"
import { Author, Category } from "@/lib/types"

interface ProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProfileDialog({ open, onOpenChange }: ProfileDialogProps) {
  const { user } = useAuth()

  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Profile</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6">
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.avatar} alt={`${user.name}`} />
              <AvatarFallback className="text-4xl bg-primary/10">
                <User className="h-12 w-12 text-primary" />
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h2 className="text-2xl font-bold">{`${user.name}`}</h2>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className="grid gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="grid gap-2">
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label>First Name</Label>
                    <span className="col-span-2">{user.name}</span>
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label>Email</Label>
                    <span className="col-span-2">{user.email}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {user.preferences && (
              <Card>
                <CardContent className="pt-6">
                  <div className="grid gap-4">
                    <div>
                      <Label className="text-base">Selected Categories</Label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {user.preferences.categories.map((category: Category, index: number) => (
                          <span key={`category-${index}`} className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
                            {category.name}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label className="text-base">Selected Sources</Label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {user.preferences.authors.map((author: Author, index: number) => (
                          <span key={`author-${index}`} className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
                            {author.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

