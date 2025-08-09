import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './authProvider'

interface Plan {
  id: string
  name: string
  price: number
  interval: 'month' | 'year'
  is_free: boolean
  features: string[]
}

interface UserSubscription {
  plan_name: string
  is_free: boolean
}

interface AccountContextType {
  subscription: UserSubscription | null
  plans: Plan[]
  loading: boolean
  subscribe: () => Promise<{ success: boolean; error?: string }>
  unsubscribe: () => Promise<{ success: boolean; error?: string }>
}

// Hardcoded plans
const HARDCODED_PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: 'month',
    is_free: true,
    features: ['Basic features', 'Limited usage']
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 9.99,
    interval: 'month',
    is_free: false,
    features: ['All features', 'Unlimited usage', 'Priority support']
  }
]

const AccountContext = createContext<AccountContextType | undefined>(undefined)

export function AccountProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [subscription, setSubscription] = useState<UserSubscription | null>(null)
  const [plans] = useState<Plan[]>(HARDCODED_PLANS)
  const [loading, setLoading] = useState(true)

  // Initialize subscription state - default to free plan
  const initializeSubscription = () => {
    if (!user) {
      setSubscription(null)
      setLoading(false)
      return
    }

    // Default to free plan for authenticated users
    setSubscription({
      plan_name: 'Free',
      is_free: true
    })
    setLoading(false)
  }

  // Subscribe to Pro plan
  const subscribe = async (): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: 'User not authenticated' }
    }

    try {
      setLoading(true)
      
      // Call Vercel backend which handles Stripe
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userId: user.id 
        })
      })

      const result = await response.json()

      if (!response.ok) {
        return { success: false, error: result.error || 'Failed to subscribe' }
      }

      // Update to Pro plan
      setSubscription({
        plan_name: 'Pro',
        is_free: false
      })
      
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Failed to create subscription' }
    } finally {
      setLoading(false)
    }
  }

  // Unsubscribe from Pro plan (back to Free)
  const unsubscribe = async (): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: 'User not authenticated' }
    }

    try {
      setLoading(true)
      
      // Call Vercel backend which handles Stripe cancellation
      const response = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userId: user.id
        })
      })

      const result = await response.json()

      if (!response.ok) {
        return { success: false, error: result.error || 'Failed to unsubscribe' }
      }

      // Update back to Free plan
      setSubscription({
        plan_name: 'Free',
        is_free: true
      })
      
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Failed to cancel subscription' }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    initializeSubscription()
  }, [user])

  const value: AccountContextType = {
    subscription,
    plans,
    loading,
    subscribe,
    unsubscribe,
  }

  return (
    <AccountContext.Provider value={value}>
      {children}
    </AccountContext.Provider>
  )
}

export function useAccount(): AccountContextType {
  const context = useContext(AccountContext)
  if (context === undefined) {
    throw new Error('useAccount must be used within an AccountProvider')
  }
  return context
}