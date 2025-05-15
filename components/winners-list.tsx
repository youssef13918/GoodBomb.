"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Trophy, Calendar, Coins } from "lucide-react"

interface Winner {
  username: string
  timestamp: number
  amount: number
}

interface WinnersListProps {
  winners: Winner[]
}

export default function WinnersList({ winners }: WinnersListProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="flex items-center gap-2 bg-olive-800 border-olive-600 hover:bg-olive-700 text-olive-300 hover:text-white"
      >
        <Trophy size={16} />
        <span>Ganadores</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-olive-900 border-olive-700 text-white max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl text-olive-300 flex items-center gap-2">
              <Trophy className="text-yellow-400" size={20} />
              <span>Salón de la Fama</span>
            </DialogTitle>
          </DialogHeader>

          {winners.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-400">Aún no hay ganadores</p>
            </div>
          ) : (
            <div className="space-y-4">
              {winners.map((winner, index) => (
                <div
                  key={`${winner.username}-${winner.timestamp}`}
                  className="p-3 bg-olive-800/50 border border-olive-700 rounded-md"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-yellow-600 flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-yellow-300">{winner.username}</h4>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Calendar size={12} />
                          <span>{new Date(winner.timestamp).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-black/30 px-2 py-1 rounded-md">
                      <Coins className="text-yellow-400" size={14} />
                      <span className="text-yellow-300 font-bold">{winner.amount.toFixed(2)} WLD</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
