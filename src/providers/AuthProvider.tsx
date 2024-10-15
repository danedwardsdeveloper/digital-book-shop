'use client';
import {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from 'react';
import { type ApiResponse, type UserType } from '@/types';

interface AuthContextType extends Omit<ApiResponse, 'cart'> {
	signedIn: boolean;
	isLoading: boolean;
	updateApiResponse: (newApiResponse: Partial<ApiResponse>) => void;
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
		return null;
	} finally {
	}
}

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<UserType | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [apiResponse, setApiResponse] = useState<ApiResponse>({
		message: null,
		status: 'info',
		signedIn: false,
		user: null,
	});

	const updateApiResponse = (newApiResponse: Partial<ApiResponse>) => {
		setApiResponse((prevState) => {
			const updatedState = { ...prevState, ...newApiResponse };
			setUser(updatedState.user);
			return updatedState;
		});
	};

	const signOut = async () => {
		try {
			const response = await fetch('/api/auth/sign-out', {
				method: 'POST',
				credentials: 'include',
			});
			const data = await response.json();
			updateApiResponse({
				message: data.message,
				status: data.status,
				signedIn: false,
				user: null,
			});
			localStorage.removeItem('cart');
		} catch (error) {
			console.error('Sign-out error:', error);
			updateApiResponse({
				message: 'An error occurred during sign-out',
				status: 'error',
				signedIn: apiResponse.signedIn,
				user: apiResponse.user,
			});
		}
	};

	useEffect(() => {
		async function initializeAuth() {
			const result = await validateToken();
			if (result && result.user) {
				updateApiResponse({
					signedIn: true,
					user: result.user,
				});
			} else {
				updateApiResponse({
					signedIn: false,
					user: null,
				});
			}
			setIsLoading(false);
		}

		initializeAuth();
	}, []);

	const contextValue: AuthContextType = {
		...apiResponse,
		updateApiResponse,
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
