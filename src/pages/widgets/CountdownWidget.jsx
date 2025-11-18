import { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'

export default function CountdownWidget() {
  const [timeLeft, setTimeLeft] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [ws, setWs] = useState(null)

  useEffect(() => {
    const websocket = new WebSocket('ws://localhost:3000/ws')

    websocket.onopen = () => {
      console.log('Countdown Widget WebSocket connected')
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
        setTimeLeft(data.duration)
        setIsActive(true)
        break
      case 'countdown_stop':
        setIsActive(false)
        setTimeLeft(0)
        break
    }
  }

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!isActive && timeLeft === 0) {
    return null
  }

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2">
      <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-3xl p-8 shadow-2xl border-4 border-white/20 animate-glow">
        <div className="flex items-center gap-6">
          <Clock className="w-16 h-16 text-white animate-pulse" />
          <div className="text-center">
            <div className="text-sm text-white/70 mb-1 uppercase tracking-wider">
              Tiempo restante
            </div>
            <div className="text-7xl font-bold text-white tabular-nums">
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
