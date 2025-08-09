import { useTheme } from '../contextProviders/themeProvider'

export const useStyleParser = () => {
  const { ct } = useTheme()
  
  // Parser function that converts space-separated style strings to theme object spreads
  const ps = (styleString: string) => {
    const styles = styleString
      .split(' ')
      .filter(Boolean)
      .map(className => ct[className as keyof typeof ct])
      .filter(Boolean)
    
    // Merge all styles into a single object
    return Object.assign({}, ...styles)
  }
  
  return ps
}

// For convenience, also export a standalone version that takes the theme as parameter
export const parseStyles = (styleString: string, ct: any) => {
  const styles = styleString
    .split(' ')
    .filter(Boolean)
    .map(className => ct[className as keyof typeof ct])
    .filter(Boolean)
  
  return Object.assign({}, ...styles)
}