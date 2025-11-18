import { useState, useEffect } from 'react'
import { Trophy, Users, Clock } from 'lucide-react'

export default function GiveawayWidget() {
  const [giveaway, setGiveaway] = useState(null)
  const [participants, setParticipants] = useState([])
  const [winners, setWinners] = useState([])
  const [timeLeft, setTimeLeft] = useState(0)
  const [ws, setWs] = useState(null)

  useEffect(() => {
    // Get giveaway ID from URL
    const params = new URLSearchParams(window.location.search)
    const giveawayId = params.get('giveaway')

    // Connect to WebSocket
    const websocket = new WebSocket('ws://localhost:3000/ws')

    websocket.onopen = () => {
      console.log('Widget WebSocket connected')
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
    if (!giveaway || giveaway.status !== 'active') return

    const interval = setInterval(() => {
      const elapsed = Date.now() - giveaway.startedAt
      const remaining = Math.max(0, (giveaway.duration * 1000) - elapsed)
      setTimeLeft(Math.ceil(remaining / 1000))

      if (remaining === 0) {
        clearInterval(interval)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [giveaway])

  const handleMessage = (data) => {
    switch (data.type) {
      case 'giveaway_started':
        setGiveaway(data.giveaway)
        setParticipants([])
        setWinners([])
        break
      case 'participant_added':
        setParticipants(prev => [...prev, data.participant])
        break
      case 'winners_drawn':
        setWinners(data.winners)
        setGiveaway(data.giveaway)
        break
      case 'giveaway_ended':
        setGiveaway(data.giveaway)
        break
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!giveaway) {
    return null
  }

  if (winners.length > 0) {
    return (
      <div className="fixed inset-0 flex items-center justify-center p-8">
        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-3xl p-8 shadow-2xl animate-bounce-in max-w-2xl w-full">
          <div className="text-center space-y-6">
            <Trophy className="w-24 h-24 mx-auto text-white animate-pulse" />
            <h1 className="text-6xl font-bold text-white drop-shadow-lg">
              ¡GANADOR{winners.length > 1 ? 'ES' : ''}!
            </h1>
            <div className="space-y-4">
              {winners.map((winner, index) => (
                <div
                  key={winner.userId}
                  className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 animate-slide-in"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="text-5xl font-bold text-white">
                    {winner.displayName}
                  </div>
                  <div className="text-2xl text-white/80 mt-2">
                    @{winner.username}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (giveaway.status === 'active') {
    return (
      <div className="fixed top-8 right-8 w-96">
        <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl p-6 shadow-2xl border-4 border-white/20 animate-glow">
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-2">
                {giveaway.title}
              </h2>
              {giveaway.description && (
                <p className="text-white/80 text-lg">{giveaway.description}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <Users className="w-8 h-8 mx-auto mb-2 text-white" />
                <div className="text-3xl font-bold text-white">
                  {participants.length}
                </div>
                <div className="text-white/70 text-sm">Participantes</div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <Clock className="w-8 h-8 mx-auto mb-2 text-white" />
                <div className="text-3xl font-bold text-white">
                  {formatTime(timeLeft)}
                </div>
                <div className="text-white/70 text-sm">Tiempo restante</div>
              </div>
            </div>

            {giveaway.keyword && (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="text-white/70 text-sm mb-1">
                  Escribe en el chat:
                </div>
                <div className="text-2xl font-bold text-white">
                  {giveaway.keyword}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return null
}
