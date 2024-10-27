'use client';
import clsx from 'clsx';

import { useAuth } from '@/providers/AuthProvider';
import { type AppMessageStatus } from '@/types';
import { CloseIcon } from './Icons';

interface StatusStyles {
	text: string;
	background: string;
	border: string;
}

const styleMap: Record<AppMessageStatus, StatusStyles> = {
	error: {
		text: 'text-red-700',
		background: 'bg-red-100',
		border: 'border-red-200',
	},
	info: {
		text: 'text-gray-700',
		background: 'bg-gray-100',
		border: 'border-gray-200',
	},
	success: {
		text: 'text-green-700',
		background: 'bg-green-100',
		border: 'border-green-200',
	},
	warning: {
		text: 'text-yellow-700',
		background: 'bg-yellow-100',
		border: 'border-yellow-200',
	},
};

function getStatusStyles(status: AppMessageStatus): StatusStyles {
	return styleMap[status];
}

export function FeedbackMessage() {
	const { message, status, updateAppState } = useAuth();
	const styles = getStatusStyles(status);

	if (!message) return <div className="h-[66px]"></div>;

	const handleDismiss = () => {
		updateAppState({
			message: null,
			status: 'info',
			signedIn: true,
			user: null,
		});
	};

	return (
		<div className="flex justify-center mb-4">
			<div
				className={clsx(
					'inline-flex items-center gap-2 rounded-lg px-4 py-2 border',
					styles.background,
					styles.border
				)}
			>
				<p data-testid="feedback-message" className={clsx(styles.text)}>
					{message}
				</p>
				<button
					onClick={handleDismiss}
					className="p-1 rounded-full hover:bg-black/5 transition-colors"
					aria-label="Dismiss message"
				>
					<CloseIcon colour={styles.text} />
				</button>
			</div>
		</div>
	);
}
