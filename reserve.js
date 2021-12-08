// Hotel class which represents the hotel system
class Hotel { 
	// Initialize the hotel with specified room types and bed types
	constructor(data) {
		this.floorList = [];
		for (let i = 2; i < 6; i++) { // 4 floors
			const floor = new Floor(i);
			for (let j = 1; j < 5; j++) { // 4 normal rooms per floor
				let bedType = 1; // 1: King-sized Bed, 2: Queen-size Bed
				if (j > 2) { // 2 rooms with bed type 1 and 2 rooms with bed type 2
					bedType = 2;
				}
				const room = new Room(i + '0' + j, 2, bedType, i);
				floor.addRoom(room); // Add each room to each floor
			}
			let bedType = 1;
			if (i < 4) { // 2 suites with bed type 1 and 2 rooms with bed type 2
				bedType = 2;
			}
			const suite = new Room(i + '05', 1, bedType, i); // 1 suite per floor
			floor.addRoom(suite);
			this.addFloor(floor);
		}
		this.loadReservations(data) // Load reservation data
	}

	// Add floor to hotel class
	addFloor(floor) { 
		this.floorList.push(floor);
	}

	// Return floor with floor number
	getFloor(floor) { 
		for (let i = 0; i < this.floorList.length; i++) {
			if (this.floorList[i].floorNumber == floor) {
				return this.floorList[i];
			}
		}
		return null;
	}

	// Check if hotel has available room with selected requirements
	// Return list of floors with avaible room
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

	// Load reservation from js file
	loadReservations(data) {
		for (let i = 0; i < data.length; i++) {
			let resData = data[i];
			let floor = this.getFloor(resData['room'].charAt(0));
			let room = floor.getRoom(resData['room']);
			let startDate = new Date(resData['checkIn']);
			let endDate = new Date(resData['checkOut']);
			// Determine if the room in the reservation is a valid room.  If not, ignore the data.
			if (room != null) {
				room.reservation.push({'startDate': startDate, 'endDate': endDate})
			}
		}
	}
}

// Floor class which represents each floor
class Floor {
	// Initialize a floor with specified floor number and an empty room list
	constructor(floorNumber) {
		this.floorNumber = floorNumber;
		this.roomList = [];
	}

	// Add a room object to the room list
	addRoom(room) {
		this.roomList.push(room);
	}

	// Get room with room number
	getRoom(roomNumber) {
		for (let i = 0; i < this.roomList.length; i++) {
			if (this.roomList[i].roomNumber == roomNumber) {
				return this.roomList[i];
			}
		}
		return null;
	}

	// Return the first available room for reservation
	firstRoomAvailable(roomType, bedType, startDate, endDate) {
		for (let i = 0; i < this.roomList.length; i++) {
			if (this.roomList[i].checkReservation(roomType, bedType, startDate, endDate)) {
				return this.roomList[i];
			}
		}
		return null;
	}

	// Check if the floor has available rooms with specified requirements
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

// Room class which represents each room
class Room {
	// Initialize a room with room number, room type, bed type, floor, and an empty reservation list
	constructor(roomNumber, roomType, bedType, floor) {
		this.roomNumber = roomNumber;
		this.roomType = roomType; // 1: suite 2. normal room
		this.bedType = bedType; // 1. king-sized 2. queen-sized
		this.floor = floor;
		this.reservation = [];
	}

	// Check if room can be reserved with specified requirements
	checkReservation(roomType, bedType, startDate, endDate) {
		let available = true;
		startDate = new Date(startDate);
		endDate = new Date(endDate);
		if (roomType == this.roomType && bedType == this.bedType) {
			// There are three conditions which room is unavailable
			// 1. Input start date is within a reservation range
			// 2. Input end date is within a reservation range
			// 3. A reservation range is within the input range
			this.reservation.forEach(function(element){
				if ((startDate > element.startDate && startDate < element.endDate) || 
					(endDate > element.startDate && endDate < element.endDate) ||
					(startDate < element.startDate && endDate > element.endDate)) {
					available = false;
				}
			});
		} else {
			available = false;
		}
		return available
	}

