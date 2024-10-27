'use client';
import {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from 'react';
import { type AppState } from '@/types';

interface AuthContextType extends Omit<AppState, 'cart'> {
	signedIn: boolean;
	isLoading: boolean;
	updateAppState: (newApiResponse: Partial<AppState>) => void;
	signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export async function validateToken() {
	try {
		const response = await fetch('/api/auth/account', {
			method: 'GET',
			credentials: 'include',
		});
		if (!response.ok) {
			return null;
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Unknown error', error);
		return null;
	} finally {
	}
}

export function AuthProvider({ children }: { children: ReactNode }) {
	const [isLoading, setIsLoading] = useState(true);
	const [appState, setAppState] = useState<AppState>({
		message: null,
		status: 'info',
		signedIn: false,
		user: null,
	});

	const updateAppState = (newApiResponse: Partial<AppState>) => {
		setAppState((prevState) => ({
			...prevState,
			...newApiResponse,
		}));
	};

	const signOut = async () => {
		try {
			const response = await fetch('/api/auth/sign-out', {
				method: 'POST',
				credentials: 'include',
			});
			const data = await response.json();
			updateAppState({
				message: data.message,
				status: data.status,
				signedIn: false,
				user: null,
			});
			localStorage.removeItem('cart');
		} catch (error) {
			console.error('Sign-out error:', error);
			updateAppState({
				message: 'An error occurred during sign-out',
				status: 'error',
				signedIn: appState.signedIn,
				user: appState.user,
			});
		}
	};

	useEffect(() => {
		async function initializeAuth() {
			const result = await validateToken();
			if (result && result.user) {
				updateAppState({
					signedIn: true,
					user: result.user,
				});
			} else {
				updateAppState({
					signedIn: false,
					user: null,
				});
			}
			setIsLoading(false);
		}

		initializeAuth();
	}, []);

	const contextValue: AuthContextType = {
		...appState,
		updateAppState,
		isLoading,
		signOut,
	};

	return (
		<AuthContext.Provider value={contextValue}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
}
