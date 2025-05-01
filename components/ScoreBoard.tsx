interface ScoreBoardProps {
  score: number
}

export default function ScoreBoard({ score }: ScoreBoardProps) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-2">Score</h2>
      <div className="text-3xl font-mono">{score}</div>
    </div>
  )
}
