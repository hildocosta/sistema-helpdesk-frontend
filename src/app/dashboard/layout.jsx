"use client";

import Sidebar from "../../components/Sidebar/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen w-full bg-slate-100 flex font-sans overflow-hidden">
      
      {/* SIDEBAR FLUTUANTE - Adicionado padding (p-4) para dar o efeito afastado da borda */}
      <div className="w-72 h-screen shrink-0 hidden md:block p-4 pr-2">
        <Sidebar />
      </div>

      {/* ÁREA DE CONTEÚDO DINÂMICO À DIREITA */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* TOPBAR / BARRA SUPERIOR PADRONIZADA */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-20 shadow-sm">
          <h1 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
            Painel Operacional
          </h1>
          
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs font-bold text-slate-700">Militar Autenticado</p>
              <p className="text-[10px] text-slate-400 uppercase font-medium">17º BPM</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center font-bold text-white text-xs shadow-sm">
              PM
            </div>
          </div>
        </header>

        {/* SUBROTAS DINÂMICAS */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-6 relative">
          {children}
        </main>
      </div>
    </div>
  );
}