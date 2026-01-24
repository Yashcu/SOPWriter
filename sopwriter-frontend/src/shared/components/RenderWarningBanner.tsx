import { useState, useEffect } from "react";
import { AlertCircle, X } from "lucide-react";

export default function RenderWarningBanner() {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Auto-dismiss after 50 seconds
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 50000);

        return () => clearTimeout(timer);
    }, []);

    if (!isVisible) return null;

    return (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200 dark:from-amber-900/20 dark:to-orange-900/20 dark:border-amber-800/30">
            <div className="max-w-7xl mx-auto px-4 py-3">
                <div className="flex items-center justify-center gap-3 relative">
                    <AlertCircle className="h-5 w-5 flex-shrink-0 text-amber-600 dark:text-amber-400" />
                    <p className="text-sm md:text-base font-medium text-center text-amber-900 dark:text-amber-100">
                        Render service is inactive, please wait for 50 seconds
                    </p>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="absolute right-0 p-1 hover:bg-amber-200/50 dark:hover:bg-amber-800/50 rounded-md transition-colors text-amber-700 dark:text-amber-300"
                        aria-label="Dismiss banner"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
