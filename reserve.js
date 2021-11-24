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

