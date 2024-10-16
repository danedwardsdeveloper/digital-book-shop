'use client';
import { useAuth } from '@/providers/AuthProvider';
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
	const { message, status } = useAuth();

	return (
		<p
			data-testid="feedback-message"
			className={clsx('text-center h-6', getStatusColorClass(status))}
		>
			{message}
		</p>
	);
}
