
/*
F = ma
P = mv

F_1_2 = G*(M_1 * M_2) / d^2

update position using velocity
update velocity using acceleration
calculate total force exerted on object
update acceleration
*/

class Vector {
	constructor (x=0, y=0) {
		this.x = x;
		this.y = y;
	}
	magnitude () {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}
	toString() {
		return JSON.stringify(this);
	}
}

class Body {
	constructor (r, m, p, v, a, immovable) {
		this.r = r;
		this.m = m;
		this.p = p;
		this.v = v;
		this.a = a;
		this.immovable = immovable;
	}
	update (G, bodiess, dt, game) {
		if (this.immovable) {return;}
		if (this.p.x < -this.r) {
			this.p.x = game.width + this.r;
			this.v.x = this.v.x * 0.5;
			this.a.x = this.a.x;
		}
		if (this.p.x > game.width + this.r) {
			this.p.x = -this.r;
			this.v.x = this.v.x * 0.5;
			this.a.x = this.a.x;
		}
		if (this.p.y < -this.r) {
			this.p.y = game.height + this.r;
			this.v.y = this.v.y * 0.5;
			this.a.y = this.a.y;
		}
		if (this.p.y > game.height + this.r) {
			this.p.y = -this.r;
			this.v.y = this.v.y * 0.5;
			this.a.y = this.a.y;
		}

		this.a.x = 0;
		this.a.y = 0;
		for (let b of bodiess) {
			if (b === this) {continue;}

			let r = new Vector();
			r.x = b.p.x - this.p.x;
			r.y = b.p.y - this.p.y;
			r.d = Math.sqrt(r.x * r.x + r.y * r.y);
			
			let F = b.m / ((r.d * r.d) + 10);
			
			this.a.x += F * r.x / r.d;
			this.a.y += F * r.y / r.d;
		}
		this.a.x *= G;
		this.a.y *= G;
		
		this.v.x += this.a.x * dt / 1000;
		this.v.y += this.a.y * dt / 1000;

		this.p.x += this.v.x * dt / 1000;
		this.p.y += this.v.y * dt / 1000;
	}
	draw (ctx) {
		ctx.beginPath();
		ctx.arc(this.p.x, this.p.y, this.r, 0, 2*Math.PI, false);
		ctx.fill();
		ctx.closePath();
	}
}
class Game {
	constructor (can_id, number_of_bodies, G) {
		this.last_update = -1;
		this.bodies = [];
		this.G = G;
		this.canvas = document.getElementById(can_id);
		this.ctx = this.canvas.getContext("2d");
		this.ctx.fillStyle = "rgb(200,200,200)";
		this.width = this.canvas.width;
		this.height = this.canvas.height;

		let max_r = 30;
		let min_r = 10;
		let max_m = 10000;
		let min_m = 5000;
		let max_v = 40;
		let min_v = 25;

		this.bodies.push(new Body(
			5,
			1000000,
			new Vector(600,300),
			new Vector(0,0),
			new Vector(0,0),
			true
		));

		for (let i = 0; i < number_of_bodies; i++) {
			let r = Math.round(Math.random() * (max_r - min_r)) + min_r;
			let m = r * 1000;
			let px = Math.round(Math.random() * (this.width - 2 * r)) + r;
			let py = Math.round(Math.random() * (this.height - 2 * r)) + r;
			let vx = Math.round(Math.random() * (max_v - min_v)) + min_v;
			vx *= (Math.random() > 0.5) ? 1 : -1;
			let vy = Math.round(Math.random() * (max_v - min_v)) + min_v;
			vy *= (Math.random() > 0.5) ? 1 : -1;
			
			let p = new Vector(px, py);
			let v = new Vector(vx, vy);
			let a = new Vector(0, 0);

			let body = new Body(r, m, p, v, a, false);
			this.bodies.push(body);
		}
	}
	update (dt) {
		// TODO: Calculate Force at this level
		for (let b of this.bodies)
			b.update(this.G, this.bodies, dt, this);
	}
	draw (ctx) {
		ctx.clearRect(0, 0, this.width, this.height);

		for (let b of this.bodies)
			b.draw(ctx);
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

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

var game = new Game("can", 3, 1);

requestAnimationFrame((timestamp) => {
	game.last_update = timestamp;
	game.loop(timestamp);
});















