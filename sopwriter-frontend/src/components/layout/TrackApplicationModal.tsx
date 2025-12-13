import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

interface TrackApplicationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function TrackApplicationModal({ isOpen, onClose }: TrackApplicationModalProps) {
    const [leadId, setLeadId] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (leadId.trim()) {
            navigate(`/payment?leadId=${leadId.trim()}`);
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Track Application</DialogTitle>
                    <DialogDescription>
                        Enter your Reference ID (Lead ID) to check status or complete payment.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="flex gap-2">
                        <Input
                            placeholder="e.g. 64f2a..."
                            value={leadId}
                            onChange={(e) => setLeadId(e.target.value)}
                            required
                        />
                    </div>
                    <DialogFooter className="flex flex-col sm:justify-between sm:flex-row gap-4">
                        <p className="text-xs text-muted-foreground self-center">
                            Lost your ID? Check the <strong>confirmation email</strong> we sent you.
                        </p>
                        <Button type="submit">
                            <Search className="mr-2 h-4 w-4" />
                            Track
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
