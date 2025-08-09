# Template on how to set up third parties in tech stack to build an app. 

## SupaBase
- identify all the fields that should exist. like: 
  - theme types
  - subscription plans
- make sure that "subscription_plans" field match the ones that are in vercel that point to stripe. 
  - include an "is_free" field so the account handleer knows if it should alert stripe or not. 



## Stripe


## Vercel
- make sure that the subscription handlers match the ones that are in the "subscription_plans" field in supabase