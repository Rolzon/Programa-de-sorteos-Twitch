import { useState, useEffect } from 'react'
import { Toaster } from './components/ui/toaster'
import { useToast } from './components/ui/use-toast'
import LoginPage from './pages/LoginPage'
import DashboardLachhh from './pages/DashboardLachhh'
import GiveawayWidget from './pages/widgets/GiveawayWidget'
import GiveawayAnimationWidget from './pages/widgets/GiveawayAnimationWidget'
import NotificationWidget from './pages/widgets/NotificationWidget'
import CountdownWidget from './pages/widgets/CountdownWidget'
import CountdownWinnerWidget from './pages/widgets/CountdownWinnerWidget'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { WebSocketProvider } from './contexts/WebSocketContext'

function AppContent() {
  const { user, loading } = useAuth()
  
  // Check if this is a widget route
  const path = window.location.pathname
  const isWidget = path.startsWith('/widget/')

  // Render widgets without authentication
  if (isWidget) {
    return (
      <WebSocketProvider>
        {path === '/widget/giveaway' && <GiveawayWidget />}
        {path === '/widget/giveaway-animation' && <GiveawayAnimationWidget />}
        {path === '/widget/notifications' && <NotificationWidget />}
        {path === '/widget/countdown' && <CountdownWidget />}
        {path === '/widget/countdown-winner' && <CountdownWinnerWidget />}
      </WebSocketProvider>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-xl">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {user ? (
        <WebSocketProvider>
          <DashboardLachhh />
        </WebSocketProvider>
      ) : (
        <LoginPage />
      )}
      <Toaster />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
