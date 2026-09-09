class Video {
	constructor(title, uploader, time) {
		this.title = title;
		this.uploader = uploader;
		this.time = time;
	}

	watch() {
		return `${this.uploader} watched all ${this.time} of ${this.title}!`;
	}
}

const firstVideo = new Video("JavaScript Basics", "Alice", 120);
console.log(firstVideo.watch());

const secondVideo = new Video("Object-Oriented Programming", "Brian", 300);
console.log(secondVideo.watch());

const videoData = [
	["HTML Fundamentals", "Carla", 180],
	["CSS Layouts", "David", 240],
	["JavaScript Arrays", "Elena", 210],
	["JavaScript Classes", "Farah", 360],
	["Node.js Introduction", "George", 420],
];

const videos = videoData.map(([title, uploader, time]) => {
	return new Video(title, uploader, time);
});

videos.forEach((video) => console.log(video.watch()));
