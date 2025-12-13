import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Copy, Mail } from "lucide-react";
import { toast } from "sonner";
import type { Lead } from "@/hooks/useAdminLeads";

interface LeadTableProps {
    leads: Lead[];
}

export default function LeadTable({ leads }: LeadTableProps) {
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Email copied to clipboard");
    };

    if (leads.length === 0) {
        return <div className="p-8 text-center text-muted-foreground border rounded-lg bg-muted/20">No leads found.</div>;
    }

    return (
        <div className="rounded-md border bg-card overflow-hidden">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="min-w-[100px]">Created</TableHead>
                            <TableHead className="min-w-[180px]">Reference ID</TableHead>
                            <TableHead className="min-w-[150px]">Name</TableHead>
                            <TableHead className="min-w-[200px]">Email</TableHead>
                            <TableHead className="min-w-[130px]">Phone</TableHead>
                            <TableHead className="min-w-[180px]">Service</TableHead>
                            <TableHead className="min-w-[200px]">Notes</TableHead>
                            <TableHead className="text-right min-w-[100px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {leads.map((lead) => (
                            <TableRow key={lead._id}>
                                <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                                    <div className="flex flex-col">
                                        <span className="font-medium text-foreground">
                                            {new Date(lead.createdAt).toLocaleDateString()}
                                        </span>
                                        <span className="text-xs">
                                            {new Date(lead.createdAt).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="font-mono text-xs">{lead._id}</TableCell>
                                <TableCell className="font-medium">{lead.name}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <span className="truncate max-w-[180px]">{lead.email}</span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 flex-shrink-0 text-muted-foreground hover:text-foreground"
                                            onClick={() => copyToClipboard(lead.email)}
                                        >
                                            <Copy className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </TableCell>
                                <TableCell className="text-sm">
                                    {lead.phone || <span className="text-muted-foreground italic">N/A</span>}
                                </TableCell>
                                <TableCell className="max-w-[180px] truncate" title={lead.service}>
                                    {lead.service}
                                </TableCell>
                                <TableCell className="max-w-[200px]">
                                    {lead.notes ? (
                                        <div className="text-sm text-muted-foreground" title={lead.notes}>
                                            <span className="line-clamp-2">{lead.notes}</span>
                                        </div>
                                    ) : (
                                        <span className="text-muted-foreground italic text-xs">No notes</span>
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button size="sm" variant="outline" asChild>
                                        <a href={`mailto:${lead.email}`}>
                                            <Mail className="h-3 w-3 mr-2" />
                                            Email
                                        </a>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
