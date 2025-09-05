import { useState, useMemo } from 'react';

export default function useTheme(lightTheme, darkTheme, initialMode = 'light') {
  const [mode, setMode] = useState(initialMode);

  const theme = useMemo(
    () => (mode === 'light' ? lightTheme : darkTheme),
    [mode, lightTheme, darkTheme]
  );

  const toggleTheme = () => setMode((prev) => (prev === 'light' ? 'dark' : 'light'));

  return { theme, mode, toggleTheme };
}