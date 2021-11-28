class Hotel {
	constructor() {
		this.floorList = [];
	}

	addFloor(floor) {
		this.floorList.push(floor);
	}

	hasRoom(roomType, bedType) {
		let availableFloor = [];
		for (let i = 0; i < this.floorList.length; i++) {
			let floor = this.floorList[i];
			if (floor.hasRoom(roomType, bedType)) {
				availableFloor.push(floor)
			}
		}
		return availableFloor
	}
}

class Floor {
	constructor(floorNumber) {
		this.floorNumber = floorNumber;
		this.roomList = [];
	}

	addRoom(room) {
		this.roomList.push(room);
	}

	hasRoom(roomType, bedType) {
		for (let i = 0; i < this.roomList.length; i++) {
			let room = this.roomList[i];
			if (room.roomType == roomType && room.bedType == bedType && room.reserved == false) {
				return true;
			}
		}
		return false;
	}
}

class Room {
	constructor(roomNumber, roomType, bedType, floor) {
		this.roomNumber = roomNumber;
		this.roomType = roomType; // 1: suite 2. normal room
		this.bedType = bedType; // 1. king-sized 2. queen-sized
		this.floor = floor;
		this.reserved = false;
	}

	reserve() {
		this.reserved = true;
	}
}

let hotel = new Hotel()

for (let i = 2; i < 6; i++) {
	let floor = new Floor(i);
	for (let j = 1; j < 5; j++) {
		let bedType = 1;
		if (j > 2) {
			bedType = 2;
		}
		let room = new Room(i + '0' + j, 2, bedType, i);
		floor.addRoom(room);
	}
	bedType = 1;
	if (i < 4) {
		bedType = 2;
	}
	let suite = new Room(i + '05', 1, bedType, i);
	floor.addRoom(suite);
	hotel.addFloor(floor);
}
console.log(hotel)

function checkLetter(c) {
	if (c >= 'A' && c <= 'z') {
		return true;
	} else {
		return false;
	}
}

function checkNumber(c) {
	if (c >= '1' && c <= '9') {
		return true;
	} else {
		return false;
	}
}

function validateCardNumberHelper(cardNumber) {
	if (cardNumber.length > 0 && cardNumber.length <= 6) {
		for (let i = 0; i < cardNumber.length; i++) {
			if (i < 2) {
				if (!checkLetter(cardNumber.charAt(i))) {
					return false;
				}
			} else {
				if (!checkNumber(cardNumber.charAt(i))) {
					return false;
				}
			}
		}
	} else {
		return false;
	}
	return true;
}

function validateCardNumber() {
	let cardNumberElem = document.getElementById('card-number');
	let warningTabElem = document.getElementById('card-number-warning');
	if (validateCardNumberHelper(cardNumberElem.value)) {
		warningTabElem.hidden = true;
		cardNumberElem.classList.remove('invalid-input');
	} else {
		warningTabElem.innerText = "Invalid Royalty Card Number. Valid card number starts with 2 letters and " +
			"end with 4 numbers\n";
		warningTabElem.hidden = false;
		cardNumberElem.classList.add('invalid-input');
	}
}

function validateDateHelper(startDate, endDate) {
	let today = new Date();
	let inputStartDate = new Date(startDate);
	let inputEndDate = new Date(endDate);
	if (inputStartDate.valueOf() + inputStartDate.getTimezoneOffset() * 100000 > today.valueOf() &&
		inputEndDate > inputStartDate) {
		return true;
	} else {
		return false;
	}
}

function validateDate() {
	let startDateElem = document.getElementById('start-date');
	let endDateElem = document.getElementById('end-date');
	let warningTabElem = document.getElementById('date-warning');
	if (validateDateHelper(startDateElem.value, endDateElem.value)) {
		warningTabElem.hidden = true;
		startDateElem.classList.remove('invalid-input');
		endDateElem.classList.remove('invalid-input');
	} else {
		warningTabElem.innerText = "Invalid Date. Start Date and End Date can not be prior to today. " +
			"Start Date can not be later than End Date\n";
		warningTabElem.hidden = false;
		startDateElem.classList.add('invalid-input');
		endDateElem.classList.add('invalid-input');
	}
}

function updateFloorOptions() {
	let roomTypeElem = document.getElementById('room-type');
	let bedTypeElem = document.getElementById('bed-type');
	let floorElem = document.getElementById('floor');
	let options = floorElem.options;

	floorList = hotel.hasRoom(roomTypeElem.value, bedTypeElem.value);
	for (let i = 0; i < options.length; i++) {
		let hasRoom = false;
		for (let j = 0; j < floorList.length; j++) {
			if (options[i].value == floorList[j].floorNumber) {
				hasRoom = true;
			}
		}
		if (!hasRoom) {
			options.prototype.splice(i, 1);
		}
	}
	floorElem.options = options;
}