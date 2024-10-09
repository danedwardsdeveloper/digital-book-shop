'use client';
import { useApiContext } from '@/components/Providers';
import { type ApiStatus } from '@/types';
import clsx from 'clsx';

const statusColorMap: Record<ApiStatus, string> = {
	error: 'text-red-600',
	info: 'text-blue-600',
	success: 'text-green-600',
	warning: 'text-yellow-700',
};

function getStatusColorClass(status: ApiStatus): string {
	return statusColorMap[status];
}

export function FeedbackMessage() {
	const { message, status } = useApiContext();

	return (
		<p className={clsx('text-center h-6', getStatusColorClass(status))}>
			{message}
		</p>
	);
}
