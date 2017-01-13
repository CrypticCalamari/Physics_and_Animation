
class Vector {
	constructor (x, y) {
		this.x = x;
		this.y = y;
	}
	add (v) {
		this.x += v.x;
		this.y += v.y;
	}
	sub (v) {
		this.x -= v.x;
		this.y -= v.y;
	}
	scale (s) {
		this.x *= s;
		this.y *= s;
	}
	mag () {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}
	dot (v) {
		return (this.x * v.x + this.y * v.y);
	}
}
class Body {
	constructor (radius, mass, position, velocity) {
		this.r = radius;
		this.m = mass;
		this.p = position;
		this.v = velocity;
	}
}
class GameObject {
	constructor () {}
}
class Entity {
	constructor () {}
}
class Component {
	constructor () {}
}
class Action {
	constructor () {}
}
class GravitySystem {
	constructor () {
		
	}
}
class RenderSystem {
	constructor () {
		
	}
}
class Game {
	constructor () {
		this.elapsed = 0;
		this.prev_time = 0;

		// TODO: Setup Here
	}
	update (dt) {}
	draw (dt) {}
	loop (time) {
		this.elapsed += time;
		let dt = time - this.prev_time;
		this.prev_time = time;

		this.update(dt);
		this.draw(dt);
		window.requestAnimationFrame((time) => {
			this.loop(time);
		});
	}
}

var game = new Game();

window.requestAnimationFrame((time) => {
	game.prev_time = time;
	game.loop(time);
});

















