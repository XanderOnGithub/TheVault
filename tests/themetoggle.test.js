import { render, fireEvent } from '@testing-library/svelte';
import ThemeToggle from '../src/components/themeToggle.svelte';

describe('ThemeToggle Component', () => {
    test('it should toggle theme on click', async () => {
        const { getByTestId } = render(ThemeToggle);

        const button = getByTestId('theme-toggle-button');
        expect(button).toBeInTheDocument();

        // Initial theme should be light
        expect(document.body.classList.contains('dark')).toBe(false);

        // Click to toggle theme to dark
        await fireEvent.click(button);
        expect(document.body.classList.contains('dark')).toBe(true);

        // Click to toggle theme back to light
        await fireEvent.click(button);
        expect(document.body.classList.contains('dark')).toBe(false);
    });
});