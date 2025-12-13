import type { Category } from "@/types/wizard";
import { FileText, UserCircle2, Plane, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useConfig } from "@/contexts/ConfigContext";

interface StepCategoryProps {
    wizard: {
        state: {
            category: Category | null;
            service: string | null;
        };
        setCategory: (category: Category) => void;
        setService: (service: string) => void;
    };
    onNext: () => void;
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
};

export default function StepCategory({ wizard, onNext }: StepCategoryProps) {
    const { config } = useConfig();

    const iconMap: Record<string, any> = {
        documents: { icon: FileText, color: "text-blue-500", bg: "bg-blue-500/10" },
        profile: { icon: UserCircle2, color: "text-purple-500", bg: "bg-purple-500/10" },
        visa: { icon: Plane, color: "text-orange-500", bg: "bg-orange-500/10" },
        default: { icon: Sparkles, color: "text-primary", bg: "bg-primary/10" }
    };

    const categories = config.categories.map(cat => ({
        ...cat,
        ...(iconMap[cat.key] || iconMap.default),
        key: cat.key as Category // Cast to ensure type compatibility with existing wizard state
    }));

    const handleSelect = (category: Category) => {
        if (wizard.state.category !== category) {
            wizard.setService("");
        }
        wizard.setCategory(category);
        onNext();
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2 mb-8">
                <h2 className="text-2xl font-bold">Choose your requirement</h2>
                <p className="text-muted-foreground">
                    Select the category that matches your needs
                </p>
            </div>

            <motion.div
                className="grid gap-4"
                variants={container}
                initial="hidden"
                animate="show"
            >
                {categories.map((c) => {
                    const isSelected = wizard.state.category === c.key;
                    /* Using div for motion, acting as button */
                    return (
                        <motion.div key={c.key} variants={item}>
                            <button
                                onClick={() => handleSelect(c.key)}
                                className={`group relative w-full text-left p-6 border-2 rounded-xl transition-all duration-300 flex items-center gap-6
                                ${isSelected
                                        ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                                        : "border-border hover:border-primary/50 hover:bg-muted/50"
                                    }`}
                            >
                                <div className={`p-4 rounded-xl ${c.bg} ${c.color} transition-transform group-hover:scale-110`}>
                                    <c.icon className="w-8 h-8" />
                                </div>

                                <div className="flex-1">
                                    <div className="font-bold text-lg mb-1">{c.label}</div>
                                    <div className="text-sm text-muted-foreground">{c.description}</div>
                                </div>

                                <div className={`w-4 h-4 rounded-full border-2 transition-colors
                                    ${isSelected
                                        ? "border-primary bg-primary"
                                        : "border-muted-foreground/30 group-hover:border-primary/50"
                                    }`}
                                />
                            </button>
                        </motion.div>
                    );
                })}
            </motion.div>
        </div>
    );
}
