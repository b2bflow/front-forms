import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "./Header";
import { ChatMessage } from "./ChatMessage";
import { TextInput } from "./TextInput";
import { OptionButtons } from "./OptionButtons";
import { DateTimePicker } from "./DateTimePicker";
import { SuccessMessage } from "./SuccessMessage";
import { getSessionCookie, setSessionCookie } from "@/utils/cookies";
import { createLead, createAppointment, LeadData, updateLead } from "@/services/mockApi";

interface LeadFormData {
  nome: string;
  telefone: string;
  email: string;
  empresa: string;
  segmento: string;
  produto: string;
  faturamento: string;
  colaboradores: string;
  dataAgendada: Date;
  horaAgendada: string;
}

type Step =
  | "nome"
  | "telefone"
  | "email"
  | "empresa"
  | "segmento"
  | "produtos"
  | "faturamento"
  | "colaboradores"
  | "data"
  | "success";

const segmentos = ["Tecnologia", "Serviços", "Indústria", "Comércio", "Saúde", "Educação", "Outro"];
const produtos = ["SDR IA", "CONSULTOIA DE IA", "AGENTE IA", "SAAS", "AUTOMAÇÕES", "AINDA NÃO SEI RESPONDER", "OUTRO"];
const faturamentos = [
  "Até R$100 mil/ano",
  "R$100 mil a R$500 mil/ano",
  "R$500 mil a R$2 milhões/ano",
  "R$2 milhões/ano a R$10 milhões/ano",
  "Acima de R$10 milhões/ano",
];
const colaboradoresOptions = ["apenas eu", "1 a 5" ,"6 a 20", "21 a 50", "51 a 200", "+200"];

const [lead_nome, setLeadNome] = useState<string | null>(null);

