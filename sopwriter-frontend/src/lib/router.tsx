import { createBrowserRouter, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import Header from "@/components/layout/Header";

const Home = lazy(() => import("@/pages/Home"));
const Wizard = lazy(() => import("@/pages/Wizard"));
const Success = lazy(() => import("@/pages/Success"));
const Payment = lazy(() => import("@/pages/Payment"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const AdminLogin = lazy(() => import("@/pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
const AdminSettings = lazy(() => import("@/pages/admin/AdminSettings"));

const PageLoader = () => (
    <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
);

// eslint-disable-next-line react-refresh/only-export-components
function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Header />
            <Suspense fallback={<PageLoader />}>
                {children}
            </Suspense>
        </>
    );
}

export const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <Layout>
                <Home />
            </Layout>
        ),
    },
    {
        path: "/wizard",
        element: (
            <Layout>
                <Wizard />
            </Layout>
        ),
    },
    {
        path: "/payment",
        element: (
            <Layout>
                <Payment />
            </Layout>
        ),
    },
    {
        path: "/success",
        element: (
            <Layout>
                <Success />
            </Layout>
        ),
    },
    {
        path: "/admin/login",
        element: (
            <Suspense fallback={<PageLoader />}>
                <AdminLogin />
            </Suspense>
        ),
    },
    {
        path: "/admin",
        element: <Navigate to="/admin/dashboard" replace />,
    },
    {
        path: "/admin/dashboard",
        element: (
            <Suspense fallback={<PageLoader />}>
                <AdminDashboard />
            </Suspense>
        ),
    },
    {
        path: "/admin/settings",
        element: (
            <Suspense fallback={<PageLoader />}>
                <AdminSettings />
            </Suspense>
        ),
    },
    {
        path: "*",
        element: (
            <Layout>
                <NotFound />
            </Layout>
        ),
    },
]);
