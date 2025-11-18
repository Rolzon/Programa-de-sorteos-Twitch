import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { useAuth } from '../contexts/AuthContext'
import { Gift, Sparkles, Users, Trophy } from 'lucide-react'

export default function LoginPage() {
  const { login } = useAuth()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-4">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <div className="text-white space-y-6">
          <div className="space-y-2">
            <h1 className="text-5xl font-bold flex items-center gap-3">
              <Gift className="w-12 h-12 text-purple-300" />
              Twitch Giveaway Tool
            </h1>
            <p className="text-xl text-purple-200">
              La herramienta definitiva para sorteos en Twitch
            </p>
          </div>

          <div className="space-y-4 mt-8">
            <div className="flex items-start gap-3">
              <Sparkles className="w-6 h-6 text-purple-300 mt-1" />
              <div>
                <h3 className="font-semibold text-lg">Sorteos personalizables</h3>
                <p className="text-purple-200">
                  Configura sorteos por chat, keywords, followers, subs y más
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Users className="w-6 h-6 text-purple-300 mt-1" />
              <div>
                <h3 className="font-semibold text-lg">Widgets para OBS</h3>
                <p className="text-purple-200">
                  Overlays transparentes para mostrar sorteos en tu stream
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Trophy className="w-6 h-6 text-purple-300 mt-1" />
              <div>
                <h3 className="font-semibold text-lg">Selección aleatoria justa</h3>
                <p className="text-purple-200">
                  Sistema de selección de ganadores completamente aleatorio
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login Card */}
        <Card className="shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Bienvenido</CardTitle>
            <CardDescription className="text-base">
              Inicia sesión con tu cuenta de Twitch para comenzar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="twitch"
              size="lg"
              className="w-full text-lg h-14"
              onClick={login}
            >
              <svg
                className="w-6 h-6 mr-2"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
              </svg>
              Conectar con Twitch
            </Button>

            <div className="text-sm text-muted-foreground text-center space-y-2">
              <p>
                Al iniciar sesión, autorizas a esta aplicación a acceder a:
              </p>
              <ul className="text-xs space-y-1">
                <li>• Tu información de perfil</li>
                <li>• Lista de seguidores y suscriptores</li>
                <li>• Mensajes del chat (solo lectura)</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
