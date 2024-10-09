'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

import { type ApiResponse } from '@/types';

interface ApiContextType extends ApiResponse {
	updateApiResponse: (newApiResponse: Partial<ApiResponse>) => void;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export function Providers({ children }: { children: ReactNode }) {
	const [apiResponse, setApiResponse] = useState<ApiResponse>({
		message: null,
		status: 'info',
		loggedIn: false,
		user: null,
	});

	const updateApiResponse = (newApiResponse: Partial<ApiResponse>) => {
		setApiResponse((prevState) => ({ ...prevState, ...newApiResponse }));
	};

	return (
		<ApiContext.Provider value={{ ...apiResponse, updateApiResponse }}>
			{children}
		</ApiContext.Provider>
	);
}

export function useApiContext() {
	const context = useContext(ApiContext);
	if (context === undefined) {
		throw new Error(
			'useApiContext must be used within a Providers component'
		);
	}
	return context;
}
