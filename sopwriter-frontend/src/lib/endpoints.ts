export const ENDPOINTS = {
    LEADS: "/leads",
    TRANSACTIONS: (leadId: string) => `/leads/${leadId}/transactions`,
    HEALTH: "/health",
} as const;
