"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Eye, EyeOff } from "lucide-react";
import { z } from "zod";

// Importação dos seus componentes reutilizáveis
import Input from "../components/Inputs/Inputs";
import ActionButton from "../components/ActionButtons/ActionButtons";
import Footer from "../components/Footers/Footers";

// Schema de validação
const loginSchema = z.object({
  email: z.string()
    .email("E-mail inválido.")
    .min(5, "E-mail muito curto."),
  password: z.string()
    .min(6, "A senha deve ter pelo menos 6 caracteres.")
});

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const validation = loginSchema.safeParse({ email, password });

    if (!validation.success) {
      setError(validation.error.issues[0].message.toUpperCase());
      setIsLoading(false);
      return;
    }

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("E-MAIL OU SENHA INVÁLIDOS.");
        setIsLoading(false);
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("ERRO DE CONEXÃO COM O SERVIDOR.");
      setIsLoading(false);
    }
  };

  return (
    /* AJUSTE: flex-col + justify-center centraliza o conteúdo verticalmente */
    <main className="min-h-screen w-full bg-slate-900 flex flex-col items-center justify-center font-sans relative overflow-hidden p-4">
      
      {/* Efeito de fundo azulado */}
      <div className="absolute inset-0 z-0 opacity-20 bg-gradient-to-br from-blue-600 to-black pointer-events-none" />

      {/* Container Principal Centralizado */}
      <div className="relative w-full max-w-sm z-10">
        
        {/* LOGO DO 17º BPM - Ajustado para caber inteiro */}
        <header className="absolute -top-12 left-1/2 -translate-x-1/2 z-20">
          <div className="bg-white p-3 rounded-full shadow-xl border-4 border-slate-100 flex items-center justify-center">
            <Image 
              src="/assets/image/bg-profile.png" 
              alt="Logo 17BPM" 
              width={65} // Diminuído de 80 para 65
              height={65} // Diminuído de 80 para 65
              className="object-contain" // Removido rounded-full da imagem para não cortar as pontas do brasão
              priority 
            />
          </div>
        </header>

        {/* CARD BRANCO */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 pt-20 pb-10 border border-slate-100">
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-slate-700 tracking-tight">Acessar Sistema</h2>
            <p className="text-xs text-slate-400 mt-1">Help Desk - 17º BPM</p>
          </div>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-6 animate-pulse">
              <p className="text-red-700 text-[10px] text-center font-bold uppercase tracking-widest">
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-2">
            <Input 
              label="E-MAIL" 
              type="email" 
              placeholder="Digite seu e-mail..." 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />

            <Input 
              label="SENHA" 
              type={showPassword ? "text" : "password"} 
              placeholder="Digite sua senha..." 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            >
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-blue-600 transition-all"
                tabIndex="-1" 
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </Input>

            <div className="flex justify-end pr-1 mb-6">
              <Link 
                href="/esqueceu_senha" 
                className="text-[11px] text-blue-500 font-bold hover:text-blue-700 transition-colors"
              >
                Esqueceu sua senha?
              </Link>
            </div>

            <ActionButton 
              label="ENTRAR NO SISTEMA"
              type="submit"
              loading={isLoading}
              fullWidth={true}
            />
            
            <div className="text-center text-xs text-slate-500 pt-6 border-t border-slate-50 mt-6">
              Não tem uma conta?{" "}
              <Link 
                href="/register" 
                className="text-blue-500 font-bold hover:underline transition-all"
              >
                Cadastre-se
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Footer fixo na base da tela */}
      <div className="absolute bottom-6 w-full z-10">
        <Footer />
      </div>
    </main>
  );
}