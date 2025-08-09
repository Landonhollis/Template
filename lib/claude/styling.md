# React Native Expo App Styling System Guide

## Overview
This app uses a dual-styling approach combining NativeWind (Tailwind CSS for React Native) with a custom theme-based styling system for dynamic theming and design consistency.

## Core Architecture

### 1. Dual Styling Methods

**Method 1: NativeWind via `className` prop**
- Used for: Layout, spacing, positioning, and styles not available in theme objects
- Example: `className="flex-1 justify-center items-center p-4"`

**Method 2: Theme-based styling via `style` prop with Style Parser**
- Used for: Colors, typography, borders, shadows, and all theme-dependent properties
- Example: `style={ps('bg-1 br-4 shadow-2')}`

### 2. Theme System Architecture

**IMPORTANT:** Reference `/lib/contextProviders/themeProvider.tsx` to understand all available theme properties and their exact values. This guide provides an overview, but the theme provider file contains the complete, up-to-date definitions.

#### Theme Context
The theme system provides:
- **`ct`** (Current Theme): The active theme object containing all style definitions
- **`ctn`** (Current Theme Name): String identifier ('theme1', 'theme2', 'theme3', 'theme4')
- **`setCtn`** (Set Current Theme Name): Function to switch themes

#### Available Theme Properties
Each theme contains identical property keys with different values:

**Font Families:** `f-1` through `f-6` (actual font names may change, property names stay consistent)
**Font Weights:** `fw-200` through `fw-800` 
**Typography Sizes:** `text-xs`, `text-sm`, `text-md`, `text-lg`, `text-xl`, `text-2xl`
**Text Colors:** `text-normal`, `text-muted`, `text-strong`, `text-a1`, `text-a2`, `text-a3`, `text-inverse`
**Background Colors:** `bg-1` through `bg-6`, `bg-a1`, `bg-a2`, `bg-a3`
**Border Properties:** `br-0` through `br-4`, `bw-0` through `bw-4`, directional borders
**Border Colors:** `bc-normal`, `bc-muted`, `bc-strong`, `bc-accent`
**Shadows:** `shadow-1`, `shadow-2`, `shadow-3`
**Status Bar:** `sb-style`

### 3. Style Parser (`/lib/utilities/style-parser.ts`)

The Style Parser (`ps` function) converts space-separated style strings into React Native style objects:

```tsx
import { useStyleParser } from '../lib/utilities/style-parser'

function MyComponent() {
  const ps = useStyleParser()
  
  return (
    <View style={ps('bg-1 br-4 shadow-2 bw-2 bc-normal')}>
      <Text style={ps('f-1 text-lg text-normal fw-600')}>Hello World</Text>
    </View>
  )
}
```

## Implementation Guidelines for AI Agents

### Style Decision Matrix

| Style Type | Use Theme (style prop) | Use NativeWind (className) |
|------------|------------------------|----------------------------|
| Colors (bg, text, border) | ✅ Always | ❌ Never |
| Typography (font, size, weight) | ✅ Always | ❌ Never |
| Borders (width, radius, color) | ✅ Always | ❌ Never |
| Shadows | ✅ Always | ❌ Never |
| Layout (flex, positioning) | ❌ Never | ✅ Always |
| Spacing (margin, padding) | ❌ Never | ✅ Always |
| Dimensions (width, height) | ❌ Never | ✅ Always |

### Design Philosophy: Relational Thinking

**Critical Concept:** All theme-based styles should be thought of relationally, not in absolute terms.

**Instead of:** "This button needs an 8px border and this card needs a 4px border"
**Think:** "This button needs a thick border (bw-3) and this card needs a medium border (bw-2)"

This approach enables app-wide design consistency and easy theme customization.

### Component Implementation Pattern

```tsx
import { View, Text, Pressable } from 'react-native'
import { useTheme } from '../lib/contextProviders/themeProvider'
import { useStyleParser } from '../lib/utilities/style-parser'

export default function MyComponent() {
  const { ctn, setCtn } = useTheme() // Only if theme switching needed
  const ps = useStyleParser()
  
  return (
    <View className="flex-1 p-4" style={ps('bg-1')}>
      <Text className="mb-4" style={ps('f-1 text-lg text-normal')}>
        Title Text
      </Text>
      <Pressable 
        className="p-3 active:opacity-70" 
        style={ps('bg-a1 br-3 shadow-2')}
      >
        <Text style={ps('text-inverse fw-600')}>Button Text</Text>
      </Pressable>
    </View>
  )
}
```

### Essential Requirements

**Always:**
- Import `useStyleParser` in components using theme styles
- Use `ps()` function for all theme-dependent properties
- Reference `/lib/contextProviders/themeProvider.tsx` for complete property definitions

**Never:**
- Mix absolute color values with theme system
- Use theme properties in className (they won't work)
- Use hardcoded fonts outside of theme objects