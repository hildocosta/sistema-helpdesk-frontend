"use client";

import { useState, useEffect } from "react";
import { 
  AlertTriangle, Shield, BarChart3, Clock, 
  User, HardDrive, LayoutDashboard, Activity, BookOpen 
} from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

// ESTRUTURA DE DADOS MOCK VOLTADA PARA HELP DESK E SUPORTE OPERACIONAL
const DADOS_MOCK = {
  isPendente: false,
  turnoAlvo: "ALFA (06h às 18h)",
  ultimoChamado: {
    responsavel: "SGT MARCOS",
    hora: "12:45"
  },
  stats: {
    resolvidos: "100%",
    abertos: 42,
    emAtendimento: 18,
    criticos: 0
  },
  grafico: [
    { name: "Abertos", valor: 42, fill: "#10b981" },
    { name: "Em Atendimento", valor: 18, fill: "#0ea5e9" },
    { name: "Críticos", valor: 0, fill: "#ef4444" }
  ],
  logs: [
    {
      id: "HD-01",
      equipamento: "REDE LOGÍSTICA - TERMINAL DA SGO",
      status: "EM ATENDIMENTO",
      militar: "CB RODRIGUES - INSTABILIDADE NA CONEXÃO COM O SISTEMA OPERACIONAL CAD",
      livro: "T-02",
      hora: "13:20",
      responsavel: "SGT MARCOS"
    },
    {
      id: "HD-04",
      equipamento: "IMPRESSORA TÉRMICA - SEÇÃO DE TRÂNSITO",
      status: "RESOLVIDO",
      militar: "RECONFIGURAÇÃO DE DRIVER E SUBSTITUIÇÃO DE SUPRIMENTO REALIZADA",
      livro: "T-02",
      hora: "11:15",
      responsavel: "SGT MARCOS"
    }
  ]
};

