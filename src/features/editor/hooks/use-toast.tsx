import * as React from "react"
import { 
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "../../../components/ui/toast"

import { cn } from "../../../lib/utils"

interface ToastProps {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  status?: 'success' | 'error' | 'loading'
}

const ToastContext = React.createContext<{
  toast: (props: Omit<ToastProps, "id">) => void
  dismiss: (id: string) => void
}>({
  toast: () => {},
  dismiss: () => {},
})

export const ToastContainer = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = React.useState<ToastProps[]>([])

  const toast = React.useCallback(
    ({ title, description, action, status }: Omit<ToastProps, "id">) => {
      const id = Math.random().toString(36).slice(2)
      setToasts((prevToasts) => [...prevToasts, { id, title, description, action, status }])

      // Auto dismiss after 5 seconds for success toasts
      if (status === 'success') {
        setTimeout(() => {
          setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
        }, 5000)
      }
    },
    []
  )

  const dismiss = React.useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      <ToastProvider>
        {children}
        {toasts.map(({ id, title, description, action, status }) => (
          <Toast 
            key={id} 
            className={cn(
              status === 'error' && 'destructive border-red-500',
              status === 'success' && 'border-green-500',
              status === 'loading' && 'border-blue-500'
            )}
          >
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && <ToastDescription>{description}</ToastDescription>}
            </div>
            {action}
            <ToastClose onClick={() => dismiss(id)} />
          </Toast>
        ))}
        <ToastViewport />
      </ToastProvider>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastContainer')
  }
  return context
}