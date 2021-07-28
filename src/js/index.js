'use strict';

const settings = {
	rowsCount: 21,
	colsCount: 21,
	speed: 2,
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

		return result;
	},
};

const map = {
	cells: {},
	usedCells: [],

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
			cell.className = 'cell';
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
};

map.init(21, 21);
map.render(
	[
		{ x: 5, y: 5 },
		{ x: 6, y: 5 },
	],
	{ x: 5, y: 6 }
);