export const LeadFormChat = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("nome");
  const [leadData, setLeadData] = useState<Partial<LeadFormData>>({});
  const [messages, setMessages] = useState<
    { text: string; isUser: boolean; key: string }[]
  >([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [leadToken, setLeadToken] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Check for existing session on mount
  useEffect(() => {
    const token = getSessionCookie();
    if (token) {
      navigate("/confirmacao");
    }
  }, [navigate]);

  const addMessage = (text: string, isUser: boolean) => {
    setMessages((prev) => [...prev, { text, isUser, key: `${Date.now()}-${isUser}` }]);
  };

  useEffect(() => {
    // Initial greeting
    addMessage(
      "Olá! 👋 Sou o assistente da B2bFlow. Vou criar um Plano 100% Personalizado de IA para sua empresa - focado em aumentar receita, reduzir custos e multiplicar sua margem.",
      false
    );
    setTimeout(() => {
      addMessage("Então bora começar! Qual seu nome?", false);
    }, 500);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, step]);

  const handleNome = (nome: string) => {
    setLeadNome(nome);
    setLeadData((prev) => ({ ...prev, nome }));
    addMessage(nome, true);
    setTimeout(() => {
      addMessage(`Prazer, ${nome}! Qual seu telefone?`, false);
      setStep("telefone");
    }, 400);
  };

  const handleTelefone = (telefone: string) => {
    setLeadData((prev) => ({ ...prev, telefone }));
    addMessage(telefone, true);
    setTimeout(() => {
      addMessage("Ótimo! E qual seu e-mail?", false);
      setStep("email");
    }, 400);
  };

  const handleEmail = (email: string) => {
    setLeadData((prev) => ({ ...prev, email }));
    addMessage(email, true);
      setTimeout(() => {
      addMessage("Perfeito! Qual o nome da sua empresa?", false);
      setStep("empresa");
    }, 400);
  };

  const handleEmpresa = async(empresa: string) => {
    setLeadData((prev) => ({ ...prev, empresa }));
    addMessage(empresa, true);

    const currentLeadData: LeadData = {
      name: leadData.nome!,
      phone: leadData.telefone!,
      email: leadData.email!,
      business_name: empresa,
      business_tracking: '',
      product_of_interest: '',
      invoicing: '',
      collaborators: '',
    };

    try {
      const response = await createLead(currentLeadData);
      setLeadToken(response.token);

      setTimeout(() => {
        addMessage(
          `${lead_nome}! É sempre um prazer conhecer empresas assim como ${empresa}. A IA pode trazer um diferencial incrível para vocês. Qual o segmento da sua empresa?`,
          false
        );
        setStep("segmento");
      }, 400);
      } catch (error) {
      console.error("Error creating lead:", error);
      addMessage("Ocorreu um erro. Por favor, tente novamente.", false);
    }
  };

  const handleSegmento = (segmento: string) => {
    setLeadData((prev) => ({ ...prev, segmento }));
    addMessage(segmento, true);
    setTimeout(() => {
      addMessage(`Ótimo! E qual é o produto que você busca para a ${leadData.empresa}?`, false);
      setStep("produtos");
    }, 400);
  };

  const handleProdutos = (produto: string) => {
    console.log(produto);
    setLeadData((prev) => ({ ...prev, produto }));
    addMessage(produto, true);
    setTimeout(() => {
      addMessage(
        "Excelente! Sua posição é estratégica para identificar onde a IA pode gerar os maiores resultados. Hoje, qual é o seu faturamento anual?",
        false
      );
      setStep("faturamento");
    }, 400);
  };

  const handleFaturamento = (faturamento: string) => {
    setLeadData((prev) => ({ ...prev, faturamento }));
    addMessage(faturamento, true);
    setTimeout(() => {
      addMessage("Estamos quase lá! Quantos colaboradores a empresa possui?", false);
      setStep("colaboradores");
    }, 400);
  };

  const handleColaboradores = async (collaborators: string) => {
    setLeadData((prev) => ({ ...prev, collaborators }));
    addMessage(collaborators, true);

    console.log('aqui', leadData.produto)

    // Create lead after collecting all data
    const currentLeadData: LeadData = {
      name: leadData.nome!,
      phone: leadData.telefone!,
      email: leadData.email!,
      business_name: leadData.empresa!,
      business_tracking: leadData.segmento!,
      product_of_interest: leadData.produto!,
      invoicing: leadData.faturamento!,
      collaborators,
    };

    try {
      await updateLead(currentLeadData);

      setTimeout(() => {
        addMessage(
          `${leadData.nome}, uma empresa com a estrutura de vocês tem um potencial imenso para ganhos de eficiência com IA. Identificamos uma economia estimada de R$ 8.000 a R$ 15.000/mês com as automações certas! 🚀`,
          false
        );
        setTimeout(() => {
          addMessage(
            "Agende abaixo o melhor dia e horário para falar com a nossa equipe e garantir sua sessão estratégica!",
            false
          );
          setStep("data");
        }, 600);
      }, 400);
    } catch (error) {
      console.error("Error creating lead:", error);
      addMessage("Ocorreu um erro. Por favor, tente novamente.", false);
    }
  };

  const handleDateTime = async (date: Date, time: string) => {
    if (!leadToken) return;

    setIsSubmitting(true);

    try {
      const appointmentResponse = await createAppointment({
        leadToken,
        date: date.toISOString().split("T")[0],
        time,
      });

      if (appointmentResponse.success) {
        // Save session cookie
        setSessionCookie(leadToken, new Date(appointmentResponse.expiretedDate));

        setLeadData((prev) => ({
          ...prev,
          dataAgendada: date,
          horaAgendada: time,
        }));
        setStep("success");
      }
    } catch (error) {
      console.error("Error creating appointment:", error);
      addMessage("Ocorreu um erro ao agendar. Por favor, tente novamente.", false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <Header />

        <div
          ref={scrollRef}
          className="space-y-2 max-h-[60vh] overflow-y-auto scroll-smooth pr-2"
        >
          {messages.map((msg) => (
            <ChatMessage key={msg.key} isUser={msg.isUser} delay={0}>
              {msg.text}
            </ChatMessage>
          ))}
        </div>

        <div className="mt-6">
          {step === "nome" && (
            <TextInput placeholder="Digite seu nome..." onSubmit={handleNome} />
          )}
          {step === "telefone" && (
            <TextInput
              placeholder="+55 (00) 00000-0000"
              onSubmit={handleTelefone}
              type="tel"
            />
          )}
          {step === "email" && (
            <TextInput
              placeholder="seu@email.com"
              onSubmit={handleEmail}
              type="email"
            />
          )}
          {step === "empresa" && (
            <TextInput placeholder="Nome da empresa..." onSubmit={handleEmpresa} />
          )}
          {step === "segmento" && (
            <OptionButtons options={segmentos} onSelect={handleSegmento} />
          )}
          {step === "produtos" && (
            <OptionButtons options={produtos} onSelect={handleProdutos} />
          )}
          {step === "faturamento" && (
            <OptionButtons options={faturamentos} onSelect={handleFaturamento} />
          )}
          {step === "colaboradores" && (
            <OptionButtons options={colaboradoresOptions} onSelect={handleColaboradores} />
          )}
          {step === "data" && (
            <DateTimePicker onSelect={handleDateTime} isLoading={isSubmitting} />
          )}
          {step === "success" && leadData.dataAgendada && leadData.horaAgendada && (
            <SuccessMessage
              data={{
                nome: leadData.nome!,
                telefone: leadData.telefone!,
                email: leadData.email!,
                empresa: leadData.empresa!,
                segmento: leadData.segmento!,
                produto: leadData.produto!,
                faturamento: leadData.faturamento!,
                colaboradores: leadData.colaboradores!,
                dataAgendada: leadData.dataAgendada,
                horaAgendada: leadData.horaAgendada,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
