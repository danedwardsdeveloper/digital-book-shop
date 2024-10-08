import { ReactNode } from 'react';

export default function Container({ children }: { children: ReactNode }) {
	return (
		<div className="w-2/3 mx-auto flex flex-col mt-8 space-y-4">
			{children}
		</div>
	);
}
