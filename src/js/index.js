'use strict';

const settings = {
	rowsCount: 21,
	colsCount: 21,
	obstaclesCount: 10,
	speed: 4,
	winFoodCount: 50,
};

const config = {
	settings,

	init(userSettings = {}) {
		Object.assign(this.settings, userSettings);
	},

	getRowsCount() {
		return this.settings.rowsCount;
	},
	getColsCount() {
		return this.settings.colsCount;
	},
	getSpeed() {
		return this.settings.speed;
	},
	getWinFoodCount() {
		return this.settings.winFoodCount;
	},
	getObstaclesCount() {
		return this.settings.obstaclesCount;
	},

	validate() {
		const result = {
			isValid: true,
			errors: [],
		};

		if (this.getRowsCount() < 10 || this.getRowsCount() > 30) {
			result.isValid = false;
			result.errors.push(
				'Значение настройки rowsCount должно быть в диапазоне [10, 30]'
			);
		}

		if (this.getColsCount() < 10 || this.getColsCount() > 30) {
			result.isValid = false;
			result.errors.push(
				'Значение настройки colsCount должно быть в диапазоне [10, 30]'
			);
		}

		if (this.getSpeed() < 1 || this.getSpeed() > 10) {
			result.isValid = false;
			result.errors.push(
				'Значение настройки speed должно быть в диапазоне [1, 10]'
			);
		}

		if (this.getWinFoodCount() < 5 || this.getWinFoodCount() > 50) {
			result.isValid = false;
			result.errors.push(
				'Значение настройки winFoodCount должно быть в диапазоне [5, 50]'
			);
		}

		if (
			this.getObstaclesCount() < 0 ||
			this.getObstaclesCount() > 10
		) {
			result.isValid = false;
			result.errors.push(
				'Значение настройки obstaclesCount должно быть в диапазоне [0, 10]'
			);
		}
		return result;
	},
};

const map = {
	cells: {},
	usedCells: [],
	obstacleCells: [],
	obstacleCellsCoords: [],

	init(rowsCount, colsCount) {
		const table = document.getElementById('game');
		table.innerHTML = '';

		this.cells = {};
		this.usedCells = [];

		for (let row = 0; row < rowsCount; row++) {
			const tr = document.createElement('tr');
			tr.classList.add('row');
			table.appendChild(tr);

			for (let col = 0; col < colsCount; col++) {
				const td = document.createElement('td');
				td.classList.add('col');
				tr.appendChild(td);

				this.cells[`x${col}_y${row}`] = td;
			}
		}
	},

	render(snakePointsArray, foodPoint) {
		for (const cell of this.usedCells) {
			cell.className = 'col';
		}

		this.usedCells = [];

		snakePointsArray.forEach((point, ind) => {
			const snakeCell = this.cells[`x${point.x}_y${point.y}`];
			snakeCell.classList.add(ind === 0 ? 'snakeHead' : 'snakeBody');
			this.usedCells.push(snakeCell);
		});

		const foodCell = this.cells[`x${foodPoint.x}_y${foodPoint.y}`];
		foodCell.classList.add('food');
		this.usedCells.push(foodCell);
	},

	renderObstacles(obstaclesCount) {
		for (const cell of this.obstacleCells) {
			cell.className = 'col';
		}

		this.obstacleCells = [];
		this.obstacleCellsCoords = [];
		for (let obs = 0; obs < obstaclesCount; obs++) {
			const coords = game.getRandomFreeCoords();
			const newObstacle = this.cells[`x${coords.x}_y${coords.y}`];
			newObstacle.classList.add('obstacle');
			this.obstacleCellsCoords.push(coords);
			this.obstacleCells.push(newObstacle);
		}
	},

	getObstacleCellsCoords() {
		return this.obstacleCellsCoords;
	},
};

const snake = {
	body: [],
	direction: null,
	lastStepDirection: null,
	config,

	init(startBody, direction) {
		this.body = startBody;
		this.direction = direction;
		this.lastStepDirection = direction;
	},

	getBody() {
		return this.body;
	},

	getLastStepDirection() {
		return this.lastStepDirection;
	},

	setDirection(direction) {
		this.direction = direction;
	},

	isOnPoint(point) {
		return this.getBody().some((snakePoint) => {
			return snakePoint.x === point.x && snakePoint.y === point.y;
		});
	},

	makeStep() {
		this.lastStepDirection = this.direction;
		this.getBody().unshift(this.getNextStepHeadPoint());
		this.getBody().pop();
	},

	growUp() {
		const lastBodyInd = this.getBody().length - 1;
		const lastBodyPoint = this.getBody()[lastBodyInd];
		const lastBodyPointClone = Object.assign({}, lastBodyPoint);

		this.getBody().push(lastBodyPointClone);
	},

	getNextStepHeadPoint() {
		const firstPoint = this.getBody()[0];
		const rowLimit = this.config.getRowsCount();
		const colLimit = this.config.getColsCount();

		switch (this.direction) {
			case 'up':
				return {
					x: firstPoint.x,
					y: firstPoint.y - 1 < 0 ? rowLimit - 1 : firstPoint.y - 1,
				};
			case 'down':
				return { x: firstPoint.x, y: (firstPoint.y + 1) % rowLimit };
			case 'right':
				return { x: (firstPoint.x + 1) % colLimit, y: firstPoint.y };
			case 'left':
				return {
					x: firstPoint.x - 1 < 0 ? colLimit - 1 : firstPoint.x - 1,
					y: firstPoint.y,
				};
		}
	},
};

const food = {
	x: null,
	y: null,

	getCoords() {
		return {
			x: this.x,
			y: this.y,
		};
	},

	setCoords(point) {
		this.x = point.x;
		this.y = point.y;
	},

	isOnPoint(point) {
		return this.x === point.x && this.y === point.y;
	},
};

