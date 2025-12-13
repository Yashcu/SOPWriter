interface WizardProgressProps {
    step: number;
    onStepClick: (step: number) => void;
}

export default function WizardProgress({ step, onStepClick }: WizardProgressProps) {
    const steps = ["Category", "Service", "Details"];

    return (
        <div className="mb-12">
            <div className="flex items-center justify-between">
                {steps.map((label, i) => {
                    const isClickable = i <= step;

                    return (
                        <div key={label} className="flex items-start flex-1 last:flex-none">
                            {/* Step Circle and Label */}
                            {/* Step Circle and Label */}
                            <div
                                className={`flex flex-col items-center relative z-10 ${isClickable ? 'cursor-pointer' : ''}`}
                                onClick={() => {
                                    if (isClickable) {
                                        onStepClick(i);
                                    }
                                }}
                            >
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${i <= step
                                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105"
                                        : "bg-muted text-muted-foreground"
                                        } ${isClickable ? 'hover:scale-110 hover:shadow-xl hover:shadow-primary/30' : ''}`}
                                >
                                    {i + 1}
                                </div>
                                <span
                                    className={`mt-2 text-sm font-medium whitespace-nowrap transition-colors ${i <= step ? "text-foreground" : "text-muted-foreground"
                                        }`}
                                >
                                    {label}
                                </span>
                            </div>

                            {/* Connecting Line */}
                            {i < steps.length - 1 && (
                                <div className="flex-1 h-0.5 mx-4 mt-5 bg-muted/30 relative rounded-full overflow-hidden">
                                    <div
                                        className="absolute left-0 top-0 h-full bg-primary transition-all duration-700 ease-out"
                                        style={{ width: i < step ? "100%" : "0%" }}
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
