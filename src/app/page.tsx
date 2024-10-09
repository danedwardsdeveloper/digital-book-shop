import BooksList from '@/components/BooksList';
import { FeedbackMessage } from '@/components/FeedbackMessage';

export default function Home() {
	return (
		<>
			<FeedbackMessage />
			<BooksList />
		</>
	);
}
