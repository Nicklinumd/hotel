class Hotel { // Hotel class
	constructor() {
		this.floorList = [];
		for (let i = 2; i < 6; i++) { // 4 floors
			const floor = new Floor(i);
			for (let j = 1; j < 5; j++) { // 4 normal rooms per floor
				let bedType = 1;
				if (j > 2) {
					bedType = 2;
				}
				const room = new Room(i + '0' + j, 2, bedType, i);
				floor.addRoom(room);
			}
			let bedType = 1;
			if (i < 4) {
				bedType = 2;
			}
			const suite = new Room(i + '05', 1, bedType, i); // 1 suite per floor
			floor.addRoom(suite);
			this.addFloor(floor);
		}
	}

	addFloor(floor) {
		this.floorList.push(floor);
	}

	getFloor(floor) {
		for (let i = 0; i < this.floorList.length; i++) {
			if (this.floorList[i].floorNumber == floor) {
				return this.floorList[i];
			}
		}
		return null;
	}

	hasRoom(roomType, bedType, startDate, endDate) {
		let availableFloor = [];
		for (let i = 0; i < this.floorList.length; i++) {
			let floor = this.floorList[i];
			if (floor.hasRoom(roomType, bedType, startDate, endDate)) {
				availableFloor.push(floor);
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

	firstRoomAvailable(roomType, bedType, startDate, endDate) {
		for (let i = 0; i < this.roomList.length; i++) {
			if (this.roomList[i].checkReservation(roomType, bedType, startDate, endDate)) {
				return this.roomList[i];
			}
		}
		return null;
	}

	hasRoom(roomType, bedType, startDate, endDate) {
		let match = false;
		this.roomList.forEach(function(element) {
			if (element.checkReservation(roomType, bedType, startDate, endDate)) {
				match = true;
			}
		})
		return match;
	}
}

class Room {
	constructor(roomNumber, roomType, bedType, floor) {
		this.roomNumber = roomNumber;
		this.roomType = roomType; // 1: suite 2. normal room
		this.bedType = bedType; // 1. king-sized 2. queen-sized
		this.floor = floor;
		this.reservation = [];
	}

	checkReservation(roomType, bedType, startDate, endDate) {
		let available = true;
		if (roomType == this.roomType && bedType == this.bedType) {
			this.reservation.forEach(function(element){
				if ((element.startDate > startDate && element.startDate < endDate) || (element.endDate > startDate && element.endDate < endDate)) {
					available = false;
				}
			});
		} else {
			available = false;
		}
		return available
	}

	reserve(startDate, endDate) {
		if (this.checkReservation(startDate, endDate)) {
			this.reservation.push({'startDate': startDate, 'endDate': endDate});
		}
		return this.roomNumber;
	}
}

let hotel;

function checkLetter(c) {
	return c >= 'A' && c <= 'z';
}

function checkNumber(c) {
	return c >= '1' && c <= '9';
}

function notEmpty(input) {
	return input !== "" ;
}

function noSpace(input) {
	return input !== " " && input.indexOf(" ") === -1
}

function checkCardNumberHelper(cardNumber) {
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
	} else if (cardNumber.length < 1) {
		return true;
	} else {
		return false;
	}
	return true;
}

function checkDateHelper(startDate, endDate) {
	let today = new Date();
	let inputStartDate = new Date(startDate);
	let inputEndDate = new Date(endDate);
	return inputStartDate.valueOf() + inputStartDate.getTimezoneOffset() * 100000 > today.valueOf() &&
		inputEndDate > inputStartDate;
}

function checkFloorHelper(smokeYes, smokeNo, floor, roomType, bedType, startDate, endDate) {
	let floorList = hotel.hasRoom(roomType.value, bedType.value, startDate.value, endDate.value);
	while (floor.firstChild) {
		floor.removeChild(floor.firstChild);
	}
	if (floorList.length === 0) {
		return false;
	} else {
		for (let j = 0; j < floorList.length; j++){
			if ((smokeYes.checked && floorList[j].floorNumber === 5) || smokeNo.checked) {
				let opt = document.createElement('option');
				opt.value = floorList[j].floorNumber;
				opt.innerHTML = 'Floor ' + floorList[j].floorNumber;
				floor.appendChild(opt);
			}
		}
		if (floor.length == 0) {
			return false;
		} else{
			return true;
		}
	}
}

function checkPeopleNumberHelper(peopleNumber, roomType) {
	if (peopleNumber.value < 1) {
		return 1;
	} else if (roomType.value == 1 && peopleNumber.value > 4) {
		return 2;
	} else if (roomType.value == 2 && peopleNumber.value > 2) {
		return 3;
	} else {
		return 0;
	}
}

function checkZipHelper(zip) {
	let numbers = /^[0-9]+$/;
	return (zip.value.length === 5 && zip.value.match(numbers));
}

// Define constants for each of the error messages
const INVALIDATE_FIRST_NAME = "First name can not be empty and can not contain space.";
const INVALIDATE_MIDDLE_NAME = "Middle name can not contain space.";
const INVALIDATE_LAST_NAME = "Last name can not be empty and can not contain space.";
const INVALIDATE_CARD_NUMBER = "Invalid Royalty Card Number. Valid card number starts with 2 letters and " +
	"end with 4 numbers.";
const INVALIDATE_Date = "Invalid Date. Start Date and End Date can not be prior to today. " +
	"Start Date can not be later than End Date.";
const INVALIDATE_FLOOR = "There is no available room for your selection.";
const INVALIDATE_STREET = "Street can not be empty.";
const INVALIDATE_CITY = "City can not be empty.";
const INVALIDATE_ZIP = "Zip needs to be exactly 5 numbers.";
const INVALIDATE_PEOPLE_NUMBER_1 = "Number of People can not be less than 1.";
const INVALIDATE_PEOPLE_NUMBER_2 = "Maximum number of people for a suite is 4.";
const INVALIDATE_PEOPLE_NUMBER_3 = "Maximum number of people for a normal room is 2.";

function setupForm() {
	let firstName = document.getElementById("firstName");
	let middleName = document.getElementById("middleName");
	let lastName = document.getElementById("lastName");
	let cardNumber = document.getElementById("cardNumber");
	let startDate = document.getElementById("startDate");
	let endDate = document.getElementById("endDate");
	let smokeYes = document.getElementById('smokeYes');
	let smokeNo = document.getElementById('smokeNo');
	let roomType = document.getElementById("roomType");
	let bedType = document.getElementById("bedType");
	let floor = document.getElementById("floor");
	let peopleNumber = document.getElementById("peopleNumber");
	let street = document.getElementById("street");
	let city = document.getElementById("city");
	let zip = document.getElementById("zip");

	let firstNameError = document.getElementById("firstNameError");
	let middleNameError = document.getElementById("middleError");
	let lastNameError = document.getElementById("lastNameError");
	let cardNumberError = document.getElementById("cardNumberError");
	let dateError = document.getElementById("dateError");
	let floorError = document.getElementById("floorError");
	let peopleNumberError = document.getElementById("peopleNumberError");
	let streetError = document.getElementById("streetError");
	let cityError = document.getElementById("cityError");
	let zipError = document.getElementById("zipError");

	let submit = document.getElementById("submit");
	hotel = new Hotel();

	firstName.addEventListener("change", checkFirstName);
	middleName.addEventListener("change", checkMiddleName);
	lastName.addEventListener("change", checkLastName);
	cardNumber.addEventListener("change", checkCardNumber);
	startDate.addEventListener("change", checkDate);
	endDate.addEventListener("change", checkDate);
	smokeYes.addEventListener("click", checkFloor);
	smokeNo.addEventListener("click", checkFloor);
	roomType.addEventListener("change", checkFloor);
	bedType.addEventListener("change", checkFloor);
	peopleNumber.addEventListener("change", checkPeopleNumber);
	street.addEventListener("change", checkStreet);
	city.addEventListener("change", checkCity);
	zip.addEventListener("change", checkZip);

	function checkFirstName() {
		if (notEmpty(firstName.value) && noSpace(firstName.value)) {
			firstNameError.style.display = "none";
			firstName.classList.remove('invalid-input');
			submit.disabled = false;
		} else {
			firstNameError.innerHTML = INVALIDATE_FIRST_NAME;
			firstNameError.style.display = "block";
			firstName.classList.add('invalid-input');
			submit.disabled = true;
		}
	}

	function checkMiddleName() {
		if (noSpace(middleName.value)) {
			middleNameError.style.display = "none";
			middleName.classList.remove('invalid-input');
			submit.disabled = false;
		} else {
			middleNameError.innerHTML = INVALIDATE_MIDDLE_NAME;
			middleNameError.style.display = "block";
			middleName.classList.add('invalid-input');
			submit.disabled = true;
		}
	}

	function checkLastName() {
		if (notEmpty(lastName.value) && noSpace(lastName.value)) {
			lastNameError.style.display = "none";
			lastName.classList.remove('invalid-input');
			submit.disabled = false;
		} else {
			lastNameError.innerHTML = INVALIDATE_LAST_NAME;
			lastNameError.style.display = "block";
			lastName.classList.add('invalid-input');
			submit.disabled = true;
		}
	}

	function checkCardNumber() {
		if (checkCardNumberHelper(cardNumber.value)) {
			cardNumberError.style.display = "none";
			cardNumber.classList.remove('invalid-input');
			submit.disabled = false;
		} else {
			cardNumberError.innerHTML = INVALIDATE_CARD_NUMBER;
			cardNumberError.style.display = "block";
			cardNumber.classList.add('invalid-input');
			submit.disabled = true;
		}
	}

	function checkDate() {
		if (checkDateHelper(startDate.value, endDate.value)) {
			dateError.style.display = "none";
			startDate.classList.remove('invalid-input');
			endDate.classList.remove('invalid-input');
			submit.disabled = false;
		} else {
			dateError.innerHTML = INVALIDATE_Date;
			dateError.style.display = "block";
			startDate.classList.add('invalid-input');
			endDate.classList.add('invalid-input');
			submit.disabled = true;
		}
	}

	function checkFloor() {
		if (checkFloorHelper(smokeYes, smokeNo, floor, roomType, bedType, startDate, endDate)) {
			floorError.style.display = "none";
			floor.classList.remove('invalid-input');
			submit.disabled = false;
		} else {
			floorError.innerHTML = INVALIDATE_FLOOR;
			floorError.style.display = "block";
			floor.classList.add('invalid-input');
			submit.disabled = true;
		}
	}

	function checkPeopleNumber() {
		let result = checkPeopleNumberHelper(peopleNumber, roomType);
		if (result == 0) {
			peopleNumberError.style.display = "none";
			peopleNumber.classList.remove('invalid-input');
			submit.disabled = false;
		} else {
			peopleNumberError.style.display = "block";
			peopleNumber.classList.add('invalid-input');
			submit.disabled = true;
			if (result == 1) { // Number of people less than 1
				peopleNumberError.innerText = INVALIDATE_PEOPLE_NUMBER_1;
			} else if (result == 2) { // Maximum number of people for a suite is 4
				peopleNumberError.innerText = INVALIDATE_PEOPLE_NUMBER_2;
			} else if (result == 3) { // Maximum number of people for a normal room is 2
				peopleNumberError.innerText = INVALIDATE_PEOPLE_NUMBER_3;
			}
		}
	}

	function checkStreet() {
		if (noSpace(street.value)) {
			streetError.style.display = "none";
			street.classList.remove('invalid-input');
			submit.disabled = false;
		} else { // City is empty or contains space
			streetError.innerHTML = INVALIDATE_STREET;
			streetError.style.display = "block";
			street.classList.add('invalid-input');
			submit.disabled = true;
		}
	}

	function checkCity() {
		if (notEmpty(city.value)) {
			cityError.style.display = "none";
			city.classList.remove('invalid-input');
			submit.disabled = false;
		} else {
			cityError.innerHTML = INVALIDATE_CITY;
			cityError.style.display = "block";
			city.classList.add('invalid-input');
			submit.disabled = true;
		}
	}

	function checkZip() {
		if (checkZipHelper(zip)) {
			zipError.style.display = "none";
			zip.classList.remove('invalid-input');
			submit.disabled = false;
		} else {
			zipError.innerHTML = INVALIDATE_ZIP;
			zipError.style.display = "block";
			zip.classList.add('invalid-input');
			submit.disabled = true;
		}
	}
}

function validateForm() {
	// Define variables for all action elements in the form
	let firstName = document.getElementById("firstName");
	let middleName = document.getElementById("middleName");
	let lastName = document.getElementById("lastName");
	let cardNumber = document.getElementById("cardNumber");
	let startDate = document.getElementById("startDate");
	let endDate = document.getElementById("endDate");
	let smokeYes = document.getElementById('smokeYes');
	let smokeNo = document.getElementById('smokeNo');
	let roomType = document.getElementById("roomType");
	let bedType = document.getElementById("bedType");
	let floor = document.getElementById("floor");
	let peopleNumber = document.getElementById("peopleNumber");
	let street = document.getElementById("street");
	let city = document.getElementById("city");
	let zip = document.getElementById("zip");
	let roomNumber = document.getElementById("roomNumber");

	let firstNameError = document.getElementById("firstNameError");
	let middleNameError = document.getElementById("middleNameError");
	let lastNameError = document.getElementById("lastNameError");
	let cardNumberError = document.getElementById("cardNumberError");
	let dateError = document.getElementById("dateError");
	let floorError = document.getElementById("floorError");
	let peopleNumberError = document.getElementById("peopleNumberError");
	let streetError = document.getElementById("streetError");
	let cityError = document.getElementById("cityError");
	let zipError = document.getElementById("zipError");

	let submit = document.getElementById("submit");

	// Set errors variable to false.  At the end of validation, errors will still be false if there are no errors
	let errors = false;
	if (notEmpty(firstName.value) && noSpace(firstName.value)) {
		firstNameError.style.display = "none";
		firstName.classList.remove('invalid-input');
		submit.disabled = false;
	} else {
		firstNameError.innerHTML = INVALIDATE_FIRST_NAME;
		firstNameError.style.display = "block";
		firstName.classList.add('invalid-input');
		submit.disabled = true;
		errors = true;
	}

	if (noSpace(middleName.value)) {
		middleNameError.style.display = "none";
		middleName.classList.remove('invalid-input');
		submit.disabled = false;
	} else {
		middleNameError.innerHTML = INVALIDATE_MIDDLE_NAME;
		middleNameError.style.display = "block";
		middleName.classList.add('invalid-input');
		submit.disabled = true;
	}

	if (notEmpty(lastName.value) && noSpace(lastName.value)) {
		lastNameError.style.display = "none";
		lastName.classList.remove('invalid-input');
		submit.disabled = false;
	} else {
		lastNameError.innerHTML = INVALIDATE_LAST_NAME;
		lastNameError.style.display = "block";
		lastName.classList.add('invalid-input');
		submit.disabled = true;
		errors = true;
	}

	if (checkCardNumberHelper(cardNumber.value)) {
		cardNumberError.style.display = "none";
		cardNumber.classList.remove('invalid-input');
		submit.disabled = false;
	} else {
		cardNumberError.innerHTML = INVALIDATE_CARD_NUMBER;
		cardNumberError.style.display = "block";
		cardNumber.classList.add('invalid-input');
		submit.disabled = true;
		errors = true;
	}

	if (checkDateHelper(startDate.value, endDate.value)) {
		dateError.style.display = "none";
		startDate.classList.remove('invalid-input');
		endDate.classList.remove('invalid-input');
		submit.disabled = false;
	} else {
		dateError.innerHTML = INVALIDATE_Date;
		dateError.style.display = "block";
		startDate.classList.add('invalid-input');
		endDate.classList.add('invalid-input');
		submit.disabled = true;
		errors = true;
	}

	if (checkFloorHelper(smokeYes, smokeNo, floor, roomType, bedType, startDate, endDate)) {
		floorError.style.display = "none";
		floor.classList.remove('invalid-input');
		submit.disabled = false;
	} else {
		floorError.innerHTML = INVALIDATE_FLOOR;
		floorError.style.display = "block";
		floor.classList.add('invalid-input');
		submit.disabled = true;
		errors = true;
	}

	let result = checkPeopleNumberHelper(peopleNumber, roomType);
	if (result == 0) {
		peopleNumberError.style.display = "none";
		peopleNumber.classList.remove('invalid-input');
		submit.disabled = false;
	} else {
		peopleNumberError.style.display = "block";
		peopleNumber.classList.add('invalid-input');
		submit.disabled = true;
		errors = true;
		if (result == 1) {
			peopleNumberError.innerText = INVALIDATE_PEOPLE_NUMBER_1;
		} else if (result == 2) {
			peopleNumberError.innerText = INVALIDATE_PEOPLE_NUMBER_2;
		} else if (result == 3) {
			peopleNumberError.innerText = INVALIDATE_PEOPLE_NUMBER_3;
		}
	}

	if (noSpace(street.value)) {
		streetError.style.display = "none";
		street.classList.remove('invalid-input');
		submit.disabled = false;
	} else {
		streetError.innerHTML = INVALIDATE_STREET;
		streetError.style.display = "block";
		street.classList.add('invalid-input');
		submit.disabled = true;
		errors = true;
	}

	if (notEmpty(city.value)) {
		cityError.style.display = "none";
		city.classList.remove('invalid-input');
		submit.disabled = false;
	} else {
		cityError.innerHTML = INVALIDATE_CITY;
		cityError.style.display = "block";
		city.classList.add('invalid-input');
		submit.disabled = true;
		errors = true;
	}

	if (checkZipHelper(zip)) {
		zipError.style.display = "none";
		zip.classList.remove('invalid-input');
		submit.disabled = false;
	} else {
		zipError.innerHTML = INVALIDATE_ZIP;
		zipError.style.display = "block";
		zip.classList.add('invalid-input');
		submit.disabled = true;
		errors = true;
	}


	// If there are errors, return false, which will prevent the form from being submitted to the server
	// If there are no errors, display the success message
	if (errors) {
		return false;
	} else {
		let selectedFloor = hotel.getFloor(floor.value);
		let selectedRoom = selectedFloor.firstRoomAvailable(roomType.value, bedType.value, startDate.value, endDate.value);
		roomNumber.value = selectedRoom.reserve(startDate.value, endDate.value);
		return true;
	}
}
