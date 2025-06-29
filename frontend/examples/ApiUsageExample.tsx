'use client';

import { useState, useEffect } from 'react';
import { authService, customerService } from '@/services';
import type { Category } from '@/services';

/**
 * Example component demonstrating API integration
 */
export default function ApiUsageExample() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loginMessage, setLoginMessage] = useState<string | null>(null);

  // Example of fetching data on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await customerService.getCategories();
        setCategories(data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        setError('Failed to load categories. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Example of handling form submission with API call
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoginMessage(null);
      const response = await authService.login({ email, password });

      if (response.success) {
        setLoginMessage('Login successful!');
        // In a real app, you might redirect or update global state here
      } else {
        setLoginMessage(response.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setLoginMessage('An error occurred during login. Please try again.');
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">API Integration Example</h1>

      {/* Login Form Example */}
      <div className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Login Example</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Login
          </button>

          {loginMessage && (
            <p
              className={`mt-2 ${loginMessage.includes('successful') ? 'text-green-600' : 'text-red-600'}`}
            >
              {loginMessage}
            </p>
          )}
        </form>
      </div>

      {/* Data Fetching Example */}
      <div className="p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Categories Data</h2>

        {loading && <p>Loading categories...</p>}

        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && (
          <>
            {categories.length === 0 ? (
              <p>No categories found.</p>
            ) : (
              <ul className="list-disc pl-5">
                {categories.map(category => (
                  <li key={category.id} className="mb-1">
                    {category.name}
                    {category.description && (
                      <span className="text-gray-600 text-sm ml-2">- {category.description}</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
}
