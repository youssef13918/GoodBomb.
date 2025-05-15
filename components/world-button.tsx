"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { User, AlertTriangle, Check } from "lucide-react"

interface WorldButtonProps {
  onSuccess: (username: string) => void
  recipientAddress?: string
}

export default function WorldButton({
  onSuccess,
  recipientAddress = process.env.NEXT_PUBLIC_RECIPIENT_ADDRESS || "",
}: WorldButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [username, setUsername] = useState<string | null>(null)
  const [isWorldAppInstalled, setIsWorldAppInstalled] = useState(false)
  const [isDevelopmentMode, setIsDevelopmentMode] = useState(true) // Default to development mode
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Check if World App is installed
  useEffect(() => {
    const checkWorldApp = async () => {
      try {
        // Check if we're in a browser environment
        if (typeof window === "undefined") {
          setIsDevelopmentMode(true)
          return
        }

        // Try to dynamically import MiniKit to avoid errors
        try {
          // Check if MiniKit is available globally
          if (typeof window !== "undefined" && "MiniKit" in window) {
            setIsWorldAppInstalled(true)
            setIsDevelopmentMode(false)

            // Try to get the username
            try {
              // @ts-ignore - MiniKit is available globally
              const user = await window.MiniKit.getUser()
              if (user && user.username) {
                setUsername(user.username)
              }
            } catch (userError) {
              console.error("Error getting user:", userError)
            }
          } else {
            console.log("MiniKit not found, using development mode")
            setIsDevelopmentMode(true)
            setUsername("dev_user")
          }
        } catch (error) {
          console.error("Error checking MiniKit:", error)
          setIsDevelopmentMode(true)
        }
      } catch (error) {
        console.error("General error:", error)
        setIsDevelopmentMode(true)
      }
    }

    checkWorldApp()
  }, [])

  const handleButtonPress = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // If we're in development mode, simulate the process
      if (isDevelopmentMode) {
        // Simulate a delay
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Simulate successful verification
        setIsVerified(true)

        // Simulate username
        const mockUsername = "User" + Math.floor(Math.random() * 1000)

        // Notify success
        toast({
          title: "Simulation successful!",
          description: "Development mode: Verification and payment simulated",
        })

        // Call the callback with the simulated username
        onSuccess(mockUsername)
        return
      }

      // Real code for World App (will only execute if isWorldAppInstalled is true)
      if (!isWorldAppInstalled) {
        setError("World App is not installed. Please open this application from World App.")
        return
      }

      // In development mode, we don't try to import MiniKit
      if (!isDevelopmentMode) {
        // This code will never execute in development mode
        setError("This functionality is only available in World App.")
        return
      }
    } catch (error) {
      console.error("Error:", error)
      setError(error instanceof Error ? error.message : "Unknown error")
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isVerified && (
        <Alert>
          <Check className="h-4 w-4 text-green-500" />
          <AlertTitle>Verified with World ID</AlertTitle>
          <AlertDescription>Your identity has been verified</AlertDescription>
        </Alert>
      )}

      {username && (
        <div className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-md">
          <User className="h-4 w-4" />
          <span>User: {username}</span>
        </div>
      )}

      <Button
        onClick={handleButtonPress}
        disabled={isLoading}
        className="w-full py-6 bg-red-600 hover:bg-red-700 text-white font-bold text-lg"
      >
        {isLoading ? "Processing..." : isDevelopmentMode ? "Press the button (Development mode)" : "Press the button"}
      </Button>
    </div>
  )
}
