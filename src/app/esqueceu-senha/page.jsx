"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MailCheck } from "lucide-react";

import Input from "../../components/Inputs/Inputs";
import ActionButton from "../../components/ActionButtons/ActionButtons";
import Footer from "../../components/Footers/Footers";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleResetRequest = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Mantendo a simulação com as regras de negócio solicitadas
    setTimeout(() => {
      if (email.includes("@")) {
        setIsSubmitted(true);
        setIsLoading(false);
      } else {
        setError("O E-MAIL INFORMADO NÃO FOI ENCONTRADO EM NOSSA BASE.");
        setIsLoading(false);
      }
    }, 1500);
  };

  return (
    <main className="min-h-screen w-full bg-slate-900 flex flex-col items-center justify-center font-sans relative overflow-hidden p-4">
      
      {/* Efeito de fundo azulado - IDÊNTICO AO LOGIN */}
      <div className="absolute inset-0 z-0 opacity-20 bg-gradient-to-br from-blue-600 to-black pointer-events-none" />

      {/* Container Principal Centralizado - Uniforme com o Login e Register */}
      <div className="relative w-full max-w-sm z-10 mt-8 mb-12">
        
        {/* LOGO DO 17º BPM - Padronizado (-top-10 e width 60) */}
        <header className="absolute -top-10 left-1/2 -translate-x-1/2 z-20">
          <div className="bg-white p-2.5 rounded-full shadow-xl border-[3px] border-slate-100 flex items-center justify-center">
            <Image 
              src="/assets/image/bg-profile.png" 
              alt="Logo 17BPM" 
              width={60} 
              height={60} 
              className="object-contain"
              priority 
            />
          </div>
        </header>

        {/* CARD BRANCO - p-6 pt-14 pb-6 (Exatamente igual ao Login) */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 pt-14 pb-6 border border-slate-100">
          {!isSubmitted ? (
            /* ESTADO 1: FORMULÁRIO DE SOLICITAÇÃO */
            <>
              <div className="text-center mb-6">
                <h2 className="text-lg font-bold text-slate-700 tracking-tight">Recuperar Acesso</h2>
                <p className="text-[12px] text-slate-400 mt-0.5">Help Desk - 17º BPM</p>
              </div>
              
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-2 mb-4 animate-pulse">
                  <p className="text-red-700 text-[9px] text-center font-bold uppercase tracking-widest leading-tight">
                    {error}
                  </p>
                </div>
              )}

              <form onSubmit={handleResetRequest} className="space-y-2.5">
                <Input 
                  label="E-MAIL INSTITUCIONAL" 
                  type="email" 
                  placeholder="Digite seu e-mail..." 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                />

                <div className="pt-3">
                  <ActionButton 
                    label="ENVIAR INSTRUÇÕES"
                    type="submit"
                    loading={isLoading}
                    fullWidth={true}
                  />
                </div>
                
                {/* Link Voltar ao Login */}
                <div className="text-center text-[11px] text-slate-500 pt-4 border-t border-slate-50 mt-4">
                  Lembrou a senha?{" "}
                  <Link 
                    href="/login" 
                    className="text-blue-500 font-bold hover:underline transition-all"
                  >
                    Voltar ao Login
                  </Link>
                </div>
              </form>
            </>
          ) : (
            /* ESTADO 2: SUCESSO NO ENVIO */
            <div className="text-center">
              <div className="text-center mb-6">
                <h2 className="text-lg font-bold text-slate-700 tracking-tight">Link Enviado!</h2>
                <p className="text-[12px] text-slate-400 mt-0.5">Help Desk - 17º BPM</p>
              </div>

              <div className="w-12 h-12 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-100 shadow-sm">
                <MailCheck size={24} />
              </div>
              
              <div className="space-y-3 mb-5">
                <p className="text-[11px] text-slate-500 leading-relaxed px-2">
                  As instruções de recuperação foram enviadas para:<br/>
                  <strong className="text-slate-700 font-bold break-all">{email}</strong>
                </p>
                
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-left">
                  <p className="text-[9px] text-slate-500 italic uppercase font-bold mb-1 tracking-wider text-center">
                    Não recebeu o e-mail?
                  </p>
                  <ul className="text-[9px] text-slate-400 space-y-0.5 leading-tight list-none text-center">
                    <li>• Verifique a pasta de <b>Spam</b></li>
                    <li>• Aguarde até 5 minutos para o processamento</li>
                  </ul>
                </div>
              </div>

              <ActionButton 
                label="VOLTAR PARA O LOGIN"
                onClick={() => router.push("/login")}
                fullWidth={true}
              />
              
              <button 
                type="button"
                onClick={() => {
                  setEmail("");
                  setIsSubmitted(false);
                }}
                className="mt-4 text-[11px] font-bold text-slate-400 hover:text-blue-500 transition-colors uppercase tracking-widest block w-full text-center"
              >
                Tentar outro e-mail
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer fixo na base da tela - IDÊNTICO AO LOGIN */}
      <div className="absolute bottom-4 w-full z-10">
        <Footer />
      </div>
    </main>
  );
}