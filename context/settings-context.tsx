"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { englishTexts, spanishTexts } from "@/lib/translations"

type Language = "es" | "en"
type Theme = "light" | "dark"

interface SettingsContextType {
  language: Language
  setLanguage: (language: Language) => void
  soundEnabled: boolean
  setSoundEnabled: (enabled: boolean) => void
  notificationsEnabled: boolean
  setNotificationsEnabled: (enabled: boolean) => void
  theme: Theme
  setTheme: (theme: Theme) => void
  texts: Record<string, string>
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  // Initialize state from localStorage if available
  const [language, setLanguageState] = useState<Language>("es")
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(true)
  const [notificationsEnabled, setNotificationsEnabledState] = useState<boolean>(true)
  const [theme, setThemeState] = useState<Theme>("dark")

  // Load settings from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedLanguage = localStorage.getItem("goodbomb-language")
        const savedSound = localStorage.getItem("goodbomb-sound")
        const savedNotifications = localStorage.getItem("goodbomb-notifications")
        const savedTheme = localStorage.getItem("goodbomb-theme")

        if (savedLanguage) setLanguageState(savedLanguage as Language)
        if (savedSound) setSoundEnabledState(savedSound === "true")
        if (savedNotifications) setNotificationsEnabledState(savedNotifications === "true")
        if (savedTheme) setThemeState(savedTheme as Theme)
      } catch (error) {
        console.error("Error loading settings from localStorage:", error)
      }
    }
  }, [])

  // Save settings to localStorage when they change
  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage)
    try {
      localStorage.setItem("goodbomb-language", newLanguage)
    } catch (error) {
      console.error("Error saving language to localStorage:", error)
    }
  }

  const setSoundEnabled = (enabled: boolean) => {
    setSoundEnabledState(enabled)
    try {
      localStorage.setItem("goodbomb-sound", String(enabled))
    } catch (error) {
      console.error("Error saving sound setting to localStorage:", error)
    }
  }

  const setNotificationsEnabled = (enabled: boolean) => {
    setNotificationsEnabledState(enabled)
    try {
      localStorage.setItem("goodbomb-notifications", String(enabled))
    } catch (error) {
      console.error("Error saving notifications setting to localStorage:", error)
    }
  }

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    try {
      localStorage.setItem("goodbomb-theme", newTheme)
    } catch (error) {
      console.error("Error saving theme to localStorage:", error)
    }
  }

  // Get the appropriate text translations based on language
  const texts = language === "es" ? spanishTexts : englishTexts

  return (
    <SettingsContext.Provider
      value={{
        language,
        setLanguage,
        soundEnabled,
        setSoundEnabled,
        notificationsEnabled,
        setNotificationsEnabled,
        theme,
        setTheme,
        texts,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}
