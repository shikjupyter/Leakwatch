"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type ProfileImageContextType = {
  profileImage: string
  updateProfileImage: (image: string) => void
}

const ProfileImageContext = createContext<ProfileImageContextType | undefined>(undefined)

export function ProfileImageProvider({ children }: { children: React.ReactNode }) {
  const [profileImage, setProfileImage] = useState<string>("/placeholder.svg?height=96&width=96")

  // Load saved image from localStorage on initial render
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedImage = localStorage.getItem("profileImage")
      if (savedImage) {
        setProfileImage(savedImage)
      }
    }
  }, [])

  const updateProfileImage = (image: string) => {
    setProfileImage(image)
    // Save to localStorage for persistence
    if (typeof window !== "undefined") {
      localStorage.setItem("profileImage", image)
    }
  }

  return (
    <ProfileImageContext.Provider value={{ profileImage, updateProfileImage }}>{children}</ProfileImageContext.Provider>
  )
}

export function useProfileImage() {
  const context = useContext(ProfileImageContext)
  if (context === undefined) {
    throw new Error("useProfileImage must be used within a ProfileImageProvider")
  }
  return context
}
