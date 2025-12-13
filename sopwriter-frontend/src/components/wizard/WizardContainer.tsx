import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWizard } from "@/hooks/useWizard";
import { useCreateLead } from "@/hooks/useCreateLead";
import WizardProgress from "./WizardProgress";
import StepCategory from "./StepCategory";
import StepService from "./StepService";
import StepDetails from "./StepDetails";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

export default function WizardContainer() {
    const [step, setStep] = useState(0);
    const [direction, setDirection] = useState(0);
    const wizard = useWizard();
    const navigate = useNavigate();
    const { createLead, isLoading } = useCreateLead();

    const next = () => {
        setDirection(1);
        setStep((s) => s + 1);
    };

    const back = () => {
        setDirection(-1);
        setStep((s) => s - 1);
    };

    const handleSubmit = async () => {
        try {
            const payload = {
                service: wizard.state.service || "General Inquiry",
                name: wizard.state.details.name,
                email: wizard.state.details.email,
                phone: wizard.state.details.phone,
                notes: wizard.state.details.notes,
            };
            const leadId = await createLead(payload);
            if (leadId) {
                navigate(`/payment?leadId=${leadId}`);
            }
        } catch (error) {
            console.error("Failed to submit lead:", error);
        }
    };

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 50 : -50,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 50 : -50,
            opacity: 0
        })
    };

    return (
        <div className="max-w-4xl mx-auto">
            <WizardProgress step={step} onStepClick={(s) => {
                setDirection(s > step ? 1 : -1);
                setStep(s);
            }} />

            <div className="relative mt-8">
                <Card className="p-8 lg:p-12 border border-border/50 shadow-xl bg-card/50 backdrop-blur-sm overflow-hidden min-h-[500px]">
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={step}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: "spring", stiffness: 300, damping: 30 },
                                opacity: { duration: 0.2 }
                            }}
                            className="h-full"
                        >
                            {step === 0 && <StepCategory wizard={wizard} onNext={next} />}
                            {step === 1 && (
                                <StepService wizard={wizard} onNext={next} onBack={back} />
                            )}
                            {step === 2 && (
                                <StepDetails
                                    wizard={wizard}
                                    onBack={back}
                                    onSubmit={handleSubmit}
                                    isSubmitting={isLoading}
                                />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </Card>
            </div>
        </div>
    );
}
