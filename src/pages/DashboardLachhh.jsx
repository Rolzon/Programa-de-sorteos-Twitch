import { useState, useEffect } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { useAuth } from '../contexts/AuthContext'
import { useWebSocket } from '../contexts/WebSocketContext'
import { useToast } from '../components/ui/use-toast'
import { 
  Gift, 
  LogOut, 
  Play,
  Users,
  Heart,
  Star,
  Sparkles,
  Settings,
  HelpCircle,
  X
} from 'lucide-react'

export default function DashboardLachhh() {
  const { user, logout, sessionId } = useAuth()
  const { connected, messages } = useWebSocket()
  const { toast } = useToast()

  const [activeTab, setActiveTab] = useState('giveaway')
  const [giveaway, setGiveaway] = useState(null)
  const [participants, setParticipants] = useState([])
  const [winners, setWinners] = useState([])
  const [isAnimating, setIsAnimating] = useState(false)
  const [countdown, setCountdown] = useState(null)
  
  // Giveaway settings
  const [animationLine1, setAnimationLine1] = useState("It's Super Awesome")
  const [animationLine2, setAnimationLine2] = useState("Giveaway time!")
  const [currentAnimation, setCurrentAnimation] = useState('Default Animation')
  const [chatAutoAdd, setChatAutoAdd] = useState(true)
  const [chatCommand, setChatCommand] = useState('!here')
  
  // Countdown settings
  const [targetName, setTargetName] = useState('Some poor dude')
  const [quickMessage, setQuickMessage] = useState('QUICK! Show yourself! Talk in the chat!')
  const [countdownTime, setCountdownTime] = useState(30)
  const [countdownAnimation, setCountdownAnimation] = useState('Default Animation')
  
  // Export winner settings
  const [winnerName, setWinnerName] = useState('Some Lucky Dude')
  const [winnerText1, setWinnerText1] = useState('has won the giveaway!')
  const [winnerText2, setWinnerText2] = useState('Come over for a chance to win!')
  const [winnerText3, setWinnerText3] = useState('twitch.tv/MyChannel')
  const [exportAnimation, setExportAnimation] = useState('Default Animation')

  useEffect(() => {
    const lastMessage = messages[messages.length - 1]
    if (!lastMessage) return

    switch (lastMessage.type) {
      case 'giveaway_started':
        setGiveaway(lastMessage.giveaway)
        setParticipants([])
        setWinners([])
        setIsAnimating(true)
        break
      case 'participant_added':
        setParticipants(prev => [...prev, lastMessage.participant])
        break
      case 'winners_drawn':
        setWinners(lastMessage.winners)
        setGiveaway(lastMessage.giveaway)
        setIsAnimating(true)
        break
      case 'giveaway_ended':
        setGiveaway(lastMessage.giveaway)
        setIsAnimating(false)
        break
    }
  }, [messages])

  const addViewers = () => {
    toast({
      title: 'Añadir Viewers',
      description: 'Función disponible próximamente',
    })
  }

  const addManually = () => {
    const username = prompt('Ingresa el nombre de usuario:')
    if (username) {
      setParticipants(prev => [...prev, {
        userId: Date.now().toString(),
        username: username.toLowerCase(),
        displayName: username,
        timestamp: Date.now()
      }])
    }
  }

  const addSubs = () => {
    toast({
      title: 'Añadir Suscriptores',
      description: 'Cargando suscriptores del canal...',
    })
  }

  const addMods = () => {
    toast({
      title: 'Añadir Moderadores',
      description: 'Cargando moderadores del canal...',
    })
  }

  const removeNonSubs = () => {
    setParticipants(prev => prev.filter(p => p.isSubscriber))
    toast({
      title: 'Filtrado',
      description: 'Se eliminaron los no suscriptores',
    })
  }

  const removeNonMods = () => {
    setParticipants(prev => prev.filter(p => p.isModerator))
    toast({
      title: 'Filtrado',
      description: 'Se eliminaron los no moderadores',
    })
  }

  const clearParticipants = () => {
    if (confirm('¿Estás seguro de que quieres limpiar todos los participantes?')) {
      setParticipants([])
    }
  }

  const startAnimation = async () => {
    if (!sessionId) {
      toast({
        title: 'Sesión no válida',
        description: 'Vuelve a iniciar sesión con Twitch.',
        variant: 'destructive',
      })
      return
    }

    if (participants.length === 0) {
      toast({
        title: 'Error',
        description: 'No hay participantes en el sorteo',
        variant: 'destructive',
      })
      return
    }

    try {
      // 1) Crear SIEMPRE un nuevo giveaway
      const createRes = await fetch('/api/giveaway/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': sessionId,
        },
        body: JSON.stringify({
          title: 'Twitch Giveaway',
          description: 'Sorteo automático desde panel LachhhTools',
          type: 'manual',
          duration: null,
          keyword: '',
          requirements: {},
          maxWinners: 1,
        }),
      })

      if (!createRes.ok) {
        const errorData = await createRes.json().catch(() => ({}))
        throw new Error(errorData.error || 'No se pudo crear el sorteo')
      }

      const createData = await createRes.json()
      const currentGiveawayId = createData.giveaway.id
      setGiveaway(createData.giveaway)

      // 2) Enviar participantes locales al backend
      await Promise.all(
        participants.map((p) =>
          fetch(`/api/giveaway/${currentGiveawayId}/participate`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-session-id': sessionId,
            },
            body: JSON.stringify({
              userId: p.userId,
              username: p.username,
              displayName: p.displayName,
              message: '',
            }),
          }).catch(() => null)
        )
      )

      // 3) Iniciar giveaway para que los widgets reciban giveaway_started
      const startRes = await fetch(`/api/giveaway/${currentGiveawayId}/start`, {
        method: 'POST',
        headers: {
          'x-session-id': sessionId,
        },
      })

      if (!startRes.ok) {
        const errorData = await startRes.json().catch(() => ({}))
        throw new Error(errorData.error || 'No se pudo iniciar el sorteo')
      }

      const startData = await startRes.json()
      setGiveaway(startData.giveaway)
      setIsAnimating(true)

      // 4) Seleccionar ganador(es) para disparar winners_drawn
      const drawRes = await fetch(`/api/giveaway/${currentGiveawayId}/draw`, {
        method: 'POST',
        headers: {
          'x-session-id': sessionId,
        },
      })

      if (!drawRes.ok) {
        const errorData = await drawRes.json().catch(() => ({}))
        throw new Error(errorData.error || 'No se pudieron seleccionar ganadores')
      }

      const drawData = await drawRes.json()
      setWinners(drawData.winners || [])

      if (drawData.winners && drawData.winners[0]) {
        const winner = drawData.winners[0]
        setWinnerName(winner.displayName || winner.username)
        setTargetName(winner.displayName || winner.username)
        setCountdown(countdownTime)
      }

      toast({
        title: 'Sorteo iniciado',
        description: 'La animación se está reproduciendo en el widget.',
      })
    } catch (error) {
      console.error('Error al iniciar la animación:', error)
      toast({
        title: 'Error al iniciar sorteo',
        description: error.message || 'Revisa la consola del navegador para más detalles.',
        variant: 'destructive',
      })
    }
  }

  const startCountdown = () => {
    if (!winners[0]) return
    
    setCountdown(countdownTime)
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const exportWinnerImage = () => {
    toast({
      title: 'Exportar imagen',
      description: 'Generando imagen del ganador...',
    })
  }

  return (
    <div className="min-h-screen bg-[#16202d] text-white">
      {/* Header */}
      <header className="bg-[#0f1419] border-b border-gray-800 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="text-2xl font-bold">
                <span className="text-white">LACHHH</span>
                <span className="text-purple-400">TOOLS</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 px-4 py-2 bg-red-600 rounded">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span className="text-sm font-medium">OFFLINE</span>
            </div>
            
            <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
              Login
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-white hover:bg-gray-800">
              <Gift className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-gray-800">
              <Heart className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-gray-800">
              <Star className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-gray-800">
              <Sparkles className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-gray-800">
              <Settings className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-gray-800">
              <HelpCircle className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={logout} className="text-white hover:bg-gray-800">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6 grid grid-cols-2 gap-6">
        {/* Left Column - Giveaway Animation */}
        <Card className="bg-[#1a2332] border-gray-700">
          <CardHeader className="border-b border-gray-700">
            <CardTitle className="text-white text-lg">1- GIVEAWAY ANIMATION</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {/* Add Participants Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-gray-400 text-sm">Add Participants</Label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-sm">Participants</span>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={clearParticipants}
                    className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                  >
                    CLEAR
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <Button 
                  onClick={addViewers}
                  className="bg-[#2a3f5f] hover:bg-[#3a5f7f] text-white"
                >
                  Add Viewers
                </Button>
                <Button 
                  onClick={addManually}
                  className="bg-[#2a3f5f] hover:bg-[#3a5f7f] text-white"
                >
                  Add Manually
                </Button>
                <Button 
                  onClick={addSubs}
                  className="bg-[#2a3f5f] hover:bg-[#3a5f7f] text-white relative"
                >
                  Add Subs
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1 rounded">
                    P
                  </span>
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <Button 
                  onClick={addMods}
                  className="bg-[#2a3f5f] hover:bg-[#3a5f7f] text-white relative"
                >
                  Add Mods
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1 rounded">
                    P
                  </span>
                </Button>
                <Button 
                  onClick={removeNonSubs}
                  className="bg-[#2a3f5f] hover:bg-[#3a5f7f] text-white relative"
                >
                  Remove non-subs
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1 rounded">
                    P
                  </span>
                </Button>
                <Button 
                  onClick={removeNonMods}
                  className="bg-[#2a3f5f] hover:bg-[#3a5f7f] text-white relative"
                >
                  Remove non-mod
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1 rounded">
                    P
                  </span>
                </Button>
              </div>
            </div>

            {/* Chat Auto-Add */}
            <div className="flex items-center gap-3">
              <Label className="text-gray-400 text-sm">Chat Auto-Add</Label>
              <input 
                type="checkbox" 
                checked={chatAutoAdd}
                onChange={(e) => setChatAutoAdd(e.target.checked)}
                className="w-4 h-4"
              />
            </div>

            <div className="flex items-center gap-3">
              <Label className="text-gray-400 text-sm w-16">Cmd</Label>
              <Input 
                value={chatCommand}
                onChange={(e) => setChatCommand(e.target.value)}
                className="bg-[#0f1419] border-gray-600 text-white"
                placeholder="!here"
              />
              <span className="text-gray-500 text-sm italic">
                Leave blank to listen to anything
              </span>
            </div>

            {/* Animation Settings */}
            <div className="space-y-3 pt-4 border-t border-gray-700">
              <Label className="text-gray-400 text-sm">Animation Settings</Label>
              
              <div className="flex items-center gap-3">
                <Label className="text-gray-400 text-sm w-16">Line 1</Label>
                <Input 
                  value={animationLine1}
                  onChange={(e) => setAnimationLine1(e.target.value)}
                  className="bg-[#0f1419] border-gray-600 text-white"
                />
              </div>

              <div className="flex items-center gap-3">
                <Label className="text-gray-400 text-sm w-16">Line 2</Label>
                <Input 
                  value={animationLine2}
                  onChange={(e) => setAnimationLine2(e.target.value)}
                  className="bg-[#0f1419] border-gray-600 text-white"
                />
              </div>

              <div className="flex items-center gap-3">
                <Label className="text-gray-400 text-sm">Currently using</Label>
                <Input 
                  value={currentAnimation}
                  readOnly
                  className="bg-[#0f1419] border-gray-600 text-white flex-1"
                />
                <Button className="bg-[#2a3f5f] hover:bg-[#3a5f7f] text-white">
                  Select Animation
                </Button>
              </div>

              <div className="flex items-center gap-3">
                <Label className="text-gray-400 text-sm">SFX</Label>
                <div className="flex items-center gap-2 flex-1">
                  <input type="range" min="0" max="100" defaultValue="100" className="flex-1" />
                  <span className="text-white">100%</span>
                </div>
              </div>
            </div>

            {/* Participants Preview */}
            <div className="bg-[#0f1419] rounded p-4 min-h-[200px] flex items-center justify-center">
              {participants.length === 0 ? (
                <div className="text-center text-gray-500">
                  <Users className="w-16 h-16 mx-auto mb-2 opacity-30" />
                  <p>Add participants to start</p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-gray-400 mb-2">Total: {participants.length}</p>
                  <div className="max-h-32 overflow-y-auto">
                    {participants.slice(0, 10).map((p, i) => (
                      <div key={i} className="text-sm text-gray-300">{p.displayName}</div>
                    ))}
                    {participants.length > 10 && (
                      <div className="text-sm text-gray-500">...and {participants.length - 10} more</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <Button 
              onClick={startAnimation}
              className="w-full bg-[#2a5f3f] hover:bg-[#3a7f5f] text-white py-6 text-lg"
              disabled={participants.length === 0}
            >
              START ANIMATION
            </Button>
          </CardContent>
        </Card>

        {/* Right Column - Countdown and Export */}
        <div className="space-y-6">
          {/* Countdown Animation */}
          <Card className="bg-[#1a2332] border-gray-700">
            <CardHeader className="border-b border-gray-700">
              <CardTitle className="text-white text-lg">2- COUNTDOWN ANIMATION</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Label className="text-gray-400 text-sm w-32">Target's Name</Label>
                <Input 
                  value={targetName}
                  onChange={(e) => setTargetName(e.target.value)}
                  className="bg-[#0f1419] border-gray-600 text-white"
                />
              </div>

              <div className="flex items-center gap-3">
                <Label className="text-gray-400 text-sm w-32">Quick Message</Label>
                <Input 
                  value={quickMessage}
                  onChange={(e) => setQuickMessage(e.target.value)}
                  className="bg-[#0f1419] border-gray-600 text-white"
                />
              </div>

              <div className="flex items-center gap-3">
                <Label className="text-gray-400 text-sm w-32">Countdown</Label>
                <Input 
                  type="number"
                  value={countdownTime}
                  onChange={(e) => setCountdownTime(parseInt(e.target.value))}
                  className="bg-[#0f1419] border-gray-600 text-white w-24"
                />
                <span className="text-gray-400">sec</span>
                <Button 
                  className="bg-red-600 hover:bg-red-700 text-white ml-auto relative"
                >
                  Chat Auto-Claim
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1 rounded">
                    P
                  </span>
                </Button>
              </div>

              <div className="flex items-center gap-3">
                <Label className="text-gray-400 text-sm">Currently using</Label>
                <Input 
                  value={countdownAnimation}
                  readOnly
                  className="bg-[#0f1419] border-gray-600 text-white flex-1"
                />
                <Button className="bg-[#2a3f5f] hover:bg-[#3a5f7f] text-white">
                  Select Animation
                </Button>
              </div>

              <div className="flex items-center gap-3">
                <Label className="text-gray-400 text-sm">SFX</Label>
                <div className="flex items-center gap-2 flex-1">
                  <input type="range" min="0" max="100" defaultValue="100" className="flex-1" />
                  <span className="text-white">100%</span>
                </div>
              </div>

              <Button 
                onClick={startCountdown}
                className="w-full bg-[#2a5f3f] hover:bg-[#3a7f5f] text-white py-4"
                disabled={!winners[0]}
              >
                Start
              </Button>
            </CardContent>
          </Card>

          {/* Export Winner Image */}
          <Card className="bg-[#1a2332] border-gray-700">
            <CardHeader className="border-b border-gray-700">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-lg">3. EXPORT WINNER IMAGE</CardTitle>
                <Button size="sm" variant="outline" className="bg-gray-700 border-gray-600 text-white">
                  Preview
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Label className="text-gray-400 text-sm w-32">Winner's Name</Label>
                <Input 
                  value={winnerName}
                  onChange={(e) => setWinnerName(e.target.value)}
                  className="bg-[#0f1419] border-gray-600 text-white"
                />
              </div>

              <div className="flex items-center gap-3">
                <Label className="text-gray-400 text-sm w-32">Text 1</Label>
                <Input 
                  value={winnerText1}
                  onChange={(e) => setWinnerText1(e.target.value)}
                  className="bg-[#0f1419] border-gray-600 text-white"
                />
              </div>

              <div className="flex items-center gap-3">
                <Label className="text-gray-400 text-sm w-32">Text 2</Label>
                <Input 
                  value={winnerText2}
                  onChange={(e) => setWinnerText2(e.target.value)}
                  className="bg-[#0f1419] border-gray-600 text-white"
                />
              </div>

              <div className="flex items-center gap-3">
                <Label className="text-gray-400 text-sm w-32">Text 3</Label>
                <Input 
                  value={winnerText3}
                  onChange={(e) => setWinnerText3(e.target.value)}
                  className="bg-[#0f1419] border-gray-600 text-white"
                />
              </div>

              <div className="flex items-center gap-3">
                <Label className="text-gray-400 text-sm">Currently using</Label>
                <Input 
                  value={exportAnimation}
                  readOnly
                  className="bg-[#0f1419] border-gray-600 text-white flex-1"
                />
                <Button className="bg-[#2a3f5f] hover:bg-[#3a5f7f] text-white">
                  Select Animation
                </Button>
              </div>

              <Button 
                onClick={exportWinnerImage}
                className="w-full bg-[#2a5f3f] hover:bg-[#3a7f5f] text-white py-4"
              >
                Export PNG
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Share Button */}
      <div className="fixed bottom-6 right-6">
        <Button className="bg-[#2a3f5f] hover:bg-[#3a5f7f] text-white px-6 py-3 text-lg">
          SHARE →
        </Button>
      </div>
    </div>
  )
}
