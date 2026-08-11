import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Mail, Key, X, Sparkles, AlertCircle, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { AuthService, isSupabaseConfigured } from '../lib/supabase';
import { UserSession } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (session: UserSession) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const res = await AuthService.login(email, password);
      if (res.success && res.session) {
        onSuccess(res.session);
        onClose();
      } else {
        setErrorMessage(res.error || 'Credenciales incorrectas');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error al autenticar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-md bg-[#fff8f6] rounded-2xl shadow-2xl border border-[#e9e1df] p-6 sm:p-8 overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-[#504441] hover:text-[#1e1b1a] rounded-full hover:bg-[#efe6e4] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#faf2f0] border border-[#D4AF37]/40 text-xs font-medium text-[#442a22] mb-4">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Acceso Privado Protegido</span>
          </div>

          <h3 className="font-serif text-2xl font-bold text-[#442a22] mb-1">
            Autenticación de Usuario
          </h3>
          <p className="text-xs text-[#504441] mb-6 leading-relaxed">
            Ingresa tus credenciales de administrador para acceder a la pantalla de Configuración y gestión privada de datos.
          </p>

          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#1e1b1a] uppercase tracking-wider mb-1.5">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-[#75584d]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ej. pastor@iglesia.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#faf2f0] border border-[#e9e1df] text-sm text-[#1e1b1a] focus:outline-none focus:ring-2 focus:ring-[#442a22] focus:bg-[#fff8f6] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1e1b1a] uppercase tracking-wider mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <Key className="absolute left-3.5 top-3 w-4 h-4 text-[#75584d]" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña segura"
                  className="w-full pl-10 pr-12 py-2.5 rounded-xl bg-[#faf2f0] border border-[#e9e1df] text-sm text-[#1e1b1a] focus:outline-none focus:ring-2 focus:ring-[#442a22] focus:bg-[#fff8f6] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 p-1 text-[#75584d] hover:text-[#1e1b1a] transition-colors focus:outline-none rounded-full hover:bg-[#efe6e4]"
                  title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-[#442a22] text-[#fff8f6] font-semibold text-sm hover:bg-[#5d4037] shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4 text-[#D4AF37]" />
              {loading ? 'Verificando...' : 'Iniciar Sesión'}
            </button>
          </form>


        </motion.div>
      </div>
    </AnimatePresence>
  );
};
