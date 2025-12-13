import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";

export interface Lead {
    _id: string;
    name: string;
    email: string;
    phone: string;
    service: string;
    status: string;
    notes?: string;
    createdAt: string;
}

export function useAdminLeads() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    const fetchLeads = useCallback(async () => {
        setIsLoading(true);
        try {
            let query = `?limit=100`;
            if (debouncedSearch) {
                query += `&search=${encodeURIComponent(debouncedSearch)}`;
            }

            const res = await api.get(`/admin/leads${query}`);

            if (res.data.success) {
                let filteredLeads = res.data.data.items;

                // Client-side status filter
                if (statusFilter !== "all") {
                    filteredLeads = filteredLeads.filter((lead: Lead) => lead.status === statusFilter);
                }

                setLeads(filteredLeads);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load leads");
        } finally {
            setIsLoading(false);
        }
    }, [debouncedSearch, statusFilter]);

    useEffect(() => {
        fetchLeads();
    }, [fetchLeads]);

    return {
        leads,
        isLoading,
        refetch: fetchLeads,
        search,
        setSearch,
        statusFilter,
        setStatusFilter
    };
}
