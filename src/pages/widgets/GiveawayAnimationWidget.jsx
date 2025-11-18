import { useState, useEffect } from 'react'

export default function GiveawayAnimationWidget() {
  const [phase, setPhase] = useState('idle') // idle, intro, rolling, winner
  const [participants, setParticipants] = useState([])
  const [currentRoll, setCurrentRoll] = useState('')
  const [winner, setWinner] = useState(null)
  const [line1, setLine1] = useState("IT'S SUPER AWESOME")
  const [line2, setLine2] = useState("GIVEAWAY TIME!")
  const [ws, setWs] = useState(null)

  useEffect(() => {
    const websocket = new WebSocket('ws://localhost:3000/ws')

    websocket.onopen = () => {
      console.log('Giveaway Animation Widget connected')
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

  const handleMessage = (data) => {
    switch (data.type) {
      case 'giveaway_started':
        setPhase('intro')
        setParticipants(data.participants || [])
        setLine1(data.line1 || "IT'S SUPER AWESOME")
        setLine2(data.line2 || "GIVEAWAY TIME!")
        
        // Show intro for 3 seconds, then start rolling
        setTimeout(() => {
          setPhase('rolling')
          startRolling(data.participants || [])
        }, 3000)
        break
      case 'participant_added':
        setParticipants(prev => [...prev, data.participant])
        break
      case 'winners_drawn':
        setWinner(data.winners[0])
        setPhase('winner')
        break
    }
  }

  const startRolling = (participantList) => {
    if (participantList.length === 0) return

    let count = 0
    const maxRolls = 50
    const interval = setInterval(() => {
      const randomParticipant = participantList[Math.floor(Math.random() * participantList.length)]
      setCurrentRoll(randomParticipant.displayName)
      count++

      if (count >= maxRolls) {
        clearInterval(interval)
      }
    }, 100)
  }

  if (phase === 'idle') {
    return null
  }

  if (phase === 'intro') {
    return (
      <div className="fixed inset-0 bg-black overflow-hidden">
        {/* Animated particles background */}
        <div className="absolute inset-0">
          {[...Array(100)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                opacity: Math.random() * 0.7 + 0.3
              }}
            />
          ))}
        </div>

        {/* Diagonal stripe */}
        <div 
          className="absolute w-full h-full bg-gradient-to-br from-transparent via-gray-600 to-transparent opacity-30"
          style={{
            transform: 'rotate(-15deg) translateY(-20%)',
            width: '150%',
            left: '-25%'
          }}
        />

        {/* Main text */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center animate-bounce-in">
            <h1 
              className="text-8xl font-black text-white mb-4"
              style={{
                textShadow: '4px 4px 8px rgba(0,0,0,0.8), 0 0 20px rgba(255,255,255,0.3)',
                fontFamily: 'Impact, sans-serif',
                letterSpacing: '0.05em',
                transform: 'scaleY(1.2)'
              }}
            >
              {line1}
            </h1>
            <h2 
              className="text-8xl font-black text-white"
              style={{
                textShadow: '4px 4px 8px rgba(0,0,0,0.8), 0 0 20px rgba(255,255,255,0.3)',
                fontFamily: 'Impact, sans-serif',
                letterSpacing: '0.05em',
                transform: 'scaleY(1.2)'
              }}
            >
              {line2}
            </h2>
          </div>
        </div>
      </div>
    )
  }

  if (phase === 'rolling') {
    return (
      <div className="fixed inset-0 bg-gradient-to-b from-gray-900 to-gray-800 overflow-hidden">
        {/* Animated particles */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        {/* Rolling names */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full">
          <h2 className="text-6xl font-black text-white mb-8" style={{ fontFamily: 'Impact, sans-serif' }}>
            {line2}
          </h2>
          
          <div className="space-y-4 text-center">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="text-7xl font-black text-white animate-pulse"
                style={{
                  fontFamily: 'Impact, sans-serif',
                  textShadow: '4px 4px 8px rgba(0,0,0,0.8)',
                  animationDelay: `${i * 0.1}s`,
                  opacity: 1 - (i * 0.2)
                }}
              >
                {currentRoll || 'DEMO'}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (phase === 'winner' && winner) {
    return (
      <div className="fixed inset-0 bg-black overflow-hidden">
        {/* Animated particles */}
        <div className="absolute inset-0">
          {[...Array(150)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        {/* Radial burst effect */}
        <div className="absolute inset-0 flex items-center justify-center">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-96 bg-gradient-to-t from-transparent via-white to-transparent opacity-20"
              style={{
                transform: `rotate(${i * 30}deg)`,
                transformOrigin: 'center'
              }}
            />
          ))}
        </div>

        {/* Winner announcement */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full animate-bounce-in">
          <div className="text-center mb-8">
            <h1 
              className="text-9xl font-black text-white mb-4"
              style={{
                textShadow: '6px 6px 12px rgba(0,0,0,0.9), 0 0 30px rgba(255,215,0,0.5)',
                fontFamily: 'Impact, sans-serif',
                letterSpacing: '0.05em',
                transform: 'scaleY(1.2)'
              }}
            >
              {winner.displayName.toUpperCase()}
            </h1>
            <h2 
              className="text-6xl font-black text-gray-300"
              style={{
                textShadow: '4px 4px 8px rgba(0,0,0,0.8)',
                fontFamily: 'Impact, sans-serif'
              }}
            >
              IS OUR
            </h2>
            <h2 
              className="text-7xl font-black text-white mt-2"
              style={{
                textShadow: '4px 4px 8px rgba(0,0,0,0.8)',
                fontFamily: 'Impact, sans-serif'
              }}
            >
              WINNER!
            </h2>
          </div>

          {/* Winner username box */}
          <div className="bg-gray-900 border-4 border-white rounded-lg px-12 py-6 mt-8">
            <p className="text-4xl font-bold text-white" style={{ fontFamily: 'monospace' }}>
              {winner.username}
            </p>
          </div>

          {/* Animated mascot placeholder */}
          <div className="mt-12 text-8xl animate-bounce">
            🎉
          </div>
        </div>
      </div>
    )
  }

  return null
}
