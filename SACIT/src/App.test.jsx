import { render } from '@testing-library/react';
import { test, expect } from 'vitest';
import App from './App';
import { AuthProvider } from './config/context/auth-context';

test('App se renderiza sin errores', () => {
  const { container } = render(
    <AuthProvider>
      <App />
    </AuthProvider>
  );
  expect(container).toBeDefined();
});