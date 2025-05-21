"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Upload, X } from "lucide-react"
import { useProfileImage } from "@/components/profile-image-context"
import { useToast } from "@/components/ui/use-toast"

interface ProfileImageUploadProps {
  fallback: string
}

export function ProfileImageUpload({ fallback }: ProfileImageUploadProps) {
  const { profileImage, updateProfileImage } = useProfileImage()
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    // Create a URL for the file to preview it
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      updateProfileImage(result)
      setIsUploading(false)

      toast({
        title: "Profile picture updated",
        description: "Your profile picture has been successfully updated.",
      })
    }
    reader.readAsDataURL(file)
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveImage = () => {
    updateProfileImage("/placeholder.svg?height=96&width=96")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }

    toast({
      title: "Profile picture removed",
      description: "Your profile picture has been removed.",
    })
  }

  return (
    <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
      <div className="flex items-center justify-center">
        <Avatar className="h-24 w-24">
          <AvatarImage src={profileImage || "/placeholder.svg"} alt="Profile" />
          <AvatarFallback className="text-lg">{fallback}</AvatarFallback>
        </Avatar>
      </div>
      <div className="flex flex-col justify-center space-y-2">
        <h3 className="text-lg font-medium">Profile Picture</h3>
        <p className="text-sm text-muted-foreground">Upload a new profile picture or avatar.</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleUploadClick} disabled={isUploading}>
            {isUploading ? (
              "Uploading..."
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemoveImage}
            disabled={profileImage === "/placeholder.svg?height=96&width=96"}
          >
            <X className="mr-2 h-4 w-4" />
            Remove
          </Button>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
        </div>
      </div>
    </div>
  )
}
