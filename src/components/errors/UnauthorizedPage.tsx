import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { ErrorPage } from './ErrorPage';

interface UnauthorizedPageProps {
  onGoHome: () => void;
  onGoBack?: () => void;
}

export function UnauthorizedPage({ onGoHome, onGoBack }: UnauthorizedPageProps) {
  return (
    <ErrorPage
      code="403"
      title="Acceso Denegado"
      description="No tienes los permisos necesarios para acceder a esta sección. Si crees que esto es un error, contacta al administrador del sistema."
      icon={<ShieldAlert className="w-10 h-10" />}
      primaryAction={{
        label: 'Ir al Inicio',
        onClick: onGoHome
      }}
      secondaryAction={
        onGoBack ? {
          label: 'Regresar',
          onClick: onGoBack
        } : undefined
      }
    />
  );
}
