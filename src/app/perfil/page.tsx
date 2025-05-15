"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export default function Perfil() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    
    try {
      // Validar senha
      if (formData.newPassword && formData.newPassword.length < 6) {
        setMessage({ type: 'error', text: 'A nova senha deve ter pelo menos 6 caracteres' });
        return;
      }
      
      if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
        setMessage({ type: 'error', text: 'As senhas não coincidem' });
        return;
      }
      
      // Simulação de atualização bem-sucedida
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
      setEditing(false);
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao atualizar perfil. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Cabeçalho com botão de voltar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold">Perfil do Usuário</h1>
        <Button 
          variant="ghost" 
          className="mt-3 md:mt-0"
          onClick={() => router.push('/home')}
          startIcon={<FaArrowLeft className="h-5 w-5" />}
        >
          Voltar
        </Button>
      </div>
      
      {message && (
        <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'} mb-6`}>
          {message.type === 'success' ? (
            <FaCheckCircle className="stroke-current shrink-0 h-6 w-6" />
          ) : (
            <FaTimesCircle className="stroke-current shrink-0 h-6 w-6" />
          )}
          <span>{message.text}</span>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card bordered>
            <div className="flex flex-col items-center text-center p-2">
              <div className="avatar placeholder mb-4">
                <div className="bg-neutral text-neutral-content rounded-full w-24">
                  <span className="text-3xl">{user?.name?.charAt(0).toUpperCase() || "U"}</span>
                </div>
              </div>
              <h2 className="text-xl font-bold">{user?.name || "Usuário"}</h2>
              <p className="text-base-content/70">{user?.email || "usuario@exemplo.com"}</p>
              <p className="badge badge-accent mt-2">{user?.role === 'admin' ? 'Administrador' : 'Usuário'}</p>
              
              <div className="divider"></div>
              
              <div className="stat">
                <div className="stat-title">Último acesso</div>
                <div className="stat-value text-base">{new Date().toLocaleDateString('pt-BR')}</div>
                <div className="stat-desc">{new Date().toLocaleTimeString('pt-BR')}</div>
              </div>
            </div>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card 
            title="Informações do Perfil"
            bordered
            contentClassName="p-4"
            footer={
              editing ? (
                <div className="flex gap-2 justify-end">
                  <Button 
                    variant="ghost" 
                    onClick={() => setEditing(false)}
                    disabled={loading}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    variant="primary" 
                    type="submit"
                    form="profile-form"
                    isLoading={loading}
                  >
                    Salvar Alterações
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="primary" 
                  onClick={() => setEditing(true)}
                >
                  Editar Perfil
                </Button>
              )
            }
          >
            <form id="profile-form" onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Nome</span>
                </label>
                <input 
                  type="text" 
                  name="name"
                  className="input input-bordered" 
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!editing}
                  required
                />
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input 
                  type="email" 
                  name="email"
                  className="input input-bordered" 
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!editing}
                  required
                />
              </div>
              
              {editing && (
                <>
                  <div className="divider">Alterar Senha (opcional)</div>
                  
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Senha Atual</span>
                    </label>
                    <input 
                      type="password" 
                      name="currentPassword"
                      className="input input-bordered" 
                      value={formData.currentPassword}
                      onChange={handleChange}
                      placeholder="Digite sua senha atual"
                    />
                  </div>
                  
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Nova Senha</span>
                    </label>
                    <input 
                      type="password" 
                      name="newPassword"
                      className="input input-bordered" 
                      value={formData.newPassword}
                      onChange={handleChange}
                      placeholder="Digite a nova senha"
                    />
                  </div>
                  
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Confirmar Nova Senha</span>
                    </label>
                    <input 
                      type="password"
                      name="confirmPassword" 
                      className="input input-bordered" 
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirme a nova senha"
                    />
                  </div>
                </>
              )}
            </form>
          </Card>
          
          <div className="mt-6">
            <Card title="Preferências" bordered contentClassName="p-4">
              <div className="space-y-4">
                <div className="form-control">
                  <label className="cursor-pointer label justify-start gap-4">
                    <input type="checkbox" className="toggle toggle-primary" defaultChecked={true} />
                    <span className="label-text">Receber notificações de produtos com baixo estoque</span>
                  </label>
                </div>
                
                <div className="form-control">
                  <label className="cursor-pointer label justify-start gap-4">
                    <input type="checkbox" className="toggle toggle-primary" defaultChecked={true} />
                    <span className="label-text">Receber relatórios semanais por email</span>
                  </label>
                </div>
                
                <div className="form-control">
                  <label className="cursor-pointer label justify-start gap-4">
                    <input type="checkbox" className="toggle toggle-primary" defaultChecked={false} />
                    <span className="label-text">Ativar autenticação em dois fatores</span>
                  </label>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 