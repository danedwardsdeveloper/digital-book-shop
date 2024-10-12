'use client';
import clsx from 'clsx';

import { type UserType } from '@/types';
import OrderTable from '@/components/OrderTable';
import { useApiContext } from '@/components/Providers';
import { Button } from '@/components/NewButtons';
import Container from '@/components/Container';

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

function confirmDelete(event: React.MouseEvent<HTMLButtonElement>) {
	event.preventDefault();
	event.stopPropagation();

	if (
		window.confirm(
			'Are you sure you want to delete your account?\nAccess to previously purchased books will be lost.'
		)
	) {
		console.log('Account deletion confirmed');
		alert('Your account has been deleted.');
	} else {
		console.log('Account deletion cancelled');
	}
}

export default function Account() {
	const { user } = useApiContext();

	if (!user) {
		return <p>Not signed in</p>;
	}

	const hasPurchased = user.purchased.length;

	// ToDo
	// function handleSignOut() {}

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
					// onClick={handleSignOut}
				/>
			</div>
			<div
				className={clsx(
					'w-2/3 mx-auto',
					'mt-24   py-4 px-4',
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