	// Reserve the room by adding input date range into the reservation list
	reserve(startDate, endDate) {
		if (this.checkReservation(startDate, endDate)) {
			this.reservation.push({'startDate': startDate, 'endDate': endDate});
		}
		return this.roomNumber;
	}
}

let hotel;

// Check if character is letter
function checkLetter(c) {
	return c >= 'A' && c <= 'z';
}

// Check if character is number
function checkNumber(c) {
	return c >= '1' && c <= '9';
}

// Check if input is empty
function notEmpty(input) {
	return input !== "" ;
}

// Check if input contains space
function noSpace(input) {
	return input !== " " && input.indexOf(" ") === -1
}

// Helper method for checking card number
function checkCardNumberHelper(cardNumber) {
	if (cardNumber.length > 0 && cardNumber.length <= 6) {
		for (let i = 0; i < cardNumber.length; i++) {
			if (i < 2) { // First two characters must be letters
				if (!checkLetter(cardNumber.charAt(i))) {
					return false;
				}
			} else { // Last four characters must be numbers
				if (!checkNumber(cardNumber.charAt(i))) {
					return false;
				}
			}
		}
	} else if (cardNumber.length == 0) { // User did not input anything which is fine
		return true;
	} else {
		return false;
	}
	return true;
}

// Helper method for checking dates
// Input start date needs to be prior than today and end date needs to be prior than start date
function checkDateHelper(startDate, endDate) {
	let today = new Date();
	let inputStartDate = new Date(startDate);
	let inputEndDate = new Date(endDate);
	return inputStartDate.valueOf() + inputStartDate.getTimezoneOffset() * 100000 > today.valueOf() &&
		inputEndDate > inputStartDate; 
}

// Helper method for checking floor
function checkFloorHelper(smokeYes, smokeNo, floor, roomType, bedType, startDate, endDate) {
	// Get available floor list
	let floorList = hotel.hasRoom(roomType.value, bedType.value, startDate.value, endDate.value);
	// Remove all the options for floor
	while (floor.firstChild) {
		floor.removeChild(floor.firstChild);
	}

	// Add each available floor to the options
	for (let j = 0; j < floorList.length; j++){
		// If smoke is chosen, only floor 5 is available
		if ((smokeYes.checked && floorList[j].floorNumber === 5) || smokeNo.checked) {
			let opt = document.createElement('option');
			opt.value = floorList[j].floorNumber;
			opt.innerHTML = 'Floor ' + floorList[j].floorNumber;
			floor.appendChild(opt);
		}
	}
	if (floor.length === 0) { // No available rooms on any floor
		return false;
	} else{
		return true;
	}
}

// Helper method for checking number of people
function checkPeopleNumberHelper(peopleNumber, roomType) {
	if (peopleNumber.value < 1) { // Number of people can not be less than 1
		return 1;
	} else if (roomType.value == 1 && peopleNumber.value > 4) { // Maximum for a suite is 4
		return 2;
	} else if (roomType.value == 2 && peopleNumber.value > 2) { // Maximum for a normal room is 2
		return 3;
	} else { // Pass
		return 0;
	}
}

// Helper method for checking zip code
// Zip code needs to be exactly 5 numbers
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

function setupForm(data) {
	hotel = new Hotel(data);
	// console.log(hotel);
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

	firstName.addEventListener("change", checkFirstName);
	middleName.addEventListener("change", checkMiddleName);
	lastName.addEventListener("change", checkLastName);
	cardNumber.addEventListener("change", checkCardNumber);
	startDate.addEventListener("change", checkDate);
	startDate.addEventListener("change", checkFloor);
	endDate.addEventListener("change", checkDate);
	endDate.addEventListener("change", checkFloor);
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
