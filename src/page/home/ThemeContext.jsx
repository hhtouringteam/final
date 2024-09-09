import { useState, createContext } from 'react'

const ThemeContext = createContext()

function ThemeProvider({ children }) {
  const [theme, settheme] = useState('dark')
  const toggleTheme = () => {
    settheme(theme === 'dark' ? 'light' : 'dark')
  }
  const value = {
    theme,
    toggleTheme,
  }
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export { ThemeContext, ThemeProvider }
