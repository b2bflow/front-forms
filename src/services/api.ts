export interface LeadData {
  name: string;
  phone: string;
  email: string;
  business_name: string;
  business_tracking: string;
  product_of_interest: string;
  invoicing: string;
  collaborators: string;
  type_lead: string;
}

export interface CreateLeadData {
  name: string;
  phone: string;
  email: string;
  business_name: string;
  type_lead: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface AvailableDay {
  date: string;
  slots: TimeSlot[];
}

export type LeadNextAction = "collect_more" | "schedule" | "thank_you";

export interface LeadResponse {
  message: string;
  token: string;
  status: string;
  next_action: LeadNextAction;
}

export interface AppointmentData {
  leadToken: string;
  date: string;
  time: string;
}

export interface CreateAppointmentResponse {
  success: boolean;
  eventId: string;
  expiresAt: string;
  confirmedDate: string;
  confirmedTime: string;
}

export interface SessionData {
  leadId: string;
  nome: string;
  empresa: string;
  email: string;
  telefone: string;
  appointmentDate: string;
  appointmentTime: string;
}

const getApiUrl = () => import.meta.env.VITE_API_URL;

const getHeaders = () => ({
  "Content-Type": "application/json",
  "X-Client-Token": import.meta.env.VITE_CLIENT_TOKEN,
});

const parseError = async (response: Response, fallback: string) => {
  try {
    const data = await response.json();
    return data?.error || data?.message || data?.mensagem || fallback;
  } catch {
    return fallback;
  }
};

export const createLead = async (data: CreateLeadData): Promise<LeadResponse> => {
  const response = await fetch(`${getApiUrl()}/leads`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(await parseError(response, "Erro ao criar lead"));
  }

  return response.json();
};

export const updateLead = async (data: LeadData): Promise<LeadResponse> => {
  const response = await fetch(`${getApiUrl()}/leads`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(await parseError(response, "Erro ao atualizar lead"));
  }

  return response.json();
};

export const getAvailableDays = async (): Promise<AvailableDay[]> => {
  const response = await fetch(`${getApiUrl()}/appointment`, {
    method: "GET",
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error(await parseError(response, "Erro ao buscar agenda"));
  }

  return response.json();
};

export const createAppointment = async (
  data: AppointmentData
): Promise<CreateAppointmentResponse> => {
  const response = await fetch(`${getApiUrl()}/appointment`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(await parseError(response, "Erro ao criar evento"));
  }

  const result = await response.json();

  return {
    success: Boolean(result.success),
    eventId: result.event_id || result.eventId || "",
    expiresAt: result.expires_at || result.expiresAt || data.date,
    confirmedDate: result.confirmed_date || result.confirmedDate || data.date,
    confirmedTime: result.confirmed_time || result.confirmedTime || data.time,
  };
};

export const validateSession = async (token: string): Promise<SessionData | null> => {
  try {
    const response = await fetch(`${getApiUrl()}/auth`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    return {
      leadId: data.id,
      nome: data.name,
      empresa: data.business_name || "Não informada",
      email: data.email,
      telefone: data.phone,
      appointmentDate: data.appointmentDate || "",
      appointmentTime: data.appointmentTime || "",
    };
  } catch (error) {
    console.error("[API] Erro ao validar sessão:", error);
    return null;
  }
};
