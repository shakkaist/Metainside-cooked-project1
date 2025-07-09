import React, { useEffect, useRef, useState } from 'react';

    const SnakeGame: React.FC = () => {
      const canvasRef = useRef<HTMLCanvasElement | null>(null);
      const [snake, setSnake] = useState([{ x: 0, y: 0 }]);
      const [food, setFood] = useState({ x: 0, y: 0 });
      const [direction, setDirection] = useState({ x: 0, y: 0 });
      const [gameOver, setGameOver] = useState(false);
      const [score, setScore] = useState(0);

      const canvasSize = 400;
      const boxSize = 20;

      useEffect(() => {
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvasSize, canvasSize);
          ctx.fillStyle = 'green';
          snake.forEach(segment => {
            ctx.fillRect(segment.x, segment.y, boxSize, boxSize);
          });
          ctx.fillStyle = 'red';
          ctx.fillRect(food.x, food.y, boxSize, boxSize);
        }
      }, [snake, food]);

      useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
          switch (e.key) {
            case 'ArrowUp':
              setDirection({ x: 0, y: -boxSize });
              break;
            case 'ArrowDown':
              setDirection({ x: 0, y: boxSize });
              break;
            case 'ArrowLeft':
              setDirection({ x: -boxSize, y: 0 });
              break;
            case 'ArrowRight':
              setDirection({ x: boxSize, y: 0 });
              break;
          }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
          window.removeEventListener('keydown', handleKeyDown);
        };
      }, []);

      useEffect(() => {
        const gameLoop = setInterval(() => {
          if (!gameOver) {
            const newSnake = [...snake];
            const head = { x: newSnake[0].x + direction.x, y: newSnake[0].y + direction.y };

            if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize || newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
              setGameOver(true);
              clearInterval(gameLoop);
              return;
            }

            newSnake.unshift(head);

            if (head.x === food.x && head.y === food.y) {
              setScore(score + 1);
              setFood({ x: Math.floor(Math.random() * (canvasSize / boxSize)) * boxSize, y: Math.floor(Math.random() * (canvasSize / boxSize)) * boxSize });
            } else {
              newSnake.pop();
            }

            setSnake(newSnake);
          }
        }, 100);

        return () => clearInterval(gameLoop);
      }, [snake, direction, gameOver]);

      return (
        <div className="flex flex-col items-center">
          <canvas ref={canvasRef} width={canvasSize} height={canvasSize} className="border border-black"></canvas>
          {gameOver && <div className="text-red-500 mt-4">Game Over! Score: {score}</div>}
        </div>
      );
    };

    export default SnakeGame;
