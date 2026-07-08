import { useCallback, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { clearError, registerUser, setError } from '../../store/slices/authSlice';
import Button from '../Button';
import { registerDataSchema } from '../../schemas/apiSchemas';
import AuthSplitPage from './AuthSplitPage';
import authService from '../../services/authService';
import { useDebouncedCallback } from '../../hooks/useDebouncedCallback';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailAvailabilityError, setEmailAvailabilityError] = useState('');
  const [emailChecking, setEmailChecking] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);
  const emailRequestCounter = useRef(0);

  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const getEmailInputClassName = () => {
    const base = "w-full rounded-2xl border px-5 py-4 font-medium outline-none transition-all placeholder-silver-400";
    if (emailChecking) {
      return `${base} border-silver-200 bg-beige-50 text-silver-900 shadow-inner focus:border-silver-400 focus:ring-2 focus:ring-forest-500/20`;
    }
    if (emailAvailabilityError) {
      return `${base} border-apple-500 bg-apple-50/20 text-apple-700 focus:ring-2 focus:ring-apple-500/20`;
    }
    if (emailAvailable && email.trim().length > 0) {
      return `${base} border-green-500 bg-green-50/20 text-green-700 focus:ring-2 focus:ring-green-500/20`;
    }
    return `${base} border-silver-200 bg-beige-50 text-silver-900 shadow-inner focus:border-silver-400 focus:ring-2 focus:ring-forest-500/20`;
  };

  const isEmailFormatValid = (candidate: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(candidate);
  };

  const runEmailAvailabilityCheck = useCallback(async (candidateEmail: string): Promise<boolean> => {
    const normalized = candidateEmail.trim().toLowerCase();

    if (!normalized || !isEmailFormatValid(normalized)) {
      setEmailAvailabilityError('');
      setEmailAvailable(null);
      setEmailChecking(false);
      return true;
    }

    const requestId = ++emailRequestCounter.current;
    setEmailChecking(true);
    setEmailAvailable(null);

    try {
      const result = await authService.checkEmailAvailability(normalized);
      if (requestId !== emailRequestCounter.current) {
        return result.available;
      }

      if (!result.available) {
        setEmailAvailabilityError('An account with this email already exists. Please log in instead.');
        setEmailAvailable(false);
        return false;
      }

      setEmailAvailabilityError('');
      setEmailAvailable(true);
      return true;
    } catch {
      if (requestId === emailRequestCounter.current) {
        setEmailAvailabilityError('Could not verify email right now. Please try again.');
        setEmailAvailable(false);
      }
      return false;
    } finally {
      if (requestId === emailRequestCounter.current) {
        setEmailChecking(false);
      }
    }
  }, []);

  const { debounced: debouncedEmailCheck, cancel: cancelDebouncedEmailCheck } = useDebouncedCallback(
    (candidateEmail: string) => {
      void runEmailAvailabilityCheck(candidateEmail);
    },
    500
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validatedData = registerDataSchema.safeParse({ name, email, password });
    if (!validatedData.success) {
      dispatch(setError(validatedData.error.issues[0]?.message ?? 'Please enter valid registration details'));
      return;
    }

    cancelDebouncedEmailCheck();
    const isEmailAvailable = await runEmailAvailabilityCheck(email);
    if (!isEmailAvailable) {
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
          <input id="name" type="text" value={name} onChange={(e) => { if (error) dispatch(clearError()); setName(e.target.value); }} placeholder="John Doe" className="w-full rounded-2xl border border-silver-200 bg-beige-50 px-5 py-4 font-medium text-silver-900 shadow-inner outline-none transition-all placeholder-silver-400 focus:border-silver-400 focus:ring-2 focus:ring-forest-500/20" />
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-bold text-silver-700">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              if (error) dispatch(clearError());
              setEmailAvailabilityError('');
              setEmailAvailable(null);
              setEmail(e.target.value);
              debouncedEmailCheck(e.target.value);
            }}
            onBlur={() => {
              cancelDebouncedEmailCheck();
              void runEmailAvailabilityCheck(email);
            }}
            placeholder="john@example.com"
            className={getEmailInputClassName()}
          />
          {emailChecking && <p className="mt-2 ml-2 text-xs font-medium text-silver-500">Checking email availability...</p>}
          {emailAvailabilityError && <p className="mt-2 ml-2 text-xs font-medium text-apple-600">{emailAvailabilityError}</p>}
          {!emailChecking && emailAvailable && email.trim().length > 0 && (
            <p className="mt-2 ml-2 text-xs font-medium text-green-600">✓ Email address is available!</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-bold text-silver-700">
            Password
          </label>
          <input id="password" type="password" value={password} onChange={(e) => { if (error) dispatch(clearError()); setPassword(e.target.value); }} placeholder="••••••••" className="w-full rounded-2xl border border-silver-200 bg-beige-50 px-5 py-4 font-medium text-silver-900 shadow-inner outline-none transition-all placeholder-silver-400 focus:border-silver-400 focus:ring-2 focus:ring-forest-500/20" />
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
