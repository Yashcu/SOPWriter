import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useAdminTransactions } from "@/hooks/useAdminTransactions";
import { useAdminLeads } from "@/hooks/useAdminLeads";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { LogOut, RefreshCcw, Download, Search, Settings } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import TransactionTable from "@/components/admin/TransactionTable";
import LeadTable from "@/components/admin/LeadTable";
import VerifyTransactionModal from "@/components/admin/VerifyTransactionModal";
import { Loader2 } from "lucide-react";

export default function AdminDashboard() {
    const navigate = useNavigate();
    useAdminAuth(true); // Protect route

    const { transactions, isLoading: txLoading, refetch: refetchTx, filterStatus, setFilterStatus } = useAdminTransactions();
    const { leads, isLoading: leadsLoading, refetch: refetchLeads, search, setSearch, statusFilter, setStatusFilter } = useAdminLeads();

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTxId, setSelectedTxId] = useState<string | null>(null);
    const [action, setAction] = useState<'VERIFY' | 'REJECT' | null>(null);

    const handleAction = (txId: string, actionType: 'VERIFY' | 'REJECT') => {
        setSelectedTxId(txId);
        setAction(actionType);
        setIsModalOpen(true);
    };

    const handleDownloadLeads = () => {
        const headers = ["Ref ID", "Name", "Email", "Phone", "Service", "Created At"];
        const csvContent = [
            headers.join(","),
            ...leads.map(lead => [
                lead._id,
                `"${lead.name}"`,
                lead.email,
                lead.phone || "",
                `"${lead.service}"`,
                new Date(lead.createdAt).toISOString()
            ].join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `leads_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleRefresh = () => {
        refetchTx();
        refetchLeads();
    };

    return (
        <div className="min-h-screen bg-background">
            <header className="border-b bg-card">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <h1 className="text-xl font-bold">Admin Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" onClick={() => navigate("/admin/settings")}>
                            <Settings className="h-4 w-4 mr-2" />
                            Settings
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => auth.logout()}>
                            <LogOut className="h-4 w-4 mr-2" />
                            Logout
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
                        <p className="text-muted-foreground">Manage transactions and view all leads</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            onClick={handleRefresh}
                        >
                            <RefreshCcw className={`mr-2 h-4 w-4 ${txLoading || leadsLoading ? 'animate-spin' : ''}`} />
                            Refresh Data
                        </Button>
                    </div>
                </div>

                <Tabs defaultValue="leads" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="transactions">Transactions</TabsTrigger>
                        <TabsTrigger value="leads">All Leads</TabsTrigger>
                    </TabsList>

                    <TabsContent value="transactions" className="space-y-4">
                        <Card>
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg font-medium">Payment Verification</CardTitle>
                                    <div className="flex items-center gap-2">
                                        {['DECLARED', 'VERIFIED', 'REJECTED'].map((status) => (
                                            <Button
                                                key={status}
                                                variant={filterStatus === status ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => setFilterStatus(status)}
                                                className="capitalize"
                                            >
                                                {status === 'DECLARED' ? 'Pending' : status.toLowerCase()}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {txLoading && transactions.length === 0 ? (
                                    <div className="py-12 flex justify-center">
                                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                    </div>
                                ) : (
                                    <TransactionTable
                                        transactions={transactions}
                                        onAction={handleAction}
                                    />
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="leads" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Leads Database</CardTitle>
                                        <CardDescription>
                                            View, search, and export all generated leads.
                                        </CardDescription>
                                    </div>
                                    <Button variant="outline" size="sm" onClick={handleDownloadLeads}>
                                        <Download className="mr-2 h-4 w-4" />
                                        Export CSV
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                                    <div className="relative flex-1 max-w-sm">
                                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            type="search"
                                            placeholder="Search by name, email, or ID..."
                                            className="pl-9"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                        />
                                    </div>
                                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Filter by status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Status</SelectItem>
                                            <SelectItem value="NEW">New</SelectItem>
                                            <SelectItem value="PAYMENT_DECLARED">Payment Declared</SelectItem>
                                            <SelectItem value="VERIFIED">Verified</SelectItem>
                                            <SelectItem value="REJECTED">Rejected</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {leadsLoading ? (
                                    <div className="py-12 flex justify-center">
                                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                    </div>
                                ) : (
                                    <LeadTable leads={leads} />
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>

            <VerifyTransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                transactionId={selectedTxId}
                currentAction={action}
                onSuccess={refetchTx}
            />
        </div>
    );
}
