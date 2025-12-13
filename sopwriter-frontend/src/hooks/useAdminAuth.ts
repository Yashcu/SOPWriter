import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "@/lib/auth";

export function useAdminAuth(requireAuth = true) {
    const navigate = useNavigate();
    const isAuthenticated = auth.isAuthenticated();

    useEffect(() => {
        if (requireAuth && !isAuthenticated) {
            navigate("/admin/login");
        } else if (!requireAuth && isAuthenticated) {
            // e.g. visiting login page while already logged in
            navigate("/admin/dashboard");
        }
    }, [isAuthenticated, requireAuth, navigate]);

    return { isAuthenticated };
}
