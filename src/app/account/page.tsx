'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import clsx from 'clsx';

import { useAuth, validateToken } from '@/providers/AuthProvider';
import { AppState, type UserType } from '@/types';
import PurchaseHistory from '@/components/PurchaseHistory';
import { Button } from '@/components/Buttons';
import Container from '@/components/Container';
import { FeedbackMessage } from '@/components/FeedbackMessage';

interface GridListItemProps {
	label: string;
	value: string;
}

function GridListItem({ label, value }: GridListItemProps) {
	return (
		<li className="flex">
			<h2 className="w-1/3">{label}</h2>
			<p className="w-1/3 text-gray-700">{value}</p>
		</li>
	);
}

interface AccountDetailsProps {
	user: UserType;
}

function AccountDetails({ user }: AccountDetailsProps) {
	return (
		<ul className="space-y-4 pb-8">
			<GridListItem label="Name" value={user.name} />
			<GridListItem label="Email" value={user.email} />
		</ul>
	);
}

export default function Account() {
	const router = useRouter();
	const { user, updateAppState, isLoading } = useAuth();

	useEffect(() => {
		async function refreshUserData() {
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
		}

		refreshUserData();
	}, [router]);

	if (isLoading) {
		return <p>Loading...</p>;
	}

	if (!user) {
		return <p>Not signed in</p>;
	}

	const hasPurchased = user.purchased.length;

	async function handleSignOut() {
		try {
			const response = await fetch('/api/auth/sign-out', {
				method: 'POST',
				credentials: 'include',
			});

			const data: AppState = await response.json();

			localStorage.removeItem('cart');

			updateAppState({
				message: data.message,
				status: data.status,
				signedIn: false,
				user: null,
			});

			if (response.ok) {
				router.replace('/');
			}
		} catch (error) {
			updateAppState({
				status: 'error',
				message:
					error instanceof Error ? error.message : 'Failed to sign out',
				signedIn: false,
				user: null,
			});
		}
	}

	function confirmDelete(event: React.MouseEvent<HTMLButtonElement>) {
		event.preventDefault();
		event.stopPropagation();

		const isConfirmed = window.confirm(
			'Are you sure you want to delete your account?\nAccess to purchased books will be lost.'
		);
		if (isConfirmed) {
			handleDelete();
		}
	}

	async function handleDelete() {
		try {
			const response = await fetch('/api/auth/delete-account', {
				method: 'DELETE',
				credentials: 'include',
			});

			const data: AppState = await response.json();

			updateAppState(data);

			if (response.ok) {
				localStorage.removeItem('cart');
				router.push('/');
			}
		} catch (error) {
			updateAppState({
				status: 'error',
				message:
					error instanceof Error
						? error.message
						: 'An error occurred while attempting to delete your account',
				signedIn: false,
				user: null,
			});
		}
	}

	return (
		<>
			<FeedbackMessage />
			<div className="space-y-4 mt-8 mb-12 w-2/3 mx-auto">
				<h2 className="text-xl font-semibold">Account details</h2>
				<AccountDetails user={user} />
			</div>
			{hasPurchased ? (
				<PurchaseHistory />
			) : (
				<Container>
					<h2 className="text-lg font-semibold">No purchases yet</h2>
				</Container>
			)}
			<div className="mt-8 w-2/3 mx-auto">
				<Button
					text={'Sign out'}
					variant={'secondary'}
					onClick={handleSignOut}
					dataTestID="sign-out-button"
				/>
				<div className="my-4"></div>
			</div>
			<div
				className={clsx(
					'w-2/3 mx-auto',
					'mt-12   py-4 px-4',
					'rounded',
					'border border-red-200',
					'bg-red-100'
				)}
			>
				<h2 className="font-semibold text-base text-red-500 mb-4">
					Danger zone
				</h2>
				<Button
					text={'Delete account'}
					onClick={confirmDelete}
					variant="delete"
					dataTestID="delete-account-button"
				/>
			</div>
		</>
	);
}
