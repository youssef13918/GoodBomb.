import GameComponent from "@/components/game-component"
import Pay from "@/components/Pay"

export default function Home() {
  return (
    <main>
      <GameComponent />
      <div className="fixed bottom-4 right-4">
        <Pay />
      </div>
    </main>
  )
}
