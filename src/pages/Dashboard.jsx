import { useState, useEffect } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { useAuth } from '../contexts/AuthContext'
import { useWebSocket } from '../contexts/WebSocketContext'
import { useToast } from '../components/ui/use-toast'
import { 
  Gift, 
  LogOut, 
  Play, 
  Square, 
  Trophy, 
  Users, 
  Clock,
  Copy,
  ExternalLink,
  Sparkles
} from 'lucide-react'

export default function Dashboard() {
  const { user, logout, sessionId } = useAuth()
  const { connected, messages } = useWebSocket()
  const { toast } = useToast()

  const [giveaway, setGiveaway] = useState(null)
  const [participants, setParticipants] = useState([])
  const [winners, setWinners] = useState([])
  
  // Form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [duration, setDuration] = useState(300) // 5 minutes default
  const [keyword, setKeyword] = useState('')
  const [maxWinners, setMaxWinners] = useState(1)
  const [type, setType] = useState('chat')

  useEffect(() => {
    // Handle WebSocket messages
    const lastMessage = messages[messages.length - 1]
    if (!lastMessage) return

    switch (lastMessage.type) {
      case 'giveaway_started':
        setGiveaway(lastMessage.giveaway)
        setParticipants([])
        setWinners([])
        break
      case 'participant_added':
        setParticipants(prev => [...prev, lastMessage.participant])
        break
      case 'winners_drawn':
        setWinners(lastMessage.winners)
        setGiveaway(lastMessage.giveaway)
        break
      case 'giveaway_ended':
        setGiveaway(lastMessage.giveaway)
        break
    }
  }, [messages])

  const createGiveaway = async () => {
    if (!title.trim()) {
      toast({
        title: 'Error',
        description: 'El título es requerido',
        variant: 'destructive',
      })
      return
    }

    try {
      const response = await fetch('http://localhost:3000/api/giveaway/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-Id': sessionId,
        },
        body: JSON.stringify({
          title,
          description,
          duration,
          type,
          keyword,
          maxWinners,
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        setGiveaway(data.giveaway)
        toast({
          title: 'Sorteo creado',
          description: 'El sorteo ha sido creado exitosamente',
        })
      }
    } catch (error) {
      console.error('Error creating giveaway:', error)
      toast({
        title: 'Error',
        description: 'No se pudo crear el sorteo',
        variant: 'destructive',
      })
    }
  }

  const startGiveaway = async () => {
    if (!giveaway) return

    try {
      const response = await fetch(`http://localhost:3000/api/giveaway/${giveaway.id}/start`, {
        method: 'POST',
        headers: {
          'X-Session-Id': sessionId,
        },
      })

      const data = await response.json()
      
      if (data.success) {
        setGiveaway(data.giveaway)
      }
    } catch (error) {
      console.error('Error starting giveaway:', error)
      toast({
        title: 'Error',
        description: 'No se pudo iniciar el sorteo',
        variant: 'destructive',
      })
    }
  }

  const drawWinners = async () => {
    if (!giveaway) return

    try {
      const response = await fetch(`http://localhost:3000/api/giveaway/${giveaway.id}/draw`, {
        method: 'POST',
        headers: {
          'X-Session-Id': sessionId,
        },
      })

      const data = await response.json()
      
      if (data.success) {
        setWinners(data.winners)
        setGiveaway(data.giveaway)
      }
    } catch (error) {
      console.error('Error drawing winners:', error)
      toast({
        title: 'Error',
        description: 'No se pudo seleccionar ganadores',
        variant: 'destructive',
      })
    }
  }

  const copyWidgetUrl = (widgetType) => {
    const url = `http://localhost:5173/widget/${widgetType}?giveaway=${giveaway?.id || ''}`
    navigator.clipboard.writeText(url)
    toast({
      title: 'URL copiada',
      description: 'La URL del widget ha sido copiada al portapapeles',
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Gift className="w-8 h-8 text-purple-400" />
            <h1 className="text-2xl font-bold text-white">Twitch Giveaway Tool</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm text-white/70">
                {connected ? 'Conectado' : 'Desconectado'}
              </span>
            </div>
            
            <div className="flex items-center gap-3 px-4 py-2 bg-white/10 rounded-lg">
              <img
                src={user?.profile_image_url}
                alt={user?.display_name}
                className="w-8 h-8 rounded-full"
              />
              <span className="text-white font-medium">{user?.display_name}</span>
            </div>
            
            <Button variant="ghost" size="icon" onClick={logout} className="text-white">
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Create/Control Giveaway */}
          <div className="lg:col-span-2 space-y-6">
            {!giveaway || giveaway.status === 'completed' ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Crear Nuevo Sorteo
                  </CardTitle>
                  <CardDescription>
                    Configura los parámetros de tu sorteo
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título del sorteo</Label>
                    <Input
                      id="title"
                      placeholder="Ej: Sorteo de skins"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descripción (opcional)</Label>
                    <Input
                      id="description"
                      placeholder="Detalles del sorteo"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duración (segundos)</Label>
                      <Input
                        id="duration"
                        type="number"
                        min="30"
                        value={duration}
                        onChange={(e) => setDuration(parseInt(e.target.value))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="maxWinners">Número de ganadores</Label>
                      <Input
                        id="maxWinners"
                        type="number"
                        min="1"
                        value={maxWinners}
                        onChange={(e) => setMaxWinners(parseInt(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Tipo de participación</Label>
                    <select
                      id="type"
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                    >
                      <option value="chat">Todos en el chat</option>
                      <option value="keyword">Palabra clave</option>
                      <option value="followers">Solo seguidores</option>
                      <option value="subscribers">Solo suscriptores</option>
                    </select>
                  </div>

                  {type === 'keyword' && (
                    <div className="space-y-2">
                      <Label htmlFor="keyword">Palabra clave</Label>
                      <Input
                        id="keyword"
                        placeholder="Ej: !sorteo"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                      />
                    </div>
                  )}

                  <Button onClick={createGiveaway} className="w-full" size="lg">
                    <Gift className="w-5 h-5 mr-2" />
                    Crear Sorteo
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{giveaway.title}</CardTitle>
                        <CardDescription>{giveaway.description}</CardDescription>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        giveaway.status === 'active' ? 'bg-green-500/20 text-green-400' :
                        giveaway.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {giveaway.status === 'active' ? 'Activo' :
                         giveaway.status === 'pending' ? 'Pendiente' :
                         'Finalizado'}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-purple-500/10 rounded-lg">
                        <Users className="w-6 h-6 mx-auto mb-2 text-purple-400" />
                        <div className="text-2xl font-bold">{participants.length}</div>
                        <div className="text-sm text-muted-foreground">Participantes</div>
                      </div>
                      
                      <div className="text-center p-4 bg-blue-500/10 rounded-lg">
                        <Clock className="w-6 h-6 mx-auto mb-2 text-blue-400" />
                        <div className="text-2xl font-bold">{duration}s</div>
                        <div className="text-sm text-muted-foreground">Duración</div>
                      </div>
                      
                      <div className="text-center p-4 bg-yellow-500/10 rounded-lg">
                        <Trophy className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
                        <div className="text-2xl font-bold">{maxWinners}</div>
                        <div className="text-sm text-muted-foreground">Ganadores</div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {giveaway.status === 'pending' && (
                        <Button onClick={startGiveaway} className="flex-1" size="lg">
                          <Play className="w-5 h-5 mr-2" />
                          Iniciar Sorteo
                        </Button>
                      )}
                      
                      {giveaway.status === 'active' && (
                        <Button onClick={drawWinners} className="flex-1" size="lg">
                          <Trophy className="w-5 h-5 mr-2" />
                          Seleccionar Ganador
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {winners.length > 0 && (
                  <Card className="border-yellow-500/50 bg-yellow-500/5">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-yellow-400">
                        <Trophy className="w-6 h-6" />
                        ¡Ganadores!
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {winners.map((winner, index) => (
                          <div
                            key={winner.userId}
                            className="flex items-center gap-3 p-4 bg-white/5 rounded-lg animate-bounce-in"
                          >
                            <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center font-bold">
                              {index + 1}
                            </div>
                            <div>
                              <div className="font-semibold text-lg">{winner.displayName}</div>
                              <div className="text-sm text-muted-foreground">@{winner.username}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>

          {/* Right Column - Participants & Widgets */}
          <div className="space-y-6">
            {giveaway && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Participantes ({participants.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {participants.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        Esperando participantes...
                      </p>
                    ) : (
                      participants.map((participant) => (
                        <div
                          key={participant.userId}
                          className="flex items-center gap-2 p-2 bg-white/5 rounded animate-slide-in"
                        >
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                          <span className="font-medium">{participant.displayName}</span>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ExternalLink className="w-5 h-5" />
                  Widgets para OBS
                </CardTitle>
                <CardDescription>
                  Añade estos widgets como fuentes de navegador en OBS
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-between"
                  onClick={() => copyWidgetUrl('giveaway')}
                >
                  Widget de Sorteo
                  <Copy className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-between"
                  onClick={() => copyWidgetUrl('notifications')}
                >
                  Widget de Notificaciones
                  <Copy className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-between"
                  onClick={() => copyWidgetUrl('countdown')}
                >
                  Contador Regresivo
                  <Copy className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
