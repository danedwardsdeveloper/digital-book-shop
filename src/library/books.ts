export interface Book {
	title: string;
	slug: string;
	author: string;
	price: number;
	description: string[];
}

export const books: Book[] = [
	{
		title: 'Dracula',
		slug: 'dracula',
		author: 'Bram Stoker',
		price: 9.99,
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
		price: 8.99,
		description: [
			"Discover the passionate world of Charlotte Brontë's 'Jane Eyre', a groundbreaking novel that continues to inspire and empower readers today. Follow Jane's transformative journey from a neglected orphan to a fiercely independent woman.",
			"Brontë's masterful prose will transport you to the misty moors of England, where love and mystery intertwine at the enigmatic Thornfield Hall. Experience the romance, suspense, and moral courage that have made 'Jane Eyre' a beloved classic for generations.",
			"This limited-time offer brings you a meticulously crafted digital edition, perfect for both first-time readers and those rediscovering this timeless tale. Don't wait - let Jane's unwavering spirit and Mr. Rochester's brooding charm captivate you today!",
		],
	},
	{
		title: 'Madame Bovary',
		slug: 'madame-bovary',
		author: 'Gustave Flaubert',
		price: 7.99,
		description: [
			"Indulge in the scandalous world of Gustave Flaubert's 'Madame Bovary', the novel that shocked 19th-century France and revolutionized modern literature. Delve into the life of Emma Bovary as she pursues passion and luxury, challenging the societal norms of her time.",
			"Flaubert's exquisite attention to detail and psychological insight create a vivid portrait of provincial France that will stay with you long after you've turned the last page. Experience the drama, desire, and devastation that have made 'Madame Bovary' a cornerstone of realistic fiction.",
			"This exclusive digital edition offers a fresh translation that brings Flaubert's prose to life for contemporary readers. Join the ranks of literary enthusiasts who have been moved by Emma's tragic quest for love and meaning. Purchase now and lose yourself in this unforgettable classic!",
		],
	},
];
