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
	updateApiResponse: (newApiResponse: Partial<ApiResponse>) => void;
	isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ToDo: add error feedback
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
	const [apiResponse, setApiResponse] = useState<ApiResponse>({
		message: null,
		status: 'info',
		signedIn: false,
		user: null,
	});
	const [isLoading, setIsLoading] = useState(true);

	const updateApiResponse = (newApiResponse: Partial<ApiResponse>) => {
		setApiResponse((prevState) => ({ ...prevState, ...newApiResponse }));
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
