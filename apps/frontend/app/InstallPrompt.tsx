'use client'

import { useState, useEffect } from 'react'
import { X, Download, Smartphone } from 'lucide-react'
import Image from 'next/image'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  // Development mode flag
  const isDev = process.env.NODE_ENV === 'development'
  const forceShowInDev = true // Set to true to always show in dev mode

  console.log('InstallPrompt:', { isInstalled, showPrompt, isDev, deferredPrompt: !!deferredPrompt })
  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      const event = e as BeforeInstallPromptEvent
      setDeferredPrompt(event)
      
      // Show prompt after a delay to avoid being intrusive
      setTimeout(() => {
        if (!localStorage.getItem('pwa-install-dismissed')) {
          setShowPrompt(true)
        }
      }, 3000)
    }

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowPrompt(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    // DEVELOPMENT MODE: Force show prompt for testing
    if (isDev && forceShowInDev) {
      setTimeout(() => {
        if (!localStorage.getItem('pwa-install-dismissed')) {
          setShowPrompt(true)
          console.log('🔧 Development mode: Showing install prompt for testing')
        }
      }, 1000) // Shorter delay in dev
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [isDev, forceShowInDev])

  const handleInstallClick = async () => {
    // In dev mode without real prompt, just log
    if (isDev && !deferredPrompt) {
      console.log('🔧 Development mode: Would trigger install prompt')
      alert('Development mode: Install prompt would appear here')
      setShowPrompt(false)
      return
    }

    if (!deferredPrompt) return

    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        console.log('PWA install accepted')
      } else {
        console.log('PWA install dismissed')
      }
    } catch (error) {
      console.error('Error during PWA install:', error)
    }

    setDeferredPrompt(null)
    setShowPrompt(false)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('pwa-install-dismissed', 'true')
    
    // Allow showing again after shorter time in dev
    const dismissTime = isDev ? 30000 : 7 * 24 * 60 * 60 * 1000 // 30 seconds in dev, 7 days in prod
    setTimeout(() => {
      localStorage.removeItem('pwa-install-dismissed')
    }, dismissTime)
  }

  // Don't show if already installed
  if (isInstalled) {
    return null
  }

  // In production, don't show if no prompt available
  if (!isDev && (!showPrompt || !deferredPrompt)) {
    return null
  }

  // In development, show if forced or if real prompt is available
  if (isDev && !showPrompt) {
    return null
  }

  return (
    <div className="fixed top-4 left-4 z-50 max-w-xs w-full">
      <div className="relative p-3 rounded-lg bg-white shadow-lg ring-1 ring-black/5 dark:bg-gray-800 dark:ring-white/10 flex items-center gap-2">
        {/* Dev mode indicator */}
        {isDev && !deferredPrompt && (
          <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-1 rounded">
            DEV
          </div>
        )}
        
        <button
          onClick={handleDismiss}
          className="absolute top-1 right-1 rounded-md p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Close install prompt"
        >
          <X className="h-4 w-4" />
        </button>
        <Image src="/192.png" alt="App Icon" width={32} height={32} className="h-8 w-8 rounded-lg" />
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-0.5">
            Install Bachata Flow
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            Get quick access with offline support and a native app experience.
          </p>
          <div className="flex gap-1">
            <button
              onClick={handleInstallClick}
              className="inline-flex items-center gap-1 rounded bg-blue-600 px-2 py-1 text-xs font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Download className="h-3 w-3" />
              Install
            </button>
            <button
              onClick={handleDismiss}
              className="inline-flex items-center rounded px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Not now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}