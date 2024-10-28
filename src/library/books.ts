import { type StaticBook } from '@/types';

import draculaImage from '@/images/dracula.webp';
import madameBovaryImage from '@/images/madame-bovary.webp';
import janeEyreImage from '@/images/jane-eyre.webp';
import wutheringHeightsImage from '@/images/wuthering-heights.webp';
import countMonteCristo from '@/images/count-of-monte-cristo.webp';

export function getBookTitle(slug: string): string {
	const book = books.find((book) => book.slug === slug);
	return book?.title ?? slug;
}

export const books: StaticBook[] = [
	{
		title: 'Dracula',
		slug: 'dracula',
		author: 'Bram Stoker',
		price: 1.99,
		image: draculaImage,
		description: [
			"Step into the shadows of Victorian-era Transylvania with Bram Stoker's timeless masterpiece, 'Dracula'. This chilling tale of horror and suspense has captivated readers for over a century, and now it's your turn to experience the thrill.",
			"Immerse yourself in a world of ancient castles, forbidden desires, and unspeakable terrors. As you follow Jonathan Harker's journey into the heart of darkness, you'll feel the hair-raising tension that has made 'Dracula' a cornerstone of gothic literature.",
			"Don't miss your chance to own this classic in a beautifully formatted digital edition. With over 1 million copies sold, join the legion of fans who have been enthralled by the most famous vampire story ever told. Buy now and prepare for a sleepless night!",
		],
	},
	{
		title: 'Jane Eyre',
		slug: 'jane-eyre',
		author: 'Charlotte Brontë',
		price: 1.99,
		image: janeEyreImage,
		description: [
			"Discover the passionate world of Charlotte Brontë's 'Jane Eyre', a groundbreaking novel that continues to inspire and empower readers today. Follow Jane's transformative journey from a neglected orphan to a fiercely independent woman.",
			"Brontë's masterful prose will transport you to the misty moors of England, where love and mystery intertwine at the enigmatic Thornfield Hall. Experience the romance, suspense, and moral courage that have made 'Jane Eyre' a beloved classic for generations.",
		],
	},
	{
		title: 'Madame Bovary',
		slug: 'madame-bovary',
		author: 'Gustave Flaubert',
		price: 1.99,
		image: madameBovaryImage,
		description: [
			"Indulge in the scandalous world of Gustave Flaubert's 'Madame Bovary', the novel that shocked 19th-century France and revolutionized modern literature. Delve into the life of Emma Bovary as she pursues passion and luxury, challenging the societal norms of her time.",
			"Flaubert's exquisite attention to detail and psychological insight create a vivid portrait of provincial France that will stay with you long after you've turned the last page. Experience the drama, desire, and devastation that have made 'Madame Bovary' a cornerstone of realistic fiction.",
		],
	},
	{
		title: 'Wuthering Heights',
		slug: 'wuthering-heights',
		author: 'Emily Brontë',
		price: 1.99,
		image: wutheringHeightsImage,
		description: [
			"Embark on a tempestuous journey across the wild Yorkshire moors with Emily Brontë's only novel, 'Wuthering Heights'. This haunting tale of passionate love and bitter revenge has shocked and fascinated readers for generations.",
			"Experience the tumultuous relationship between the mysterious Heathcliff and the headstrong Catherine Earnshaw, a love so powerful it transcends social class, family ties, and even death itself. Brontë's masterful storytelling weaves a complex narrative that explores the darkest corners of human nature.",
			'Immerse yourself in the atmospheric world of Wuthering Heights, where the bleak beauty of the moors mirrors the stormy emotions of its characters. This timeless classic continues to captivate readers with its intense exploration of love, hatred, and the destructive power of obsession.',
		],
	},
	{
		title: 'The Count of Monte Cristo',
		slug: 'count-of-monte-cristo',
		author: 'Alexandre Dumas',
		price: 1.99,
		image: countMonteCristo,
		description: [
			"Dive into Alexandre Dumas' epic tale of betrayal, revenge, and redemption in 'The Count of Monte Cristo'. Follow Edmond Dantès' extraordinary transformation from an innocent young sailor to the enigmatic Count, as he orchestrates an elaborate plan of vengeance against those who destroyed his life.",
			'Set against the turbulent backdrop of 19th-century France, this masterpiece weaves together intricate plots, hidden identities, and complex moral questions. Experience the dark glamour of Parisian society and the mysterious underworld of the Mediterranean as Dantès executes his calculated revenge.',
			"This timeless classic explores the price of justice, the power of hope, and the possibility of redemption through Dumas' masterful storytelling. Join the millions who have been captivated by this thrilling adventure that proves revenge is indeed a dish best served cold.",
		],
	},
];
