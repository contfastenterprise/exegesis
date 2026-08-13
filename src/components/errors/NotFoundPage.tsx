import React from 'react';
import { Search } from 'lucide-react';
import { ErrorPage } from './ErrorPage';

interface NotFoundPageProps {
  onGoHome: () => void;
  onGoBack?: () => void;
  resourceName?: string;
}

export function NotFoundPage({ onGoHome, onGoBack, resourceName = 'página' }: NotFoundPageProps) {
  return (
    <ErrorPage
      code="404"
      title="Página no encontrada"
      description={`Lo sentimos, la ${resourceName} que estás buscando no existe, ha sido movida o ya no está disponible.`}
      icon={<Search className="w-10 h-10" />}
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
