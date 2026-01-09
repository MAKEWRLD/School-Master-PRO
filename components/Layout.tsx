
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, LogOut, LayoutDashboard, FilePlus, User } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthPage = ['/login', '/register'].includes(location.pathname);
  const isLanding = location.pathname === '/';

  if (isAuthPage) return <>{children}</>;

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div 
              className="flex items-center cursor-pointer" 
              onClick={() => navigate(isLanding ? '/' : '/dashboard')}
            >
              <BookOpen className="h-8 w-8 text-blue-900" />
              <span className="ml-2 text-xl font-bold text-slate-900 tracking-tight">
                SchoolMaster
              </span>
            </div>
            
            {!isLanding && (
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => navigate('/dashboard')}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${location.pathname === '/dashboard' ? 'text-blue-900 bg-blue-50' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <LayoutDashboard className="h-4 w-4 mr-1" />
                  Dashboard
                </button>
                <button 
                  onClick={() => navigate('/new')}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${location.pathname === '/new' ? 'text-blue-900 bg-blue-50' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <FilePlus className="h-4 w-4 mr-1" />
                  Novo Trabalho
                </button>
                <button 
                  onClick={() => navigate('/profile')}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${location.pathname === '/profile' ? 'text-blue-900 bg-blue-50' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <User className="h-4 w-4 mr-1" />
                  Perfil
                </button>
                <button 
                  onClick={() => navigate('/')}
                  className="flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Sair
                </button>
              </div>
            )}

            {isLanding && (
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => navigate('/login')}
                  className="text-slate-600 font-medium hover:text-blue-900"
                >
                  Entrar
                </button>
                <button 
                  onClick={() => navigate('/register')}
                  className="bg-blue-900 text-white px-5 py-2 rounded-full font-semibold hover:bg-blue-800 transition shadow-md"
                >
                  Criar Conta
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-white border-t py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="h-6 w-6 text-blue-900" />
            <span className="ml-2 text-lg font-bold text-slate-900">SchoolMaster</span>
          </div>
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} SchoolMaster. A forma inteligente de criar trabalhos académicos.
          </p>
        </div>
      </footer>
    </div>
  );
};
