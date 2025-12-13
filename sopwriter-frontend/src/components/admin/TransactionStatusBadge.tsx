import { Badge } from "@/components/ui/badge";

export default function TransactionStatusBadge({ status }: { status: string }) {
    switch (status) {
        case 'VERIFIED':
            return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">Verified</Badge>;
        case 'REJECTED':
            return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200">Rejected</Badge>;
        case 'DECLARED':
        default:
            return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-yellow-200">Pending</Badge>;
    }
}
