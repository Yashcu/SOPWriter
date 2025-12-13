import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "@/lib/auth";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Plus, Pencil, Trash2, Save } from "lucide-react";

interface Service {
    _id: string;
    code: string;
    name: string;
    category: "documents" | "profile" | "visa";
    price: number;
    description?: string;
    active: boolean;
}

interface Setting {
    _id?: string;
    key: string;
    value: string;
    type: string;
    description?: string;
}

export default function AdminSettings() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [services, setServices] = useState<Service[]>([]);
    const [settings, setSettings] = useState<Setting[]>([]);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [editingSetting, setEditingSetting] = useState<Setting | null>(null);
    const [isCreatingService, setIsCreatingService] = useState(false);

    useEffect(() => {
        if (!auth.isAuthenticated()) {
            navigate("/admin/login");
            return;
        }
        fetchData();
    }, [navigate]);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const [servicesRes, settingsRes] = await Promise.all([
                api.get("/admin/services"),
                api.get("/admin/settings"),
            ]);

            if (servicesRes.data.success) setServices(servicesRes.data.data);
            if (settingsRes.data.success) setSettings(settingsRes.data.data);
        } catch (error: any) {
            toast.error("Failed to fetch data");
            if (error.response?.status === 401) {
                auth.logout();
                navigate("/admin/login");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateService = () => {
        setIsCreatingService(true);
        setEditingService({
            _id: "",
            code: "",
            name: "",
            category: "documents",
            price: 0,
            description: "",
            active: true,
        });
    };

    const handleSaveService = async () => {
        if (!editingService) return;

        try {
            if (isCreatingService) {
                await api.post("/admin/services", editingService);
                toast.success("Service created successfully");
            } else {
                await api.put(`/admin/services/${editingService._id}`, editingService);
                toast.success("Service updated successfully");
            }
            setEditingService(null);
            setIsCreatingService(false);
            fetchData();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to save service");
        }
    };

    const handleDeleteService = async (id: string) => {
        if (!confirm("Are you sure you want to delete this service?")) return;

        try {
            await api.delete(`/admin/services/${id}`);
            toast.success("Service deleted");
            fetchData();
        } catch (error) {
            toast.error("Failed to delete service");
        }
    };

    const handleUpdateSetting = async (setting: Setting) => {
        try {
            await api.put(`/admin/settings/${setting.key}`, {
                value: setting.value,
                description: setting.description,
            });
            toast.success("Setting updated");
            setEditingSetting(null);
            fetchData();
        } catch (error) {
            toast.error("Failed to update setting");
        }
    };

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">App Settings</h1>
                    <Button onClick={() => navigate("/admin")} variant="outline">
                        Back to Dashboard
                    </Button>
                </div>

                {/* Services Section */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Services Management</CardTitle>
                                <CardDescription>
                                    Manage services, pricing, and descriptions
                                </CardDescription>
                            </div>
                            <Button onClick={handleCreateService}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Service
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {services.map((service) => (
                                <Card key={service._id} className="bg-muted/30">
                                    <CardContent className="pt-6">
                                        {editingService?._id === service._id && !isCreatingService ? (
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <Label>Service Name</Label>
                                                        <Input
                                                            value={editingService.name}
                                                            onChange={(e) =>
                                                                setEditingService({
                                                                    ...editingService,
                                                                    name: e.target.value,
                                                                })
                                                            }
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label>Price (₹)</Label>
                                                        <Input
                                                            type="number"
                                                            value={editingService.price}
                                                            onChange={(e) =>
                                                                setEditingService({
                                                                    ...editingService,
                                                                    price: parseFloat(e.target.value) || 0,
                                                                })
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <Label>Category</Label>
                                                    <Select
                                                        value={editingService.category}
                                                        onValueChange={(value: any) =>
                                                            setEditingService({
                                                                ...editingService,
                                                                category: value,
                                                            })
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="documents">Documents</SelectItem>
                                                            <SelectItem value="profile">Profile</SelectItem>
                                                            <SelectItem value="visa">Visa</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div>
                                                    <Label>Description</Label>
                                                    <Textarea
                                                        value={editingService.description}
                                                        onChange={(e) =>
                                                            setEditingService({
                                                                ...editingService,
                                                                description: e.target.value,
                                                            })
                                                        }
                                                        rows={3}
                                                    />
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button onClick={handleSaveService}>
                                                        <Save className="mr-2 h-4 w-4" />
                                                        Save
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => setEditingService(null)}
                                                    >
                                                        Cancel
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1 space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-semibold text-lg">{service.name}</h3>
                                                        <span className="text-sm px-2 py-1 bg-primary/10 text-primary rounded">
                                                            {service.category}
                                                        </span>
                                                    </div>
                                                    <p className="text-2xl font-bold text-primary">
                                                        ₹{service.price.toLocaleString("en-IN")}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {service.description}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => setEditingService(service)}
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => handleDeleteService(service._id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}

                            {isCreatingService && editingService && (
                                <Card className="bg-primary/5 border-primary">
                                    <CardContent className="pt-6">
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <Label>Code</Label>
                                                    <Input
                                                        value={editingService.code}
                                                        onChange={(e) =>
                                                            setEditingService({
                                                                ...editingService,
                                                                code: e.target.value.toUpperCase(),
                                                            })
                                                        }
                                                        placeholder="e.g., SOP"
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Service Name</Label>
                                                    <Input
                                                        value={editingService.name}
                                                        onChange={(e) =>
                                                            setEditingService({
                                                                ...editingService,
                                                                name: e.target.value,
                                                            })
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <Label>Category</Label>
                                                    <Select
                                                        value={editingService.category}
                                                        onValueChange={(value: any) =>
                                                            setEditingService({
                                                                ...editingService,
                                                                category: value,
                                                            })
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="documents">Documents</SelectItem>
                                                            <SelectItem value="profile">Profile</SelectItem>
                                                            <SelectItem value="visa">Visa</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div>
                                                    <Label>Price (₹)</Label>
                                                    <Input
                                                        type="number"
                                                        value={editingService.price}
                                                        onChange={(e) =>
                                                            setEditingService({
                                                                ...editingService,
                                                                price: parseFloat(e.target.value) || 0,
                                                            })
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <Label>Description</Label>
                                                <Textarea
                                                    value={editingService.description}
                                                    onChange={(e) =>
                                                        setEditingService({
                                                            ...editingService,
                                                            description: e.target.value,
                                                        })
                                                    }
                                                    rows={3}
                                                />
                                            </div>
                                            <div className="flex gap-2">
                                                <Button onClick={handleSaveService}>
                                                    <Save className="mr-2 h-4 w-4" />
                                                    Create Service
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    onClick={() => {
                                                        setEditingService(null);
                                                        setIsCreatingService(false);
                                                    }}
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Settings Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Configuration Settings</CardTitle>
                        <CardDescription>
                            Manage contact information and payment details
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {settings.map((setting) => (
                                <Card key={setting.key} className="bg-muted/30">
                                    <CardContent className="pt-6">
                                        {editingSetting?.key === setting.key ? (
                                            <div className="space-y-4">
                                                <div>
                                                    <Label>{setting.key}</Label>
                                                    <Input
                                                        value={editingSetting.value}
                                                        onChange={(e) =>
                                                            setEditingSetting({
                                                                ...editingSetting,
                                                                value: e.target.value,
                                                            })
                                                        }
                                                    />
                                                </div>
                                                {setting.description && (
                                                    <p className="text-xs text-muted-foreground">
                                                        {setting.description}
                                                    </p>
                                                )}
                                                <div className="flex gap-2">
                                                    <Button
                                                        onClick={() => handleUpdateSetting(editingSetting)}
                                                    >
                                                        <Save className="mr-2 h-4 w-4" />
                                                        Save
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => setEditingSetting(null)}
                                                    >
                                                        Cancel
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h3 className="font-semibold">{setting.key}</h3>
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        {setting.value}
                                                    </p>
                                                    {setting.description && (
                                                        <p className="text-xs text-muted-foreground mt-2">
                                                            {setting.description}
                                                        </p>
                                                    )}
                                                </div>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => setEditingSetting(setting)}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
