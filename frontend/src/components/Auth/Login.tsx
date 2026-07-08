import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { clearError, loginUser, setError } from '../../store/slices/authSlice';
import Button from '../Button';
import { loginDataSchema } from '../../schemas/apiSchemas';
import AuthCard from './AuthCard';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validatedData = loginDataSchema.safeParse({ email, password });
    if (!validatedData.success) {
      dispatch(setError(validatedData.error.issues[0]?.message ?? 'Please enter valid credentials'));
      return;
    }

    try {
      await dispatch(loginUser(validatedData.data)).unwrap();
      navigate('/');
    } catch {
      // Error is already set in Redux state
    }
  };

  const displayError = error;

  return (
    <AuthCard
      cardTitle="Sign in"
      cardSubtitle={
        <>
          Don't have an account?&nbsp;
          <Link to="/register" className="font-bold text-silver-900 transition-all duration-200 hover:text-forest-600 hover:underline decoration-2 underline-offset-4">
            Create one
          </Link>
        </>
      }
    >
      {displayError && <div className="mt-6 rounded-2xl border border-apple-200 bg-apple-50 px-5 py-4 text-sm font-medium text-apple-600 animate-fadeIn">{displayError}</div>}

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-bold text-silver-700">
            Email Address
          </label>
          <input id="email" type="email" value={email} onChange={(e) => { if (error) dispatch(clearError()); setEmail(e.target.value); }} placeholder="john@example.com" className="w-full rounded-2xl border border-silver-200 bg-beige-50 px-5 py-4 font-medium text-silver-900 shadow-inner outline-none transition-all placeholder-silver-400 focus:border-silver-400 focus:ring-2 focus:ring-forest-500/20" />
        </div>

        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-bold text-silver-700">
            Password
          </label>
          <input id="password" type="password" value={password} onChange={(e) => { if (error) dispatch(clearError()); setPassword(e.target.value); }} placeholder="••••••••" className="w-full rounded-2xl border border-silver-200 bg-beige-50 px-5 py-4 font-medium text-silver-900 shadow-inner outline-none transition-all placeholder-silver-400 focus:border-silver-400 focus:ring-2 focus:ring-forest-500/20" />
        </div>

        <Button type="submit" disabled={loading} className="mt-2 w-full">
          {loading ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
    </AuthCard>
  );
};

export default Login;
