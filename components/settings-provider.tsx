"use client"

import type React from "react"
import { SettingsProvider as SettingsContext } from "@/context/settings-context"

interface SettingsProviderProps {
  children: React.ReactNode
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  return <SettingsContext>{children}</SettingsContext>
}
