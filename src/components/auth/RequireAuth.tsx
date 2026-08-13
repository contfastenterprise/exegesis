import React, { useEffect } from 'react';
import { UserSession } from '../../types';
import { UnauthorizedPage } from '../errors/UnauthorizedPage';

interface RequireAuthProps {
  session: UserSession | null;
  requireAdmin?: boolean;
  onLoginNeeded: () => void;
  onGoHome: () => void;
  onGoBack: () => void;
  children: React.ReactNode;
}

export function RequireAuth({
  session,
  requireAdmin = false,
  onLoginNeeded,
  onGoHome,
  onGoBack,
  children
}: RequireAuthProps) {
  
  useEffect(() => {
    // If there is no session, we trigger the login flow immediately
    if (!session) {
      onLoginNeeded();
    }
  }, [session, onLoginNeeded]);

  // If not logged in, we can just return null while the login modal/view is shown
  if (!session) {
    return null; 
  }

  // If admin is required but user is not admin
  if (requireAdmin && !session.isAdmin) {
    return <UnauthorizedPage onGoHome={onGoHome} onGoBack={onGoBack} />;
  }

  // If all checks pass, render the protected content
  return <>{children}</>;
}
