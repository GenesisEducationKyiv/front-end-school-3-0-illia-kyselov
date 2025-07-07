import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import ConfirmDialog from "@/components/ConfirmDialog";

afterEach(() => cleanup());

describe("ConfirmDialog (integration)", () => {
    it("does not render when open is false", () => {
        const onConfirm = vi.fn();
        const onCancel = vi.fn();
        const { container } = render(
            <ConfirmDialog
                open={false}
                count={1}
                onConfirm={onConfirm}
                onCancel={onCancel}
            />
        );
        expect(container.firstChild).toBeNull();
    });

    it("renders single-track message and calls onConfirm/onCancel", () => {
        const onConfirm = vi.fn();
        const onCancel = vi.fn();
        render(
            <ConfirmDialog
                open={true}
                count={1}
                onConfirm={onConfirm}
                onCancel={onCancel}
            />
        );
        screen.getByText("Are you sure you want to delete this track?");
        fireEvent.click(screen.getByTestId("confirm-delete"));
        expect(onConfirm).toHaveBeenCalledTimes(1);
        fireEvent.click(screen.getByTestId("cancel-delete"));
        expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it("renders plural-tracks message when count > 1", () => {
        const onConfirm = vi.fn();
        const onCancel = vi.fn();
        render(
            <ConfirmDialog
                open={true}
                count={3}
                onConfirm={onConfirm}
                onCancel={onCancel}
            />
        );
        screen.getByText("Are you sure you want to delete these 3 tracks?");
    });
});
