import { useState } from 'react';

/**
 * This custom hook provides a way to handle form submission with loading states for WBB Modals
 *
 * @param submitCallback
 * @param options
 */
export function useModalSubmitWithLoading(
    submitCallback: () => void,
    options?: { preDelay?: number; postDelay?: number }
) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const preDelay = options?.preDelay ?? 100;
    const postDelay = options?.postDelay ?? 1000;

    const handleSubmit = () => {
        setIsSubmitting(true);

        setTimeout(() => {
            submitCallback();

            setTimeout(() => {
                setIsSubmitting(false);
            }, postDelay);

        }, preDelay);
    };

    return { handleSubmit, isSubmitting };
}