"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Globe, Volume2, Bell, Moon } from "lucide-react"
import { useSettings } from "@/context/settings-context"

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const {
    language,
    setLanguage,
    soundEnabled,
    setSoundEnabled,
    notificationsEnabled,
    setNotificationsEnabled,
    theme,
    setTheme,
    texts,
  } = useSettings()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-olive-900 border-olive-700 text-white max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-olive-300">{texts.settings}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid grid-cols-2 bg-olive-800">
            <TabsTrigger value="general" className="data-[state=active]:bg-olive-700 data-[state=active]:text-white">
              {texts.general}
            </TabsTrigger>
            <TabsTrigger value="rules" className="data-[state=active]:bg-olive-700 data-[state=active]:text-white">
              {texts.rules}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="mt-4 space-y-6">
            {/* Language */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="text-olive-300" size={20} />
                  <Label className="text-lg">{texts.language}</Label>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md border ${language === "es" ? "bg-olive-700 border-olive-500 text-white" : "bg-olive-800 border-olive-600 text-gray-300 hover:bg-olive-700"}`}
                  onClick={() => setLanguage("es")}
                >
                  <span>🇪🇸</span>
                  <span>Español</span>
                </button>
                <button
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md border ${language === "en" ? "bg-olive-700 border-olive-500 text-white" : "bg-olive-800 border-olive-600 text-gray-300 hover:bg-olive-700"}`}
                  onClick={() => setLanguage("en")}
                >
                  <span>🇬🇧</span>
                  <span>English</span>
                </button>
              </div>
            </div>

            {/* Sound */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="text-olive-300" size={20} />
                <Label className="text-lg">{texts.sound}</Label>
              </div>
              <Switch
                checked={soundEnabled}
                onCheckedChange={setSoundEnabled}
                className="data-[state=checked]:bg-olive-500"
              />
            </div>

            {/* Notifications */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="text-olive-300" size={20} />
                <Label className="text-lg">{texts.notifications}</Label>
              </div>
              <Switch
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
                className="data-[state=checked]:bg-olive-500"
              />
            </div>

            {/* Theme */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Moon className="text-olive-300" size={20} />
                <Label className="text-lg">{texts.theme}</Label>
              </div>
              <Switch
                checked={theme === "dark"}
                onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                className="data-[state=checked]:bg-olive-500"
              />
            </div>
          </TabsContent>

          <TabsContent value="rules" className="mt-4 space-y-4">
            <div className="bg-olive-800 p-4 rounded-md border border-olive-600">
              <h3 className="text-lg text-olive-300 mb-2">📜 {texts.rulesTitle}</h3>

              <div className="space-y-3 text-sm text-gray-200">
                <p>{texts.rulesObjective}</p>

                <div>
                  <p className="font-bold mb-1">{texts.rulesParticipation}:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>{texts.rulesButtonCost}</li>
                    <li>{texts.rulesEachPress}</li>
                    <li>{texts.rulesTimerReset}</li>
                    <li>{texts.rulesNameAppears}</li>
                    <li>{texts.rulesPotIncrease}</li>
                  </ul>
                </div>

                <div>
                  <p className="font-bold mb-1">{texts.rulesExplosion}:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>{texts.rulesCounterZero}</li>
                    <li>{texts.rulesLastPlayerWins}</li>
                    <li>{texts.rulesPotTransfer}</li>
                  </ul>
                </div>

                <div>
                  <p className="font-bold mb-1">{texts.rulesCommissions}:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>{texts.rulesCommissionDetails}</li>
                    <li>{texts.rulesCreatorCommission}</li>
                    <li>{texts.rulesNextRoundCommission}</li>
                  </ul>
                </div>

                <div>
                  <p className="font-bold mb-1">{texts.rulesImportantNotes}:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>{texts.rulesWorldAppConnection}</li>
                    <li>{texts.rulesVerifiedActions}</li>
                    <li>{texts.rulesNoPersonalData}</li>
                    <li>{texts.rulesAutoReset}</li>
                    <li>{texts.rulesPlayResponsibly}</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
