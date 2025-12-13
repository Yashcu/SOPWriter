import { useState } from "react";
import type { WizardState, Category } from "@/types/wizard";

const initialState: WizardState = {
    category: null,
    service: null,
    details: { name: "", email: "", phone: "", notes: "" },
};

export function useWizard() {
    const [state, setState] = useState<WizardState>(initialState);

    return {
        state,
        setCategory: (category: Category) =>
            setState((s) => ({ ...s, category })),
        setService: (service: string) => setState((s) => ({ ...s, service })),
        setDetails: (details: WizardState["details"]) =>
            setState((s) => ({ ...s, details })),
        reset: () => setState(initialState),
    };
}
