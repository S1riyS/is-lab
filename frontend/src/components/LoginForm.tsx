import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Typography,
    Alert,
    CircularProgress
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const LoginForm: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isRegisterMode, setIsRegisterMode] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, register } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isRegisterMode) {
                if (password !== confirmPassword) {
                    setError('Passwords do not match');
                    setLoading(false);
                    return;
                }
                if (password.length < 6) {
                    setError('Password must be at least 6 characters long');
                    setLoading(false);
                    return;
                }
                await register(username, password);
            } else {
                await login(username, password);
            }
        } catch (err: any) {
            setError(err.response?.data?.error || (isRegisterMode ? 'Registration failed' : 'Login failed. Please check your credentials.'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            bgcolor="grey.100"
        >
            <Card sx={{ maxWidth: 400, width: '100%', m: 2 }}>
                <CardContent>
                    <Typography variant="h4" component="h1" gutterBottom align="center">
                        Ticket Management System
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center" gutterBottom>
                        {isRegisterMode ? 'Create a new account' : 'Please log in to continue'}
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            margin="normal"
                            required
                            disabled={loading}
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            margin="normal"
                            required
                            disabled={loading}
                        />
                        {isRegisterMode && (
                            <TextField
                                fullWidth
                                label="Confirm Password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                margin="normal"
                                required
                                disabled={loading}
                            />
                        )}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : (isRegisterMode ? 'Register' : 'Login')}
                        </Button>
                        <Button
                            fullWidth
                            variant="text"
                            onClick={() => {
                                setIsRegisterMode(!isRegisterMode);
                                setError('');
                                setPassword('');
                                setConfirmPassword('');
                            }}
                            disabled={loading}
                        >
                            {isRegisterMode ? 'Already have an account? Login' : "Don't have an account? Register"}
                        </Button>
                    </form>

                    <Typography variant="body2" color="text.secondary" align="center">
                        Default credentials: admin / admin
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
};

export default LoginForm;

