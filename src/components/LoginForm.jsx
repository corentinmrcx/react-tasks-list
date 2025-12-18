import React, { useRef, useState } from 'react';
import { Box, Button, TextField, Typography, Link, FormControlLabel, Checkbox } from '@mui/material';
import { useAuthenticateUserMutation } from '../store/api';

const LoginForm = () => {
  const loginRef = useRef();
  const passwordRef = useRef();
  const [remember, setRemember] = useState(false);
  const [authenticateUser, { error }] = useAuthenticateUserMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loginValue = loginRef.current.value;
    const password = passwordRef.current.value;

    try {
      const response = await authenticateUser({ login: loginValue, password, remember }).unwrap();
      console.log('Authentification réussie :', response);
    } catch (err) {
      console.error('Erreur lors de l\'authentification :', err);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: 'auto', mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Connexion
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Login"
          variant="outlined"
          fullWidth
          margin="normal"
          inputRef={loginRef}
        />
        <TextField
          label="Mot de passe"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          inputRef={passwordRef}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
          }
          label="Se souvenir de moi"
        />
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Se connecter
        </Button>
      </form>
      {error && (
        <Typography color="error" variant="body2" sx={{ mt: 2 }}>
          {error.data?.message || 'Erreur lors de la connexion'}
        </Typography>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Link href="https://iut-rcc-infoapi.univ-reims.fr/tasks/register" underline="hover">
          S&#39;inscrire
        </Link>
        <Link href="https://iut-rcc-infoapi.univ-reims.fr/tasks/reset-password" underline="hover">
          Réinitialiser le mot de passe
        </Link>
      </Box>
    </Box>
  );
}

export default LoginForm;
