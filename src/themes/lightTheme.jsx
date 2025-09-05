import { createTheme } from '@mui/material/styles';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#055cf4' },
    background: { default: '#e4e4e4' }
  }
});

export default lightTheme;