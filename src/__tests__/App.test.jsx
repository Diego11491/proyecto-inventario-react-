import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  it('muestra el formulario de inicio de sesión', () => {
    render(<App />);
    expect(screen.getByText(/iniciar sesión/i)).toBeDefined();
  });
});
