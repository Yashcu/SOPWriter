import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface VerifyTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    transactionId: string | null;
    currentAction: 'VERIFY' | 'REJECT' | null;
    onSuccess: () => void;
}

export default function VerifyTransactionModal({
    isOpen,
    onClose,
    transactionId,
    currentAction,
    onSuccess
}: VerifyTransactionModalProps) {
    const [note, setNote] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        if (!transactionId || !currentAction) return;

        // Validation: Reject requires a note
        if (currentAction === 'REJECT' && !note.trim()) {
            toast.error("Please provide a reason for rejection");
            return;
        }

        setIsLoading(true);
        try {
            const res = await api.post(`/admin/transactions/${transactionId}/verify`, {
                action: currentAction,
                note
            });
            if (res.data.success) {
                toast.success(`Transaction ${currentAction === 'VERIFY' ? 'Verified' : 'Rejected'}`);
                onSuccess();
                onClose();
                setNote("");
            }
        } catch (error) {
            console.error(error);
            toast.error("Action failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {currentAction === 'VERIFY' ? 'Verify Payment' : 'Reject Payment'}
                    </DialogTitle>
                    <DialogDescription>
                        {currentAction === 'VERIFY'
                            ? "Confirm that you have received this payment. The user will be notified."
                            : "Rejecting this payment will notify the user. Please provide a reason."}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="note">
                            {currentAction === 'VERIFY' ? 'Note (Optional)' : 'Reason for Rejection *'}
                        </Label>
                        <Textarea
                            id="note"
                            placeholder={currentAction === 'VERIFY' ? "e.g. Received in HDFC..." : "e.g. Transaction ID not found..."}
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        variant={currentAction === 'REJECT' ? "destructive" : "default"}
                    >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Confirm {currentAction === 'VERIFY' ? 'Verify' : 'Reject'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
