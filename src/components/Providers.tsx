'use client';
import { ReactNode } from 'react';
import { AuthProvider } from '@/providers/AuthProvider';
import { CartProvider } from '@/providers/CartProvider';

export function Providers({ children }: { children: ReactNode }) {
	return (
		<AuthProvider>
			<CartProvider>{children}</CartProvider>
		</AuthProvider>
	);
}
