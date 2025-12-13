import { useState } from "react";
import { api } from "@/lib/api";
import { ENDPOINTS } from "@/lib/endpoints";
import { getUserFriendlyError } from "@/lib/errorMapper";
import { toast } from "sonner";

export function useCreateLead() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createLead = async (data: any) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.post(ENDPOINTS.LEADS, data);
            // Backend returns { success: true, data: { leadId: "..." } }
            const leadId = response.data.data?.leadId || response.data.leadId || response.data.id || response.data._id;
            if (!leadId) {
                console.error("Unexpected response format:", response.data);
                throw new Error("Invalid response from server");
            }
            return leadId;
        } catch (err) {
            const msg = getUserFriendlyError(err);
            setError(msg);
            toast.error(msg);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return { createLead, isLoading, error };
}
