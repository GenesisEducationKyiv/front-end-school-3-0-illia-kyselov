"use client";
import React from "react";

interface Props {
    onCancel: () => void;
    cancelTestId?: string;
    submitTestId?: string;
    disabled: boolean;
    isLoading: boolean;
    loadingLabel?: string;
    idleLabel?: string;
}

export default function ModalActions({
    onCancel,
    cancelTestId = "cancel-button",
    submitTestId = "submit-button",
    disabled,
    isLoading,
    loadingLabel = "Saving…",
    idleLabel = "Save",
}: Props) {
    return (
        <div className="flex justify-end gap-4 pt-4">
            <button
                type="button"
                onClick={onCancel}
                data-testid={cancelTestId}
                className="px-5 py-2 border border-[var(--neon)] rounded text-sm text-[#bfb8e5] cursor-pointer hover:bg-[var(--neon)] transition disabled:cursor-not-allowed disabled:opacity-50"
            >
                Cancel
            </button>
            <button
                type="submit"
                disabled={disabled}
                aria-disabled={disabled}
                data-testid={submitTestId}
                className="px-8 py-2 bg-[var(--neon)] rounded text-sm cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 transition"
            >
                {isLoading ? loadingLabel : idleLabel}
            </button>
        </div>
    );
}
