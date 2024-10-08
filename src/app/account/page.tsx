'use client';
import clsx from 'clsx';

import { DeleteButton, SubmitButton } from '@/components/Buttons';
import OrderTable from '@/components/OrderTable';
import { StaticBook } from '@/types';
import { books } from '@/library/books';

interface User {
	name: string;
	email: string;
	purchased: StaticBook[];
}

const tempUser: User = {
	name: 'Pippi Longstocking',
	email: 'pippi@longstockingenterprises.se',
	purchased: books,
};
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
	user: User;
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
	return (
		<>
			<div className="space-y-4 mt-8 mb-12 w-2/3 mx-auto">
				<h2 className="text-xl font-semibold">Account details</h2>
				<AccountDetails user={tempUser} />
			</div>
			<OrderTable type={'purchaseHistory'} books={books} />
			<div className="mt-8 w-2/3 mx-auto">
				<SubmitButton cta={'Sign out'} variant={'secondary'} />
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
				<DeleteButton onClick={confirmDelete} />
			</div>
		</>
	);
}
