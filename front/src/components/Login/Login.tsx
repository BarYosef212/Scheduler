import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Container, Box, Typography } from '@mui/material';
import { login } from '../../services/services';
import { useNavigate } from 'react-router-dom';
import { useValuesGlobal } from '../GlobalContext/GlobalContext';

interface LoginFormInputs {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { userId } = useValuesGlobal();
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      setIsLoading(true);
      setError('');
      await login(data.email, data.password);
      navigate(`/${userId}`);
    } catch (error) {
      console.log(error);
      setError(error as string);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth='xs'>
      <Box sx={{ mt: 8, p: 3, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant='h5' align='center' gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            label='Email'
            variant='outlined'
            margin='normal'
            {...register('email', { required: 'Email is required' })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            fullWidth
            label='Password'
            type='password'
            variant='outlined'
            margin='normal'
            {...register('password', { required: 'Password is required' })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          {error && <p style={{ color: 'red' }}>{error}</p>}
          {isLoading && <p>...אנא המתן</p>}
          <Button
            type='submit'
            variant='contained'
            color='primary'
            fullWidth
            sx={{ mt: 2 }}
          >
            Login
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Login;
