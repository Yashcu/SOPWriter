import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import DeclarePaymentModal from "@/components/payment/DeclarePaymentModal";
import {
    CheckCircle2,
    Loader2,
    Copy,
    ShieldCheck,
    Wallet,
    Sparkles
} from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { ENDPOINTS } from "@/lib/endpoints";
import { useConfig } from "@/contexts/ConfigContext";

export default function Payment() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const leadId = searchParams.get("leadId");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [leadDetails, setLeadDetails] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { config } = useConfig();

    const upiUrl = config.payment.upiQrImage || "/qr.jpg"; // Fallback to local if not in config
    const upiId = config.payment.upiId;
    const supportEmail = config.contact.supportEmail;

    useEffect(() => {
        if (!leadId) {
            navigate("/");
            return;
        }

        const fetchLead = async () => {
            try {
                const res = await api.get(ENDPOINTS.LEADS + "/" + leadId);
                if (res.data.success) {
                    setLeadDetails(res.data.data);
                }
            } catch (err) {
                console.error(err);
                toast.error("Failed to fetch application details");
            } finally {
                setIsLoading(false);
            }
        };

        fetchLead();
    }, [leadId, navigate]);

    if (!leadId) return null;

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    const serviceName = leadDetails?.service;

    // Find price dynamically
    let amountToPay = 0;
    if (serviceName) {
        for (const cat of config.categories) {
            const found = cat.services.find(s => s.name === serviceName);
            if (found) {
                amountToPay = found.price;
                break;
            }
        }
    }

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        toast.success(`${label} copied`);
    };

    return (
        <div className="h-screen bg-background relative flex items-center justify-center p-4 lg:p-8 overflow-hidden font-sans">
            {/* Background Ambient Effects */}
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[128px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[128px] pointer-events-none" />

            {/* Main Glass Card */}
            <div className="relative w-full max-w-6xl bg-card/60 backdrop-blur-2xl border border-white/5 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row">

                {/* Left Panel: Order Details */}
                <div className="flex-1 p-8 lg:p-12 space-y-10 border-b lg:border-b-0 lg:border-r border-white/5 relative">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium tracking-wide uppercase">
                            <ShieldCheck className="w-3 h-3" /> Secure Payment
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
                            Complete your order
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            You're just one step away from finalizing your application.
                        </p>
                    </div>

                    {/* Amount Card */}
                    <div className="relative group overflow-hidden bg-gradient-to-br from-primary/5 via-primary/10 to-transparent border border-primary/20 rounded-2xl p-8 transition-all hover:border-primary/30">
                        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            <Sparkles className="w-16 h-16 text-primary/20 rotate-12" />
                        </div>

                        <div className="relative z-10">
                            <p className="text-sm font-semibold text-primary/80 uppercase tracking-wider mb-2">Total Payable</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight">
                                    ₹{amountToPay?.toLocaleString('en-IN')}
                                </span>
                            </div>

                            <div className="mt-6 pt-6 border-t border-primary/10 flex items-center gap-4">
                                <div className="h-12 w-12 rounded-xl bg-background border border-primary/20 flex items-center justify-center shadow-sm">
                                    <Wallet className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Service Selected</p>
                                    <p className="font-semibold text-lg leading-tight">{serviceName}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Reference ID */}
                    <div className="bg-muted/30 rounded-xl p-4 border border-white/5 mx-auto w-full">
                        <p className="text-xs text-muted-foreground font-medium mb-2 uppercase tracking-wide">Application Reference ID</p>
                        <div className="flex items-center gap-3 bg-background/50 rounded-lg p-3 border border-border/50 group hover:border-primary/30 transition-colors">
                            <code className="flex-1 font-mono text-base font-bold text-foreground px-2">
                                {leadId}
                            </code>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                                onClick={() => copyToClipboard(leadId, "Reference ID")}
                            >
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                </div>

                {/* Right Panel: Payment Action & Instructions */}
                <div className="lg:w-[500px] bg-card/40 backdrop-blur-md p-6 lg:p-8 flex flex-col space-y-8 border-l border-white/5">

                    {/* QR Code Section */}
                    <div className="flex flex-col items-center space-y-5">
                        <div className="bg-white p-3 rounded-2xl shadow-xl shadow-black/10 border border-white/20 max-w-[220px] w-full aspect-square relative group">
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-black/5 rounded-2xl pointer-events-none" />
                            <img
                                src={upiUrl}
                                alt="UPI QR Code"
                                className="w-full h-full object-contain"
                            />
                            {/* Logo in center (optional, mimics PhonePe style in screenshot) */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="h-10 w-10 bg-white rounded-full shadow-md flex items-center justify-center p-1">
                                    <span className="font-bold text-xs text-black">PAY</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-center space-y-3">
                            <p className="text-sm font-medium text-muted-foreground">QR not working? You can pay directly to :</p>
                            <div
                                className="inline-flex items-center gap-3 bg-secondary/50 hover:bg-secondary pl-4 pr-3 py-2.5 rounded-xl cursor-pointer transition-all border border-border/50 group"
                                onClick={() => copyToClipboard(upiId, 'UPI ID')}
                            >
                                <span className="font-mono text-base font-bold text-foreground tracking-tight">{upiId}</span>
                                <span className="text-[10px] uppercase tracking-wider font-bold bg-background/80 text-foreground/70 px-2 py-1 rounded-md shadow-sm group-hover:bg-background group-hover:text-primary transition-colors">Tap to copy</span>
                            </div>
                        </div>
                    </div>

                    {/* Instructions Card */}
                    <div className="bg-gradient-to-b from-muted/50 to-muted/20 border border-border/50 rounded-2xl p-6 space-y-5 shadow-inner">
                        <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                            How to Pay with UPI
                        </h3>
                        <ol className="space-y-5 text-sm">
                            <li className="flex gap-3">
                                <span className="flex-none font-bold text-orange-500">1.</span>
                                <span className="text-muted-foreground"><strong className="text-foreground">Open any UPI app</strong> (PhonePe, Google Pay, Paytm, etc.)</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="flex-none font-bold text-orange-500">2.</span>
                                <span className="text-muted-foreground">Scan the QR code above or use the UPI ID manually</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="flex-none font-bold text-orange-500">3.</span>
                                <span className="text-muted-foreground">Verify the payment details and confirm</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="flex-none font-bold text-orange-500">4.</span>
                                <div className="space-y-1 text-muted-foreground">
                                    <span className="text-orange-500 font-bold tracking-wide mr-1">(MANDATORY)</span> Email the screenshot of the payment transaction and your Reference ID to:
                                    <div
                                        onClick={() => copyToClipboard(supportEmail, "Email")}
                                        className="font-bold text-foreground hover:text-primary cursor-pointer transition-colors block mt-1"
                                    >
                                        {supportEmail}
                                    </div>
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <span className="flex-none font-bold text-orange-500">5.</span>
                                <span className="text-muted-foreground">Click <strong className="text-foreground">"I Have Paid"</strong> below and enter your Transaction ID.</span>
                            </li>
                        </ol>
                    </div>

                    {/* Action Button */}
                    <div className="space-y-4 pt-2">
                        <Button
                            size="lg"
                            className="w-full h-14 text-base font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:scale-[1.01]"
                            onClick={() => setIsModalOpen(true)}
                        >
                            <CheckCircle2 className="mr-2 h-5 w-5" />
                            I Have Paid
                        </Button>
                        <div className="text-center">
                            <p className="text-xs text-muted-foreground">
                                Need help with payment? Contact us at <a href={`mailto:${supportEmail}`} className="underline hover:text-primary transition-colors">{supportEmail}</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <DeclarePaymentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                leadId={leadId}
            />
        </div>
    );
}
