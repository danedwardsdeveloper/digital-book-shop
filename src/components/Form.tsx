import Link from 'next/link';
import clsx from 'clsx';
import { ApiStatus } from '@/types';

interface FormProps {
	onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
	children: React.ReactNode;
}

export function Form({ onSubmit, children }: FormProps) {
	return (
		<form onSubmit={onSubmit} className="space-y-4 mt-8 w-2/3 mx-auto">
			{children}
		</form>
	);
}

interface InputProps {
	label: string;
	id: string;
	name: string;
	type: string;
	value: string;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	placeholder?: string;
}

export function Input({
	label,
	id,
	name,
	type,
	placeholder,
	value,
	onChange,
}: InputProps) {
	return (
		<div className="flex items-center justify-between">
			<label htmlFor={id} className="w-1/3">
				{label}
			</label>
			<input
				type={type}
				id={id}
				name={name}
				required
				value={value}
				onChange={onChange}
				placeholder={placeholder}
				className="w-2/3 border border-gray-400 bg-gray-100 p-2 rounded-md"
			/>
		</div>
	);
}

interface FormLinkProps {
	target: '/sign-in' | 'create-account';
	text: 'Sign in instead' | 'Create account instead';
}

export function FormLink({ target, text }: FormLinkProps) {
	return (
		<p className="text-center text-sm text-gray-600 mt-4">
			<Link href={target} className="cursor-pointer hover:underline">
				{text}
			</Link>
		</p>
	);
}

export function FormSpacer() {
	return <div className="h-[42px]" />;
}
