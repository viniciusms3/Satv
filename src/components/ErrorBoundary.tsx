import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in SATV App:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0b0f19] text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-600/20 border border-red-500/40 flex items-center justify-center mb-4 text-red-400 text-2xl font-bold">
            !
          </div>
          <h1 className="text-xl font-bold mb-2">SATV - Recarregando Interface</h1>
          <p className="text-sm text-slate-400 max-w-md mb-6">
            Ocorreu um pequeno erro de renderização. Clique abaixo para restaurar o aplicativo.
          </p>
          <button
            type="button"
            onClick={() => {
              try {
                localStorage.removeItem('satv_last_focused_channel_name');
                localStorage.removeItem('satv_last_focused_channel_id');
              } catch {
                // ignore
              }
              window.location.reload();
            }}
            className="px-6 py-2.5 rounded-full bg-[#0381fe] hover:bg-blue-600 text-white font-bold text-sm shadow-lg shadow-[#0381fe]/40 transition cursor-pointer"
          >
            Recarregar SATV
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
