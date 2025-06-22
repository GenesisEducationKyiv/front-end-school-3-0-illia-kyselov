import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import BulkActionsBar from "@/components/BulkActionsBar";

afterEach(() => cleanup());

describe("BulkActionsBar (integration)", () => {
    it("renders nothing when total is 0", () => {
        const onToggle = vi.fn();
        const onDelete = vi.fn();
        const { container } = render(
            <BulkActionsBar
                total={0}
                selectedCount={0}
                onToggleAll={onToggle}
                onDeleteSelected={onDelete}
            />
        );
        expect(container.childElementCount).toBe(0);
    });

    it('renders "Select All" and calls onToggleAll', () => {
        const onToggle = vi.fn();
        const onDelete = vi.fn();
        render(
            <BulkActionsBar
                total={3}
                selectedCount={0}
                onToggleAll={onToggle}
                onDeleteSelected={onDelete}
            />
        );
        const btn = screen.getByTestId("select-all");
        expect(btn.textContent).toBe("Select All");
        fireEvent.click(btn);
        expect(onToggle).toHaveBeenCalledTimes(1);
    });

    it('when some selected, still shows "Select All" + Delete Selected and calls onDeleteSelected', () => {
        const onToggle = vi.fn();
        const onDelete = vi.fn();
        render(
            <BulkActionsBar
                total={5}
                selectedCount={2}
                onToggleAll={onToggle}
                onDeleteSelected={onDelete}
            />
        );
        const selectBtn = screen.getByTestId("select-all");
        expect(selectBtn.textContent).toBe("Select All");
        const deleteBtn = screen.getByTestId("bulk-delete-button");
        expect(deleteBtn.textContent).toContain("Delete Selected 2");
        fireEvent.click(deleteBtn);
        expect(onDelete).toHaveBeenCalledTimes(1);
    });
});
