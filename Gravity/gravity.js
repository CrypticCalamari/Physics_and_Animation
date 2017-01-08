
/*
F = ma
P = mv

F_1_2 = G*(M_1 * M_2) / d^2

update position using velocity
update velocity using acceleration
calculate total force exerted on object
update acceleration
*/

class Point {
	constructor (x=0, y=0) {
		this.x = x;
		this.y = y;
	}
	toString() {
		return JSON.stringify(this);
	}
}

class Gravy {
	constructor (r, m, p, v, a, immovable) {
		this.r = r;
		this.m = m;
		this.p = p;
		this.v = v;
		this.a = a;
		this.immovable = immovable;
	}
	update (G, gs, dt, game) {
		if (this.immovable) {return;}
		if ((this.p.x - this.r) <= 0) {
			this.p.x = this.r;
			this.v.x = -this.v.x;
			this.a.x = -this.a.x;
		}
		if (this.p.x + this.r >= game.width) {
			this.p.x = game.width - this.r;
			this.v.x = -this.v.x;
			this.a.x = -this.a.x;
		}
		if (this.p.y - this.r <= 0) {
			this.p.y = this.r;
			this.v.y = -this.v.y;
			this.a.y = -this.a.y;
		}
		if (this.p.y + this.r >= game.height) {
			this.p.y = game.height - this.r;
			this.v.y = -this.v.y;
			this.a.y = -this.a.y;
		}

		this.p.x += this.v.x * dt / 100;
		this.p.y += this.v.y * dt / 100;

		this.v.x += this.a.x * dt / 100;
		this.v.y += this.a.y * dt / 100;

		this.a.x = 0;
		this.a.y = 0;
		for (let g of gs) {
			if (g === this) {continue;}

			let r = new Point();
			r.x = g.p.x - this.p.x;
			r.y = g.p.y - this.p.y;
			r.d = Math.sqrt(r.x * r.x + r.y * r.y);
			
			let F = g.m / (r.d * r.d);
			
			this.a.x += F * r.x / r.d;
			this.a.y += F * r.y / r.d;
		}
		this.a.x *= G;
		this.a.y *= G;
	}
	draw (ctx) {
		ctx.beginPath();
		ctx.arc(this.p.x, this.p.y, this.r, 0, 2*Math.PI, false);
		ctx.fill();
		ctx.closePath();
	}
}
class Game {
	constructor (can_id, number_of_gravies, G) {
		this.last_update = -1;
		this.gravies = [];
		this.G = G;
		this.canvas = document.getElementById(can_id);
		this.ctx = this.canvas.getContext("2d");
		this.ctx.fillStyle = "rgb(0,0,0)";
		this.width = this.canvas.width;
		this.height = this.canvas.height;

		let max_r = 20;
		let min_r = 5;
		let max_m = 10000;
		let min_m = 2000;
		let max_v = 30;
		let min_v = 10;

		this.gravies.push(new Gravy(
			5,
			100000,
			new Point(600,300),
			new Point(0,0),
			new Point(0,0),
			true
		));

		for (let i = 0; i < number_of_gravies; i++) {
			let r = Math.round(Math.random() * (max_r - min_r)) + min_r;
			let m = Math.round(Math.random() * (max_m - min_m)) + min_m;
			let px = Math.round(Math.random() * (this.width - 2 * r)) + r;
			let py = Math.round(Math.random() * (this.height - 2 * r)) + r;
			let vx = Math.round(Math.random() * (max_v - min_v)) + min_v;
			vx *= (Math.random() > 0.5) ? 1 : -1;
			let vy = Math.round(Math.random() * (max_v - min_v)) + min_v;
			vy *= (Math.random() > 0.5) ? 1 : -1;
			let p = new Point(px, py);
			let v = new Point(vx, vy);
			let a = new Point(0, 0);

			let g = new Gravy(r, m, p, v, a, false);
			this.gravies.push(g);
		}
	}
	update (dt) {
		for (let g of this.gravies)
			g.update(this.G, this.gravies, dt, this);
	}
	draw (ctx) {
		ctx.clearRect(0, 0, this.width, this.height);

		for (let g of this.gravies)
			g.draw(ctx);
	}
	loop (timestamp) {
		let dt = timestamp - this.last_update;
		this.last_update = timestamp;
		
		this.update(dt);
		this.draw(this.ctx);

		requestAnimationFrame((time) => {
			this.loop(time);
		});
	}
}

var game = new Game("can", 2, 0.01);

requestAnimationFrame((timestamp) => {
	game.last_update = timestamp;
	game.loop(timestamp);
});















