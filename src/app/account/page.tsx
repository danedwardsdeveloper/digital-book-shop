'use client';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';

import { useAuth } from '@/providers/AuthProvider';
import { ApiResponse, type UserType } from '@/types';
import OrderTable from '@/components/OrderTable';
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
	const { user, updateApiResponse, isLoading, signOut } = useAuth();

	if (isLoading) {
		return <p>Loading...</p>;
	}

	if (!user) {
		return <p>Not signed in</p>;
	}

	const hasPurchased = user.purchased.length;

	async function handleSignOut() {
		await signOut();
		router.push('/');
	}

	function confirmDelete(event: React.MouseEvent<HTMLButtonElement>) {
		event.preventDefault();
		event.stopPropagation();

		const isConfirmed = window.confirm(
			'Are you sure you want to delete your account?\nAccess to previously purchased books will be lost.'
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

			const data: ApiResponse = await response.json();

			if (response.ok) {
				localStorage.removeItem('cart');

				updateApiResponse({
					message: data.message,
					status: data.status,
					signedIn: false,
					user: null,
				});

				router.push('/');
			} else {
				throw new Error(
					data.message ||
						'An error occurred while attempting to delete your account'
				);
			}
		} catch (error) {
			updateApiResponse({
				message:
					error instanceof Error
						? error.message
						: 'An error occurred while attempting to delete your account',
				status: 'error',
				signedIn: true,
			});
		}
	}

	return (
		<>
			<div className="space-y-4 mt-8 mb-12 w-2/3 mx-auto">
				<h2 className="text-xl font-semibold">Account details</h2>
				<AccountDetails user={user} />
			</div>
			{hasPurchased ? (
				<OrderTable type={'purchaseHistory'} />
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
				/>
				<div className="my-4">
					<FeedbackMessage />
				</div>
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
				/>
			</div>
		</>
	);
}
