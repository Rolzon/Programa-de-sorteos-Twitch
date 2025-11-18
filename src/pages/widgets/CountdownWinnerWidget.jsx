import { useState, useEffect } from 'react'

export default function CountdownWinnerWidget() {
  const [isActive, setIsActive] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)
  const [winnerName, setWinnerName] = useState('DEMO')
  const [quickMessage, setQuickMessage] = useState('QUICK! Show yourself! Talk in the chat!')
  const [ws, setWs] = useState(null)

  useEffect(() => {
    const websocket = new WebSocket('ws://localhost:3000/ws')

    websocket.onopen = () => {
      console.log('Countdown Winner Widget connected')
    }

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      handleMessage(data)
    }

    setWs(websocket)

    return () => {
      if (websocket) {
        websocket.close()
      }
    }
  }, [])

  useEffect(() => {
    if (!isActive || timeLeft <= 0) return

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsActive(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive, timeLeft])

  const handleMessage = (data) => {
    switch (data.type) {
      case 'countdown_start':
        setIsActive(true)
        setTimeLeft(data.duration || 30)
        setWinnerName(data.winnerName || 'DEMO')
        setQuickMessage(data.message || 'QUICK! Show yourself! Talk in the chat!')
        break
      case 'countdown_stop':
        setIsActive(false)
        break
      case 'winner_claimed':
        setIsActive(false)
        break
    }
  }

  if (!isActive && timeLeft === 0) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-black overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0">
        {[...Array(80)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              opacity: Math.random() * 0.5 + 0.2
            }}
          />
        ))}
      </div>

      {/* Animated gears/cogs in background */}
      <div className="absolute right-0 top-0 w-64 h-64 opacity-10">
        <svg viewBox="0 0 100 100" className="animate-spin-slow">
          <circle cx="50" cy="50" r="40" fill="none" stroke="white" strokeWidth="2"/>
          {[...Array(8)].map((_, i) => (
            <rect
              key={i}
              x="48"
              y="10"
              width="4"
              height="15"
              fill="white"
              transform={`rotate(${i * 45} 50 50)`}
            />
          ))}
        </svg>
      </div>

      <div className="absolute left-0 bottom-0 w-48 h-48 opacity-10">
        <svg viewBox="0 0 100 100" className="animate-spin-reverse">
          <circle cx="50" cy="50" r="35" fill="none" stroke="white" strokeWidth="2"/>
          {[...Array(6)].map((_, i) => (
            <rect
              key={i}
              x="48"
              y="15"
              width="4"
              height="12"
              fill="white"
              transform={`rotate(${i * 60} 50 50)`}
            />
          ))}
        </svg>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-8">
        {/* Winner name with rope/chain effect */}
        <div className="relative mb-12">
          {/* Rope/chain visual */}
          <div className="absolute -top-32 left-1/2 transform -translate-x-1/2 w-2 h-32 bg-gradient-to-b from-yellow-600 via-yellow-700 to-yellow-800 opacity-70">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-4 h-1 bg-yellow-600 left-1/2 transform -translate-x-1/2"
                style={{ top: `${i * 12}%` }}
              />
            ))}
          </div>

          {/* Winner name box */}
          <div 
            className="bg-gradient-to-br from-gray-800 to-gray-900 border-4 border-yellow-500 rounded-xl px-16 py-8 shadow-2xl animate-swing"
            style={{
              boxShadow: '0 0 40px rgba(234, 179, 8, 0.3), inset 0 0 20px rgba(0,0,0,0.5)'
            }}
          >
            <h1 
              className="text-8xl font-black text-white text-center"
              style={{
                textShadow: '4px 4px 8px rgba(0,0,0,0.9)',
                fontFamily: 'Impact, sans-serif',
                letterSpacing: '0.05em',
                transform: 'scaleY(1.1)'
              }}
            >
              {winnerName}
            </h1>
          </div>
        </div>

        {/* Countdown timer */}
        <div className="relative mb-8">
          <div 
            className={`text-9xl font-black ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-white'}`}
            style={{
              textShadow: '6px 6px 12px rgba(0,0,0,0.9)',
              fontFamily: 'Impact, sans-serif',
              fontSize: '12rem'
            }}
          >
            {timeLeft}
          </div>
          
          {/* Circular progress indicator */}
          <svg className="absolute -inset-8" viewBox="0 0 200 200">
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="4"
            />
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke={timeLeft <= 10 ? '#ef4444' : '#eab308'}
              strokeWidth="4"
              strokeDasharray={`${(timeLeft / 30) * 565} 565`}
              strokeLinecap="round"
              transform="rotate(-90 100 100)"
              className="transition-all duration-1000"
            />
          </svg>
        </div>

        {/* Quick message */}
        <div className="bg-gray-900/80 backdrop-blur-sm border-2 border-gray-700 rounded-lg px-12 py-6 max-w-4xl">
          <p 
            className="text-4xl font-bold text-center text-white"
            style={{
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
              fontFamily: 'Arial, sans-serif'
            }}
          >
            {quickMessage}
          </p>
        </div>

        {/* Animated warning indicators */}
        {timeLeft <= 10 && (
          <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-8">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-16 h-16 bg-red-500 rounded-full animate-pulse"
                style={{
                  animationDelay: `${i * 0.2}s`,
                  boxShadow: '0 0 20px rgba(239, 68, 68, 0.8)'
                }}
              />
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes swing {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(2deg); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-swing {
          animation: swing 3s ease-in-out infinite;
          transform-origin: top center;
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .animate-spin-reverse {
          animation: spin-reverse 15s linear infinite;
        }
      `}</style>
    </div>
  )
}
