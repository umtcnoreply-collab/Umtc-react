import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
}

/**
 * ProtectedRoute Component
 * - If requireAuth is true: only allows authenticated users
 * - If requireAuth is false: redirects authenticated users away
 */
export default function ProtectedRoute({
  children,
  requireAuth = true,
}: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);

  // Show loading while initializing auth state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#fcf9f4]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#570013]"></div>
          <p className="mt-4 text-[#584141] font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // If route requires auth and user is not authenticated, redirect to login
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // If route should only be accessible when not authenticated (login/registration)
  // and user is authenticated, redirect to basic-details
  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/basic-details" replace />;
  }

  return <>{children}</>;
}
