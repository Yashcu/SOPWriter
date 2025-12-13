export interface ServiceItem {
    name: string;
    price: number;
    description: string;
}

export interface CategoryConfig {
    key: string;
    label: string;
    description: string;
    services: ServiceItem[];
}

export interface ContactConfig {
    phone: string;
    whatsapp: string;
    email: string;
    supportEmail: string;
}

export interface PaymentConfig {
    upiId: string;
    upiQrImage?: string;
}

export interface AppConfig {
    categories: CategoryConfig[];
    contact: ContactConfig;
    payment: PaymentConfig;
}
