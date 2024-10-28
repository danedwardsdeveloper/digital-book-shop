import { ReactNode } from 'react';
import clsx from 'clsx';

export function Container({ children }: { children: ReactNode }) {
	return (
		<div
			className={clsx(
				'container',
				'w-full',
				'md:w-2/3 mx-auto flex flex-col space-y-4'
			)}
		>
			{children}
		</div>
	);
}

export function Spacer() {
	return <div className="h-8" />;
}
