import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';

// Mock navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('Login Component', () => {
    it('should render login form', () => {
        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        // Check if email input exists
        const emailInput = screen.queryByPlaceholderText(/email/i) ||
            screen.queryByLabelText(/email/i) ||
            screen.queryByRole('textbox', { name: /email/i });

        expect(emailInput || document.querySelector('input[type="email"]')).toBeTruthy();
    });

    it('should have a submit button', () => {
        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        const submitButton = screen.queryByRole('button', { name: /login|sign in/i }) ||
            screen.queryByText(/login|sign in/i);

        expect(submitButton).toBeTruthy();
    });
});
