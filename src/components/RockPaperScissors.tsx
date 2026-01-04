import { useState } from "react";

type Choice = "rock" | "paper" | "scissors";
type Result = "win" | "lose" | "tie" | null;

const choices: { id: Choice; emoji: string; label: string }[] = [
  { id: "rock", emoji: "✊", label: "Rock" },
  { id: "paper", emoji: "✋", label: "Paper" },
  { id: "scissors", emoji: "✌️", label: "Scissors" },
];

const getComputerChoice = (): Choice => {
  const options: Choice[] = ["rock", "paper", "scissors"];
  return options[Math.floor(Math.random() * 3)];
};

const determineWinner = (player: Choice, computer: Choice): Result => {
  if (player === computer) return "tie";
  if (
    (player === "rock" && computer === "scissors") ||
    (player === "scissors" && computer === "paper") ||
    (player === "paper" && computer === "rock")
  ) {
    return "win";
  }
  return "lose";
};

const RockPaperScissors = () => {
  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
  const [computerChoice, setComputerChoice] = useState<Choice | null>(null);
  const [result, setResult] = useState<Result>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState({ player: 0, computer: 0, ties: 0 });

  const handleChoice = (choice: Choice) => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    setPlayerChoice(choice);
    setComputerChoice(null);
    setResult(null);

    // Simulate computer "thinking"
    setTimeout(() => {
      const compChoice = getComputerChoice();
      setComputerChoice(compChoice);
      
      const gameResult = determineWinner(choice, compChoice);
      setResult(gameResult);
      
      setScore((prev) => ({
        player: prev.player + (gameResult === "win" ? 1 : 0),
        computer: prev.computer + (gameResult === "lose" ? 1 : 0),
        ties: prev.ties + (gameResult === "tie" ? 1 : 0),
      }));
      
      setIsPlaying(false);
    }, 800);
  };

  const resetGame = () => {
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult(null);
  };

  const resetScore = () => {
    setScore({ player: 0, computer: 0, ties: 0 });
    resetGame();
  };

  const getChoiceEmoji = (choice: Choice | null) => {
    if (!choice) return "❓";
    return choices.find((c) => c.id === choice)?.emoji || "❓";
  };

  const getResultMessage = () => {
    if (!result) return "";
    if (result === "win") return "🎉 You Win!";
    if (result === "lose") return "😔 You Lose!";
    return "🤝 It's a Tie!";
  };

  const getResultClass = () => {
    if (!result) return "";
    if (result === "win") return "text-green-500";
    if (result === "lose") return "text-red-400";
    return "text-blue-400";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex flex-col items-center justify-center p-4">
      {/* Game Container */}
      <div className="w-full max-w-md">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-700 mb-2 drop-shadow-sm">
            Pugam Pugai
          </h1>
          <p className="text-gray-400 text-sm">Rock • Paper • Scissors</p>
        </div>

        {/* Score Board */}
        <div className="flex justify-center gap-4 mb-8">
          <div className="neumorphic-card px-6 py-3 text-center">
            <p className="text-xs text-gray-400 uppercase tracking-wide">You</p>
            <p className="text-2xl font-bold text-gray-600">{score.player}</p>
          </div>
          <div className="neumorphic-card px-4 py-3 text-center">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Ties</p>
            <p className="text-2xl font-bold text-gray-500">{score.ties}</p>
          </div>
          <div className="neumorphic-card px-6 py-3 text-center">
            <p className="text-xs text-gray-400 uppercase tracking-wide">CPU</p>
            <p className="text-2xl font-bold text-gray-600">{score.computer}</p>
          </div>
        </div>

        {/* Battle Arena */}
        {(playerChoice || isPlaying) && (
          <div className="flex justify-center items-center gap-8 mb-8 animate-fade-in">
            <div className="text-center">
              <div className="neumorphic-display w-20 h-20 flex items-center justify-center text-4xl mb-2">
                {getChoiceEmoji(playerChoice)}
              </div>
              <p className="text-xs text-gray-400">You</p>
            </div>
            
            <div className="text-2xl font-bold text-gray-300">VS</div>
            
            <div className="text-center">
              <div className={`neumorphic-display w-20 h-20 flex items-center justify-center text-4xl mb-2 ${isPlaying && !computerChoice ? 'animate-pulse' : ''}`}>
                {isPlaying && !computerChoice ? "🤔" : getChoiceEmoji(computerChoice)}
              </div>
              <p className="text-xs text-gray-400">CPU</p>
            </div>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className={`text-center mb-8 animate-scale-in`}>
            <p className={`text-3xl font-bold ${getResultClass()}`}>
              {getResultMessage()}
            </p>
          </div>
        )}

        {/* Choice Buttons */}
        <div className="flex justify-center gap-4 mb-8">
          {choices.map((choice) => (
            <button
              key={choice.id}
              onClick={() => handleChoice(choice.id)}
              disabled={isPlaying}
              className={`neumorphic-button group flex flex-col items-center justify-center w-24 h-28 transition-all duration-200 ${
                isPlaying ? "opacity-50 cursor-not-allowed" : ""
              } ${playerChoice === choice.id ? "neumorphic-button-pressed" : ""}`}
            >
              <span className="text-4xl mb-1 group-hover:scale-110 transition-transform">
                {choice.emoji}
              </span>
              <span className="text-xs text-gray-500 font-medium">
                {choice.label}
              </span>
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          {playerChoice && !isPlaying && (
            <button
              onClick={resetGame}
              className="neumorphic-button-small px-6 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Play Again
            </button>
          )}
          <button
            onClick={resetScore}
            className="neumorphic-button-small px-6 py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            Reset Score
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 text-center">
        <p className="text-gray-400 text-sm">
          Developed by <span className="font-medium text-gray-500">Mahnoor</span> and{" "}
          <span className="font-medium text-gray-500">Haris</span>
        </p>
      </footer>
    </div>
  );
};

export default RockPaperScissors;
