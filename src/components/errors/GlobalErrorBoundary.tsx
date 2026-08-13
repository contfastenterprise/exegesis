import React, { Component, ErrorInfo } from 'react';
import { AlertTriangle } from 'lucide-react';
import { ErrorPage } from './ErrorPage';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in application:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <ErrorPage
          code="500"
          title="Algo salió mal"
          description="Ocurrió un error inesperado en la aplicación. Nuestro equipo técnico ha sido notificado."
          icon={<AlertTriangle className="w-10 h-10" />}
          primaryAction={{
            label: 'Recargar página',
            onClick: this.handleReload
          }}
        />
      );
    }

    return this.props.children;
  }
}
