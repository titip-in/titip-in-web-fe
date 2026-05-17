import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

export function RequireWaVerification({ children }: { children: React.ReactNode }) {
  const { user, setAuthError } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !user.wa_verified_at) {
      // Trigger dialog
      setAuthError('WA_UNVERIFIED');
      // Redirect user back to dashboard so they don't see the form
      navigate('/', { replace: true }); 
    }
  }, [user, setAuthError, navigate]);

  if (user && !user.wa_verified_at) {
    return null;
  }

  return <>{children}</>;
}