export default function DashboardComando() {
  const [data, setData] = useState(DADOS_MOCK);
  const [time, setTime] = useState(null); // Iniciado como null para evitar problemas de hidratação SSR

  useEffect(() => {
    let active = true;

    const obterHoraFormatada = () => {
      return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    };

    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats');
        if (!res.ok) throw new Error("Erro na rede");
        const result = await res.json();
        if (active) setData(result);
      } catch (err) {
        console.warn("Mantendo dados Mock locais enquanto a API está indisponível.");
      }
    };

    // Agendamento não-bloqueante via Microtask / Event Loop externo (Evita Cascading Render)
    Promise.resolve().then(() => {
      if (active) {
        setTime(obterHoraFormatada());
        fetchStats();
      }
    });

    // Subscrições assíncronas padrão (Eventos externos do browser)
    const timerRelogio = setInterval(() => {
      setTime(obterHoraFormatada());
    }, 1000);

    const timerAPI = setInterval(() => {
      fetchStats();
    }, 10000); 

    // Cleanup robusto desativando flags e limpando os intervalos
    return () => {
      active = false;
      clearInterval(timerRelogio);
      clearInterval(timerAPI);
    };
  }, []);

  // Tela de carregamento enquanto o Client-side valida o estado inicial do relógio
  if (!time) {
    return (
      <div className="h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-500 font-semibold gap-3 animate-pulse">
        <Shield size={40} className="text-slate-400 animate-spin" /> 
        <p className="tracking-widest text-xs uppercase font-bold text-slate-600">Carregando Módulos de Segurança...</p>
      </div>
    );
  }

  const totalIncidentes = (data.stats?.abertos ?? 0) + (data.stats?.emAtendimento ?? 0) + (data.stats?.criticos ?? 0);

  return (
    <div className="h-screen bg-slate-50 text-slate-800 p-4 flex flex-col gap-4 overflow-hidden font-sans antialiased">
      
      {/* HEADER INSTITUCIONAL */}
      <div className="flex justify-between items-center bg-white border border-slate-200/80 p-4 rounded-xl shadow-sm shrink-0">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl transition-all ${data.isPendente ? 'bg-red-500 animate-pulse' : 'bg-slate-900'}`}>
            <Shield className="text-white" size={22} />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900 uppercase">
              17º BPM - Painel do Help Desk Operacional
            </h1>
            <div className="flex items-center gap-3 mt-1.5">
               <span className={`flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${data.isPendente ? 'bg-red-50 text-red-600 border-red-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'}`}>
                 <Activity size={12} /> 
                 {data.isPendente ? 'ALERTA: INSTABILIDADE' : `SUPORTE ATIVO: ${data.turnoAlvo}`}
               </span>
               <span className="text-slate-500 text-[11px] font-medium flex items-center gap-1.5">
                 <User size={12} className="text-slate-400" /> Técnico de Plantão: <strong className="text-slate-700 font-semibold">{data.ultimoChamado?.responsavel}</strong>
               </span>
            </div>
          </div>
        </div>
        
        <div className="text-right border-l border-slate-200 pl-6">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-0.5">Hora do Sistema</p>
          <div className="text-2xl font-mono font-bold text-slate-900 tracking-tight">
            {time}
          </div>
        </div>
      </div>

      {/* CARDS DE ESTATÍSTICAS (KPIs) */}
      <div className="grid grid-cols-4 gap-4 shrink-0">
        <StatCard label="Taxa de Resolução" value={data.stats?.resolvidos} sub={`Atualizado às ${data.ultimoChamado?.hora}`} color="text-emerald-600" icon={<Clock size={18}/>} />
        <StatCard label="Chamados Abertos" value={data.stats?.abertos} sub="Fila de espera / Triagem" color="text-slate-800" icon={<HardDrive size={18} className="text-slate-500"/>} />
        <StatCard label="Em Atendimento" value={data.stats?.emAtendimento} sub="Técnicos em campo" color="text-sky-600" icon={<User size={18} className="text-sky-500"/>} />
        <StatCard label="Incidentes Críticos" value={data.stats?.criticos} sub="Alta prioridade" color={data.stats?.criticos > 0 ? "text-red-600" : "text-slate-400"} icon={<AlertTriangle size={18} />} alert={data.stats?.criticos > 0} />
      </div>

      {/* ÁREA CENTRAL */}
      <div className="flex-1 grid grid-cols-12 gap-4 min-h-0 overflow-hidden">
        
        {/* GRÁFICO DE PIZZA */}
        <div className="col-span-7 bg-white border border-slate-200/80 rounded-xl p-5 flex flex-col shadow-sm">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
            <BarChart3 size={14} className="text-sky-500" /> Panorama de Volumetria de Incidentes
          </h2>
          <div className="flex-1 min-h-0 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={data.grafico} 
                  innerRadius="65%" 
                  outerRadius="85%" 
                  paddingAngle={4} 
                  dataKey="valor"
                  cx="50%"
                  cy="50%"
                  stroke="#fff"
                  strokeWidth={2}
                >
                  {data.grafico?.map((entry, i) => (
                    <Cell key={`cell-${i}`} fill={entry.fill} className="outline-none" />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                <Legend 
                   verticalAlign="bottom" 
                   align="center"
                   iconType="circle"
                   iconSize={8}
                   wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-[-16px]">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total</span>
                <span className="text-3xl font-bold text-slate-800 leading-tight">
                    {totalIncidentes}
                </span>
            </div>
          </div>
        </div>

        {/* MONITORAMENTO EM TEMPO REAL */}
        <div className="col-span-5 bg-white border border-slate-200/80 rounded-xl p-5 flex flex-col shadow-sm overflow-hidden">
          <div className="flex justify-between items-center mb-4 shrink-0 border-b border-slate-100 pb-3">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <LayoutDashboard size={14} className="text-sky-500" /> Atividades Recentes de TI
            </h2>
            <span className="text-[10px] font-bold text-sky-600 bg-sky-50 border border-sky-100 px-2 py-0.5 rounded-md animate-pulse">LIVE</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
            {data.logs?.length > 0 ? (
              data.logs.map((log, i) => (
                <div key={i} className={`p-3.5 rounded-xl border transition-all bg-white hover:border-slate-300 ${log.status === 'CRÍTICO' ? 'border-red-200 bg-red-50/30' : 'border-slate-200'}`}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-slate-600 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded">
                          {log.id}
                        </span>
                        <span className="text-xs font-semibold text-slate-700 truncate max-w-[180px]">
                          {log.equipamento}
                        </span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        log.status === 'CRÍTICO' ? 'bg-red-100 text-red-700' : 
                        log.status === 'RESOLVIDO' ? 'bg-emerald-100 text-emerald-700' : 'bg-sky-100 text-sky-700'
                    }`}>
                      {log.status}
                    </span>
                  </div>
                  
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 border border-slate-100 p-2.5 rounded-lg font-medium italic">
                    {`"${log.militar}"`}
                  </p>

                  <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-slate-100">
                    <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
                        <BookOpen size={12} className="text-slate-400" /> 
                        Registro: <span className="text-slate-700 font-semibold">{log.livro}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                        <Clock size={11} /> {log.hora} {"•"} {log.responsavel}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                  <Activity size={24} className="text-slate-300" />
                  <p className="text-xs font-medium">Nenhum chamado pendente no momento.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, icon, color, alert }) {
  return (
    <div className={`bg-white border p-4 rounded-xl shadow-sm relative overflow-hidden transition-all duration-200 hover:border-slate-300 ${alert ? 'border-red-200 bg-red-50/20' : 'border-slate-200/80'}`}>
      <div className={`absolute -right-2 -top-2 p-4 opacity-10 ${color}`}>{icon}</div>
      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      <h3 className={`text-3xl font-bold tracking-tight mb-1 ${color}`}>{value}</h3>
      <div className="flex items-center gap-1.5">
          {alert && <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />}
          <p className={`text-[11px] font-medium ${alert ? 'text-red-600 font-semibold' : 'text-slate-400'}`}>{sub}</p>
      </div>
    </div>
  );
}