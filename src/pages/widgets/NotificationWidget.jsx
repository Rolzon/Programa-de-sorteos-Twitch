import { useState, useEffect } from 'react'
import { Heart, Star, Gift, Users } from 'lucide-react'

export default function NotificationWidget() {
  const [notifications, setNotifications] = useState([])
  const [ws, setWs] = useState(null)

  useEffect(() => {
    const websocket = new WebSocket('ws://localhost:3000/ws')

    websocket.onopen = () => {
      console.log('Notification Widget WebSocket connected')
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
    let notification = null

    switch (data.type) {
      case 'new_follower':
        notification = {
          id: Date.now(),
          type: 'follow',
          icon: Heart,
          color: 'from-pink-500 to-rose-500',
          title: '¡Nuevo Seguidor!',
          message: data.username,
        }
        break
      case 'new_subscriber':
        notification = {
          id: Date.now(),
          type: 'sub',
          icon: Star,
          color: 'from-purple-500 to-indigo-500',
          title: '¡Nueva Suscripción!',
          message: data.username,
        }
        break
      case 'new_donation':
        notification = {
          id: Date.now(),
          type: 'donation',
          icon: Gift,
          color: 'from-yellow-500 to-orange-500',
          title: '¡Donación!',
          message: `${data.username} - $${data.amount}`,
        }
        break
      case 'new_host':
        notification = {
          id: Date.now(),
          type: 'host',
          icon: Users,
          color: 'from-blue-500 to-cyan-500',
          title: '¡Nuevo Host!',
          message: `${data.username} con ${data.viewers} viewers`,
        }
        break
    }

    if (notification) {
      setNotifications(prev => [...prev, notification])
      
      // Remove notification after 5 seconds
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id))
      }, 5000)
    }
  }

  return (
    <div className="fixed top-8 left-8 space-y-4 w-96">
      {notifications.map((notification) => {
        const Icon = notification.icon
        return (
          <div
            key={notification.id}
            className={`bg-gradient-to-r ${notification.color} rounded-2xl p-6 shadow-2xl animate-slide-in`}
          >
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                <Icon className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-1">
                  {notification.title}
                </h3>
                <p className="text-lg text-white/90">
                  {notification.message}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
