import { createContext, useContext, useEffect, useState, useRef } from 'react'
import { useToast } from '../components/ui/use-toast'

const WebSocketContext = createContext(null)

export function WebSocketProvider({ children }) {
  const [ws, setWs] = useState(null)
  const [connected, setConnected] = useState(false)
  const [messages, setMessages] = useState([])
  const { toast } = useToast()
  const reconnectTimeoutRef = useRef(null)

  useEffect(() => {
    connectWebSocket()

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      if (ws) {
        ws.close()
      }
    }
  }, [])

  const connectWebSocket = () => {
    // Build WebSocket URL that works in dev and production
    let wsUrl
    if (typeof window !== 'undefined') {
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      if (isLocal) {
        // Local development: backend on port 3007
        wsUrl = 'ws://localhost:3007/ws'
      } else {
        // Production: same origin, use wss if page is https
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
        wsUrl = `${protocol}//${window.location.host}/ws`
      }
    } else {
      wsUrl = 'ws://localhost:3007/ws'
    }

    const websocket = new WebSocket(wsUrl)

    websocket.onopen = () => {
      console.log('WebSocket connected')
      setConnected(true)
      setWs(websocket)
    }

    websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        setMessages((prev) => [...prev, data])
        handleMessage(data)
      } catch (error) {
        console.error('Error parsing WebSocket message:', error)
      }
    }

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    websocket.onclose = () => {
      console.log('WebSocket disconnected')
      setConnected(false)
      setWs(null)

      // Attempt to reconnect after 3 seconds
      reconnectTimeoutRef.current = setTimeout(() => {
        console.log('Attempting to reconnect...')
        connectWebSocket()
      }, 3000)
    }
  }

  const handleMessage = (data) => {
    switch (data.type) {
      case 'giveaway_started':
        toast({
          title: 'Sorteo iniciado',
          description: `"${data.giveaway.title}" ha comenzado`,
        })
        break
      case 'giveaway_ended':
        toast({
          title: 'Sorteo finalizado',
          description: `"${data.giveaway.title}" ha terminado`,
        })
        break
      case 'winners_drawn':
        toast({
          title: '¡Ganadores seleccionados!',
          description: `${data.winners.length} ganador(es) seleccionado(s)`,
        })
        break
      case 'participant_added':
        // Don't show toast for every participant to avoid spam
        break
      default:
        break
    }
  }

  const sendMessage = (message) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message))
    } else {
      console.error('WebSocket is not connected')
    }
  }

  return (
    <WebSocketContext.Provider value={{ ws, connected, messages, sendMessage }}>
      {children}
    </WebSocketContext.Provider>
  )
}

export function useWebSocket() {
  const context = useContext(WebSocketContext)
  if (!context) {
    throw new Error('useWebSocket must be used within WebSocketProvider')
  }
  return context
}
