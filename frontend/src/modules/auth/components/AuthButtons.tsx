import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store';
import { clearAuth, setAuth } from '../state/authSlice';
import { useAppDispatch } from 'src/store';
import { useLoginMutation, useRegisterMutation } from '../api/authApi';
import { parseError } from 'src/modules/common/api/baseApi';
import Modal from 'src/modules/common/components/Modal';

export default function AuthButtons() {
    const dispatch = useAppDispatch();
    const auth = useSelector((s: RootState) => s.auth);
    const [login, { isLoading: isLoggingIn }] = useLoginMutation();
    const [register, { isLoading: isRegistering }] = useRegisterMutation();
    const [error, setError] = useState<string | null>(null);

    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [loginForm, setLoginForm] = useState({ username: '', password: '' });
    const [registerForm, setRegisterForm] = useState({ username: '', password: '', role: 'USER' });

    async function submitLogin() {
        setError(null);
        try {
            const res = await login(loginForm).unwrap();
            dispatch(setAuth(res));
            setShowLogin(false);
            setLoginForm({ username: '', password: '' });
        } catch (e) {
            setError(parseError(e));
        }
    }

    async function submitRegister() {
        setError(null);
        try {
            const res = await register(registerForm).unwrap();
            dispatch(setAuth(res));
            setShowRegister(false);
            setRegisterForm({ username: '', password: '', role: 'USER' });
        } catch (e) {
            setError(parseError(e));
        }
    }

    function handleLogout() {
        dispatch(clearAuth());
    }

    if (auth.user) {
        return (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span>{auth.user.username} ({auth.user.role})</span>
                <button onClick={handleLogout}>Log out</button>
            </div>
        );
    }

    return (
        <div className="d-flex gap-2 align-items-center">
            <button className="btn btn-outline-primary btn-sm" disabled={isLoggingIn} onClick={() => setShowLogin(true)}>Log in</button>
            <button className="btn btn-primary btn-sm" disabled={isRegistering} onClick={() => setShowRegister(true)}>Sign up</button>
            {error && <span className="text-danger small">{error}</span>}

            {showLogin && (
                <Modal title="Log in" onClose={() => setShowLogin(false)} onSubmit={submitLogin} submitText={isLoggingIn ? 'Logging in...' : 'Log in'}>
                    <form className="vstack gap-3">
                        <div>
                            <label className="form-label">Username</label>
                            <input className="form-control" value={loginForm.username} onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })} />
                        </div>
                        <div>
                            <label className="form-label">Password</label>
                            <input type="password" className="form-control" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} />
                        </div>
                    </form>
                </Modal>
            )}

            {showRegister && (
                <Modal title="Sign up" onClose={() => setShowRegister(false)} onSubmit={submitRegister} submitText={isRegistering ? 'Signing up...' : 'Sign up'}>
                    <form className="vstack gap-3">
                        <div>
                            <label className="form-label">Username</label>
                            <input className="form-control" value={registerForm.username} onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })} />
                        </div>
                        <div>
                            <label className="form-label">Password</label>
                            <input type="password" className="form-control" value={registerForm.password} onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })} />
                        </div>
                        <div>
                            <label className="form-label">Role</label>
                            <input className="form-control" placeholder="USER" value={registerForm.role} onChange={(e) => setRegisterForm({ ...registerForm, role: e.target.value })} />
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
}


