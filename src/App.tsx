import { useEffect, useState } from 'react'
import { Landing } from './Landing'
import { Demo } from './Demo'

type Route = 'landing' | 'demo'

function routeFromLocation(): Route {
  return window.location.hash === '#/demo' || window.location.pathname.endsWith('/demo') ? 'demo' : 'landing'
}

export default function App() {
  const [route, setRoute] = useState<Route>(routeFromLocation)

  useEffect(() => {
    const onPopState = () => setRoute(routeFromLocation())
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const navigate = (next: Route) => {
    const base = import.meta.env.BASE_URL.replace(/\/$/, '')
    const path = next === 'demo' ? `${base}/#/demo` : `${base}/`
    window.history.pushState({}, '', path)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setRoute(next)
  }

  return route === 'demo' ? (
    <Demo onExit={() => navigate('landing')} />
  ) : (
    <Landing onDemo={() => navigate('demo')} />
  )
}
