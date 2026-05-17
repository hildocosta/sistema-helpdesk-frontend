"use client";
import { useState } from "react"; 
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { 
  LayoutDashboard,  // Contexto: Painel Geral/Métricas
  HardDrive,        // Contexto: Fila de Chamados Técnicos
  ShieldAlert,      // Contexto: Incidentes Críticos / Alertas
  Wrench,           // Contexto: Inventário de TI / Equipamentos
  BarChart3,        // Contexto: Relatórios de Desempenho (SLA)
  UserCheck,        // Contexto: Técnicos de Plantão / Escala
  LogOut,
  Loader2,
  ChevronRight
} from "lucide-react";

// Itens de menu mapeados estritamente para o ambiente de suporte e Help Desk da unidade
const menuItems = [
  { name: "Painel Geral", icon: LayoutDashboard, path: "/dashboard" },
  { name: "Fila de Chamados", icon: HardDrive, path: "/dashboard/chamados" },
  { name: "Incidentes Críticos", icon: ShieldAlert, path: "/dashboard/criticos" },
  { name: "Inventário de TI", icon: Wrench, path: "/dashboard/inventario" },  
  { name: "Métricas / SLA", icon: BarChart3, path: "/dashboard/relatorios" },
  { name: "Escala Técnica", icon: UserCheck, path: "/dashboard/tecnicos" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async (e) => {
    e.preventDefault(); 
    setIsLoggingOut(true); 

    try {
      await signOut({ 
        redirect: true, 
        callbackUrl: "/login" 
      });
    } catch (error) {
      console.error("Erro ao sair do sistema:", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <aside className="w-full h-full bg-slate-900 rounded-2xl shadow-xl border border-slate-800 flex flex-col justify-between overflow-hidden">
      
      {/* Topo do Menu: Logo da Unidade */}
      <div className="flex items-center justify-center px-4 py-6 border-b border-slate-800/50 shrink-0">
        <Image 
          src="/assets/image/bg-profile.png" 
          alt="Logo" 
          width={38} 
          height={38}
          className="brightness-125 select-none"
        />
        <span className="text-white font-bold tracking-wider text-xs uppercase ml-3">
          Suporte 17º BPM
        </span>
      </div>

      {/* Primeiro Separador com Efeito Gradiente */}
      <div className="px-6 shrink-0">
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
      </div>

      {/* Centro do Menu: Lista de Links Operacionais Centralizada Verticalmente */}
      <nav className="flex-1 flex flex-col justify-center space-y-1.5 py-6 overflow-y-auto scrollbar-none">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`);

          return (
            <Link key={item.path} href={item.path} className="block px-4">
              <div className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? "bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/10" 
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"
              }`}>
                <div className="flex items-center gap-3">
                  <Icon 
                    size={18} 
                    className={`transition-colors ${isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"}`} 
                  />
                  <span className="text-[13px] tracking-wide">{item.name}</span>
                </div>
                
                {isActive && (
                  <ChevronRight size={14} className="text-white/70 animate-in fade-in slide-in-from-left-1" />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Segundo Separador com Efeito Gradiente */}
      <div className="px-6 shrink-0">
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
      </div>
      
      {/* Botão de Logout */}
      <div className="w-full px-4 pt-6 mb-8 shrink-0">
        <button 
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={`sidebar-footer-btn w-full py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 m-0
            ${isLoggingOut ? "opacity-70 bg-slate-600 cursor-not-allowed" : "hover:scale-[1.02] bg-linear-to-tr from-blue-600 to-blue-400 text-white shadow-lg shadow-blue-500/30"}`}
        >
          {isLoggingOut ? (
            <>
              <Loader2 className="animate-spin" size={16} />
              <span>Saindo...</span>
            </>
          ) : (
            <>
              <LogOut size={16} />
              <span className="font-bold uppercase text-xs tracking-widest">Sair</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}