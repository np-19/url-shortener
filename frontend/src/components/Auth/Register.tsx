import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { registerUser, setError } from '../../store/slices/authSlice';
import Button from '../Button';
import { registerDataSchema } from '../../schemas/apiSchemas';
import AuthSplitPage from './AuthSplitPage';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validatedData = registerDataSchema.safeParse({ name, email, password });
    if (!validatedData.success) {
      dispatch(setError(validatedData.error.issues[0]?.message ?? 'Please enter valid registration details'));
      return;
    }

    try {
      await dispatch(registerUser(validatedData.data)).unwrap();
      navigate('/');
    } catch {
      // Error is already set in Redux state
    }
  };

  const displayError = error;

  return (
    <AuthSplitPage
      heroTitle={<>Join the future of <span className="text-gradient">link sharing.</span></>}
      heroDescription="Create an account to start managing your links, tracking detailed analytics, and elevating your brand."
      heroBadgeTitle="Secure & Private"
      heroBadgeDescription="Your data is safe"
      heroBadgeIcon={<svg className="h-6 w-6 text-forest-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
      cardTitle="Create account"
      cardSubtitle={
        <>
          Already have an account?&nbsp;
          <Link to="/login" className="font-bold text-silver-900 transition-all duration-200 hover:text-forest-600 hover:underline decoration-2 underline-offset-4">
            Sign in
          </Link>
        </>
      }
    >
      {displayError && <div className="mt-6 rounded-2xl border border-apple-200 bg-apple-50 px-5 py-4 text-sm font-medium text-apple-600 animate-fadeIn">{displayError}</div>}

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-bold text-silver-700">
            Full Name
          </label>
          <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="w-full rounded-2xl border border-silver-200 bg-beige-50 px-5 py-4 font-medium text-silver-900 shadow-inner outline-none transition-all placeholder-silver-400 focus:border-silver-400 focus:ring-2 focus:ring-forest-500/20" />
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-bold text-silver-700">
            Email Address
          </label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" className="w-full rounded-2xl border border-silver-200 bg-beige-50 px-5 py-4 font-medium text-silver-900 shadow-inner outline-none transition-all placeholder-silver-400 focus:border-silver-400 focus:ring-2 focus:ring-forest-500/20" />
        </div>

        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-bold text-silver-700">
            Password
          </label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full rounded-2xl border border-silver-200 bg-beige-50 px-5 py-4 font-medium text-silver-900 shadow-inner outline-none transition-all placeholder-silver-400 focus:border-silver-400 focus:ring-2 focus:ring-forest-500/20" />
          <p className="mt-2 ml-2 text-xs font-medium text-silver-500">Must be at least 6 characters</p>
        </div>

        <Button type="submit" disabled={loading} className="mt-2 w-full">
          {loading ? 'Creating account...' : 'Create account'}
        </Button>
      </form>
    </AuthSplitPage>
  );
};

export default Register;
