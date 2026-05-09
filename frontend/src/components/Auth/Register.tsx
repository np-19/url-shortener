import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { registerUser, clearError } from '../../store/slices/authSlice';
import Button from '../Button';
import Logo from '../Logo';
import { registerDataSchema } from '../../schemas/apiSchemas';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    dispatch(clearError());

    const validatedData = registerDataSchema.safeParse({ name, email, password });
    if (!validatedData.success) {
      setLocalError(validatedData.error.issues[0]?.message ?? 'Please enter valid registration details');
      return;
    }

    try {
      await dispatch(registerUser(validatedData.data)).unwrap();
      navigate('/');
    } catch (err) {
      // Error is already set in Redux state
    }
  };

  const displayError = localError || error;

  return (
    <div className="flex items-center justify-center py-8 px-4">
      <div className="mx-auto w-full max-w-lg bg-white rounded-2xl p-6 sm:p-10 shadow-2xl border border-gray-200">
        <div className="mb-4 flex justify-center">
          <Logo width="100px" />
        </div>
        
        <h2 className="text-center text-2xl sm:text-3xl font-bold leading-tight text-gray-800">
          Create your account
        </h2>
        
        <p className="mt-2 text-center text-sm sm:text-base text-gray-600">
          Already have an account?&nbsp;
          <Link
            to="/login"
            className="font-semibold text-gray-900 transition-all duration-200 hover:text-gray-700 hover:underline"
          >
            Sign In
          </Link>
        </p>

        {displayError && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {displayError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none transition"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none transition"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none transition"
            />
            <p className="mt-1 text-sm text-gray-500">Must be at least 6 characters</p>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Register;