const status = {
	condition: null,

	setPlaying() {
		this.condition = 'playing';
	},

	setStopped() {
		this.condition = 'stopped';
	},

	setFinished() {
		this.condition = 'finished';
	},

	isPlaying() {
		return this.condition === 'playing';
	},

	isStopped() {
		return this.condition === 'stopped';
	},
};

const game = {
	config,
	map,
	snake,
	food,
	status,
	tickInterval: null,

	init(userSettings = {}) {
		this.config.init(userSettings);
		const validation = this.config.validate();

		if (!validation.isValid) {
			for (const err of validation.errors) {
				console.error(err);
			}
			return;
		}

		const goalEl = document.getElementById('game-goal');
		goalEl.textContent = this.config.getWinFoodCount();

		this.map.init(
			this.config.getRowsCount(),
			this.config.getColsCount(),
			this.config.getObstaclesCount()
		);
		this.setEventHandlers();
		this.reset();
	},

	setEventHandlers() {
		document
			.getElementById('playButton')
			.addEventListener('click', () => this.playClickHandler());
		document
			.getElementById('newGameButton')
			.addEventListener('click', () => this.newGameClickHandler());
		document.addEventListener('keydown', (e) =>
			this.keyDownHandler(e)
		);
	},

	playClickHandler() {
		if (this.status.isPlaying()) this.stop();
		else if (this.status.isStopped()) this.play();
	},

	newGameClickHandler() {
		this.reset();
	},

	keyDownHandler(e) {
		if (!this.status.isPlaying()) return;

		const direction = this.getDirectionByCode(e.code);

		if (this.canSetDirection(direction))
			this.snake.setDirection(direction);
	},

	getDirectionByCode(code) {
		switch (code) {
			case 'KeyW':
			case 'ArrowUp':
				return 'up';
			case 'KeyS':
			case 'ArrowDown':
				return 'down';
			case 'KeyA':
			case 'ArrowLeft':
				return 'left';
			case 'KeyD':
			case 'ArrowRight':
				return 'right';
		}
	},

	canSetDirection(direction) {
		const lastStepDirection = this.snake.getLastStepDirection();

		const isSettable =
			(direction === 'up' && lastStepDirection !== 'down') ||
			(direction === 'down' && lastStepDirection !== 'up') ||
			(direction === 'left' && lastStepDirection !== 'right') ||
			(direction === 'right' && lastStepDirection !== 'left');

		return isSettable;
	},

	reset() {
		this.stop();
		this.snake.init(this.getStartSnakeBody(), 'up');
		this.food.setCoords(this.getRandomFreeCoords());
		this.map.renderObstacles(this.config.getObstaclesCount());
		this.render();
	},

	getStartSnakeBody() {
		return [
			{
				x: Math.floor(this.config.getColsCount() / 2),
				y: Math.floor(this.config.getRowsCount() / 2),
			},
		];
	},

	getRandomFreeCoords() {
		const exclude = [
			this.food.getCoords(),
			...this.snake.getBody(),
			...this.map.getObstacleCellsCoords(),
		];

		while (true) {
			const randPoint = {
				x: Math.floor(Math.random() * this.config.getColsCount()),
				y: Math.floor(Math.random() * this.config.getRowsCount()),
			};

			if (
				!exclude.some(
					(expoint) =>
						expoint.x === randPoint.x && expoint.y === randPoint.y
				)
			)
				return randPoint;
		}
	},

	play() {
		this.status.setPlaying();
		this.tickInterval = setInterval(() => {
			this.tickHandler();
		}, 1000 / this.config.getSpeed());
	},

	tickHandler() {
		if (!this.canMakeStep()) return this.finish();
		if (this.food.isOnPoint(this.snake.getNextStepHeadPoint())) {
			this.snake.growUp();
			this.food.setCoords(this.getRandomFreeCoords());
			this.changeScore();

			if (this.isGameWon()) this.finish();
		}

		this.snake.makeStep(
			this.config.getRowsCount(),
			this.config.getColsCount()
		);
		this.render();
	},

	changeScore() {
		const scoreEl = document.getElementById('game-score');
		if (this.status.isPlaying()) {
			scoreEl.textContent = +scoreEl.textContent + 1;
		} else scoreEl.textContent = 0;
	},

	canMakeStep() {
		const nextHeadPoint = this.snake.getNextStepHeadPoint();

		const isObstacle = this.map
			.getObstacleCellsCoords()
			.some((coords) => {
				return (
					coords.x === nextHeadPoint.x && coords.y === nextHeadPoint.y
				);
			});

		const isSteppable =
			!this.snake.isOnPoint(nextHeadPoint) && !isObstacle;

		return isSteppable;
	},

	isGameWon() {
		return (
			this.snake.getBody().length > this.config.getWinFoodCount()
		);
	},

	stop() {
		this.status.setStopped();
		clearInterval(this.tickInterval);
		this.setPlayButton();
	},

	finish() {
		this.status.setFinished();
		this.changeScore();
		clearInterval(this.tickInterval);
		this.setPlayButton(true);
	},

	setPlayButton(isDisabled = false) {
		const playButton = document.getElementById('playButton');
		if (isDisabled) {
			playButton.classList.add('disabled');
			playButton.setAttribute('disabled', true);
			playButton.textContent = 'Game lost';
		} else {
			playButton.classList.remove('disabled');
			playButton.removeAttribute('disabled');
			playButton.textContent = 'Play';
		}
	},

	render() {
		this.map.render(this.snake.getBody(), this.food.getCoords());
	},
};

game.init();
