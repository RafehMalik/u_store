import { Link } from 'react-router-dom'
import { buttonVariants } from '../components/ui/Button'

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center py-24 text-center">
      <p className="font-display text-6xl font-semibold text-primary">404</p>
      <h1 className="mt-3 font-display text-2xl font-semibold">Page not found</h1>
      <p className="mt-2 max-w-sm text-muted-fg">The page you're looking for doesn't exist or may have moved.</p>
      <Link to="/" className={buttonVariants({ className: 'mt-6' })}>Back to home</Link>
    </div>
  )
}
