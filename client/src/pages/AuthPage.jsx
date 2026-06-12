import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Navigate, useNavigate } from 'react-router-dom';
import { Building2, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [error, setError] = useState('');
  const { user, login, register } = useAuth();
  const navigate = useNavigate();
  const { register: field, handleSubmit, watch, formState: { isSubmitting } } = useForm({
    defaultValues: { role: 'citizen', city: 'Bhopal' }
  });
  const selectedRole = watch('role');

  if (user) return <Navigate to="/" replace />;

  async function onSubmit(values) {
    setError('');
    try {
      if (mode === 'login') await login(values);
      else await register(values);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <div className="auth-intro">
          <div className="brand-mark large">CC</div>
          <h1>Civic Connect</h1>
          <p>Smart civic issue reporting and resolution for citizens and municipal teams.</p>
          <div className="auth-note">
            <Building2 size={19} />
            <span>Clean, accessible, mobile-first public service workflows.</span>
          </div>
        </div>

        <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="segmented-control">
            <button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>
              <LogIn size={16} /> Login
            </button>
            <button type="button" className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')}>
              <UserPlus size={16} /> Signup
            </button>
          </div>

          {mode === 'register' && (
            <>
              <label>Full Name<input {...field('name', { required: true })} /></label>
              <label>Mobile Number<input {...field('phone', { required: true })} /></label>
              <label>User Type
                <select {...field('role', { required: true })}>
                  <option value="citizen">Citizen</option>
                  <option value="admin">Municipal Admin</option>
                </select>
              </label>
              <label>City<input {...field('city', { required: true })} /></label>
              <label>{selectedRole === 'admin' ? 'Admin Area / Office' : 'Area / Ward'}<input {...field('area')} placeholder={selectedRole === 'admin' ? 'Municipal Control Room' : 'MP Nagar, Ward 12'} /></label>
            </>
          )}
          <label>Email<input type="email" {...field('email', { required: true })} /></label>
          <label>Password<input type="password" {...field('password', { required: true, minLength: 8 })} /></label>
          {error && <p className="form-error">{error}</p>}
          <button className="primary-button" type="submit" disabled={isSubmitting}>
            {mode === 'login' ? 'Login' : `Create ${selectedRole === 'admin' ? 'Admin' : 'Citizen'} Account`}
          </button>
        </form>
      </section>
    </main>
  );
}
