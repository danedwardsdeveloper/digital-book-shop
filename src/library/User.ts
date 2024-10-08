import mongoose, { Schema, Document } from 'mongoose';
import { mongoURI } from '@/app/api/serverEnvironment';

interface IUser extends Document {
	name: string;
	email: string;
	cart: { slug: string }[];
	purchased: { slug: string; downloads: number }[];
}

const UserSchema: Schema = new Schema({
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	cart: [{ slug: { type: String, required: true } }],
	purchased: [
		{
			slug: { type: String, required: true },
			downloads: { type: Number, default: 5 },
		},
	],
});

export const User =
	mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

import { connect } from 'mongoose';

export async function connectToDatabase() {
	if (mongoose.connection.readyState >= 1) {
		return;
	}

	return connect(mongoURI);
}
