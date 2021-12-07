const ROOM_TYPE_NAME = ["Suite", "Normal Room"];
const BED_TYPE_NAME = ["King-Sized", "Queen-Sized"];
const SUITE_PRICE = 500;
const UPPER_PRICE = 350;
const LOWER_PRICE = 250;
const BREAKFAST_PRICE = 20;

function notEmpty(input) {
    return input !== "";
}

function calculateCostPerNight(roomType, floor) {
    if (roomType === 1) {
        return SUITE_PRICE;
    } else {
        if (floor > 3) {
            return UPPER_PRICE;
        } else {
            return LOWER_PRICE;
        }
    }
}

function calculateCostTotalNight(costPerNight, startDate, endDate) {
    let date1 = new Date(startDate);
    let date2 = new Date(endDate);
    return (date2.getTime() - date1.getTime()) / (1000 * 3600 * 24) * costPerNight;
}

function calculateBreakFastCost(breakfast, cardNumber, peopleNumber) {
    if (breakfast == "yes" && !notEmpty(cardNumber)) {
        return peopleNumber * BREAKFAST_PRICE;
    } else {
        return 0;
    }
}

function getInfo() {
    let queryString = window.location.search;
    let urlParams = new URLSearchParams(queryString);

    let firstNameValue = urlParams.get("firstName");
    let middleNameValue = urlParams.get("middleName");
    let lastNameValue = urlParams.get("lastName");
    let cardNumberValue = urlParams.get("cardNumber");
    let startDateValue = urlParams.get("startDate");
    let endDateValue = urlParams.get("endDate");
    let smokeValue = urlParams.get("smoke");
    let roomTypeValue = urlParams.get("roomType");
    let bedTypeValue = urlParams.get("bedType");
    let floorValue = urlParams.get("floor");
    let peopleNumberValue = urlParams.get("peopleNumber");
    let roomNumberValue = urlParams.get("roomNumber");
    let breakfastValue = urlParams.get("breakfast");

    let customerName = document.getElementById("customerName");
    let costPerNight = document.getElementById("costPerNight");
    let costTotalNight = document.getElementById("costTotalNight");
    let roomNumber = document.getElementById("roomNumber");
    let floor = document.getElementById("floor");
    let roomType = document.getElementById("roomType");
    let bedType = document.getElementById("bedType");
    let smoke = document.getElementById("smoke");
    let peopleNumber = document.getElementById("peopleNumber");
    let startDate = document.getElementById("startDate");
    let endDate = document.getElementById("endDate");
    let breakfast = document.getElementById("breakfast");
    let breakfastCost = document.getElementById("breakfastCost");
    let totalCost = document.getElementById("totalCost");
    let reservationNumber = document.getElementById("reservationNumber");

    let costPerNightValue = calculateCostPerNight(roomTypeValue, floorValue);
    let costTotalNightValue = calculateCostTotalNight(costPerNightValue, startDateValue, endDateValue);
    let breakfastCostValue = calculateBreakFastCost(breakfastValue, cardNumberValue, peopleNumberValue);
    let totalCostValue = costPerNightValue + costTotalNightValue + breakfastCostValue;
    let reservationNumberValue = Math.floor(Math.random() * 99999);

    customerName.innerText = firstNameValue + " " + middleNameValue + " " + lastNameValue;
    roomNumber.innerText = roomNumberValue;
    floor.innerText = floorValue;
    roomType.innerText = ROOM_TYPE_NAME[roomTypeValue-1];
    bedType.innerText = BED_TYPE_NAME[bedTypeValue-1];
    smoke.innerText = smokeValue;
    peopleNumber.innerText = peopleNumberValue
    endDate.innerText = endDateValue
    startDate.innerText = startDateValue
    startDate.innerText = startDateValue
    breakfast.innerText = breakfastValue
    costPerNight.innerText = costPerNightValue.toString();
    costTotalNight.innerText = costTotalNightValue.toString();
    breakfastCost.innerText = breakfastCostValue.toString();
    totalCost.innerText = totalCostValue.toString();
    reservationNumber.innerText = reservationNumberValue.toString();
}


