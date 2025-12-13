export type Category = "documents" | "profile" | "visa";

export interface WizardDetails {
    name: string;
    email: string;
    phone?: string;
    notes?: string;
}

export interface WizardState {
    category: Category | null;
    service: string | null;
    details: WizardDetails;
}
