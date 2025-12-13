import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";

export interface Transaction {
    _id: string;
    leadId: string;
    transactionId: string;
    amount?: number;
    remark?: string;
    status: 'DECLARED' | 'VERIFIED' | 'REJECTED';
    submittedAt: string;
    lead?: {
        name: string;
        email: string;
        service: string;
    } | null;
}

export function useAdminTransactions() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>("DECLARED");

    const fetchTransactions = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await api.get(`/admin/transactions?status=${filterStatus}&limit=50`);
            if (res.data.success) {
                setTransactions(res.data.data.items);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load transactions");
        } finally {
            setIsLoading(false);
        }
    }, [filterStatus]);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    return {
        transactions,
        isLoading,
        refetch: fetchTransactions,
        filterStatus,
        setFilterStatus
    };
}
