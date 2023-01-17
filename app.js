const laptopSelector = document.getElementById("select-laptop");
const laptopPrice = document.getElementById("laptop-price");
const laptopTitle = document.getElementById("laptop-header");
const laptopDescription = document.getElementById("laptop-description");
const laptopFeature1 = document.getElementById("feature-1");
const laptopFeature2 = document.getElementById("feature-2");
const laptopFeature3 = document.getElementById("feature-3");
const laptopImage = document.getElementById("laptop-img");
let salaryAmountDiv = document.getElementById("pay-amount");
const workButton = document.getElementById("work-button");
const loanButton = document.getElementById("loan-button");
let balanceAmountDiv = document.getElementById("balance-amount");
const bankButton = document.getElementById("bank-button");
let currentLoanDiv = document.getElementById("current-loan");
const repayLoanButton = document.getElementById("repay-loan-button");
const buyLaptopButton = document.getElementById("buy-laptop-button");

// Initialize laptops array
laptops = [];

// Keep track of selected laptop id
let selectedID = 0;

// Fetch laptop data from remote server
fetch("https://hickory-quilled-actress.glitch.me/computers")
  .then((response) => response.json())
  .then((data) => (laptops = data))
  .then((laptops) => addLaptopsToSelector(laptops));

// Add laptops to the select element and set initial values for other elements
const addLaptopsToSelector = (laptops) => {
  laptops.forEach((x) => addLaptopToSelector(x));

  // Starting selector for laptops.
  laptopPrice.innerText = laptops[0].price + " NOK";
  laptopFeature1.innerText = laptops[0].specs[0];
  laptopFeature2.innerText = laptops[0].specs[1];
  laptopFeature3.innerText = laptops[0].specs[2];
  laptopTitle.innerText = laptops[0].title;
  laptopDescription.innerText = laptops[0].description;
  laptopImage.src =
    "https://hickory-quilled-actress.glitch.me/" + laptops[0].image;
};

// Create an option element for each laptop and add to the select element
const addLaptopToSelector = (laptop) => {
  const laptopElement = document.createElement("option");
  laptopElement.value = laptop.id;
  laptopElement.appendChild(document.createTextNode(laptop.title));
  laptopSelector.appendChild(laptopElement);
};

// Update feature elements when a different laptop is selected
const laptopFeaturesChange = (e) => {
  const selectedLaptop = laptops[e.target.selectedIndex];
  laptopFeature1.innerText = selectedLaptop.specs[0];
  laptopFeature2.innerText = selectedLaptop.specs[1];
  laptopFeature3.innerText = selectedLaptop.specs[2];
};
// Update price elements when a different laptop is selected
const laptopPriceChange = (e) => {
  const selectedLaptop = laptops[e.target.selectedIndex];
  laptopPrice.innerText = selectedLaptop.price + " NOK";
  selectedID = e.target.selectedIndex;
};

// Update title elements when a different laptop is selected
const laptopTitleChange = (e) => {
  const selectedLaptop = laptops[e.target.selectedIndex];
  laptopTitle.innerText = selectedLaptop.title;
};

// Update description elements when a different laptop is selected
const laptopDescriptionChange = (e) => {
  const selectedLaptop = laptops[e.target.selectedIndex];
  laptopDescription.innerText = selectedLaptop.description;
};

// Update image elements when a different laptop is selected
const laptopImageChange = (e) => {
  const selectedLaptop = laptops[e.target.selectedIndex];
  const baseUrl = "https://hickory-quilled-actress.glitch.me/";
  laptopImage.src = baseUrl + selectedLaptop.image;

  laptopImage.onerror = function () {
    laptopImage.src =
      "https://hickory-quilled-actress.glitch.me/" +
      selectedLaptop.image.replace("jpg", "png");
  };
};

// Eventlisteners
laptopSelector.addEventListener("change", laptopPriceChange);
laptopSelector.addEventListener("change", laptopTitleChange);
laptopSelector.addEventListener("change", laptopDescriptionChange);
laptopSelector.addEventListener("change", laptopFeaturesChange);
laptopSelector.addEventListener("change", laptopImageChange);

let salaryAmount = 0;
let balanceAmount = 0;
let currentLoan = 0;
let loanAmount = 0;

// Loan Checker
function repayLoanButtonCondition() {
  if (currentLoan > 0) {
    repayLoanButton.style.display = "flex";
  } else {
    repayLoanButton.style.display = "none";
  }
}

// Work
function addSalaryAmount() {
  salaryAmount += 100;
  salaryAmountDiv.innerHTML = salaryAmount + "kr";
}

//Deposit salary
function depositSalaryToBank() {
  balanceAmount += salaryAmount;
  if (currentLoan > 0) {
    let loanPercent = (salaryAmount * 10) / 100;
    currentLoan -= loanPercent;
  }
  salaryAmount = 0;
  balanceAmountDiv.innerHTML = balanceAmount + "kr";
  salaryAmountDiv.innerHTML = salaryAmount + "kr";
  currentLoanDiv.innerHTML = currentLoan + "kr";
  repayLoanButtonCondition();
}

// Get Loan
function addLoan() {
  if (currentLoan < 1) {
    loanAmount = parseFloat(prompt("Type in below how much you want to loan"));
    if (loanAmount <= balanceAmount * 2) {
      balanceAmount += loanAmount;
      balanceAmountDiv.innerHTML = balanceAmount + "kr";
      currentLoan += loanAmount;
      currentLoanDiv.innerHTML = currentLoan + "kr";
    } else {
      alert(`Your maximum allowed loan is ${balanceAmount * 2} NOK`);
    }
  } else {
    alert(
      `You currently have ${currentLoan} NOK in loans. You need to pay back your current loan in order to get a new one`
    );
  }
  repayLoanButtonCondition();
}

//Repay loan
function repayLoan() {
  if (currentLoan < salaryAmount) {
    let result = (currentLoan - salaryAmount) * -1;

    currentLoan = 0;
    currentLoanDiv.innerHTML = currentLoan + "kr";

    balanceAmount += result;
    balanceAmountDiv.innerHTML = balanceAmount + "kr";

    salaryAmount = 0;
    salaryAmountDiv.innerHTML = salaryAmount + "kr";
  } else {
    currentLoan -= salaryAmount;
    currentLoanDiv.innerHTML = currentLoan + "kr";

    if (balanceAmount > currentLoan) {
      balanceAmount -= salaryAmount;
      balanceAmountDiv.innerHTML = balanceAmount + "kr";
    }

    salaryAmount = 0;
    salaryAmountDiv.innerHTML = salaryAmount + "kr";
  }
  repayLoanButtonCondition();
}

//Buy laptop
function buyLaptop() {
  let getLaptopPrice = laptops[selectedID].price;
  let getLaptopTitle = laptops[selectedID].title;
  if (balanceAmount >= getLaptopPrice) {
    balanceAmount -= getLaptopPrice;
    balanceAmountDiv.innerHTML = balanceAmount + "kr";
    alert(`Congrats! You now own a brand new ${getLaptopTitle}`);
  } else {
    alert(`Sorry! you do not have enough money to buy a ${getLaptopTitle}`);
  }
}

// Eventlisteners
workButton.addEventListener(`click`, addSalaryAmount);
loanButton.addEventListener(`click`, addLoan);
bankButton.addEventListener(`click`, depositSalaryToBank);
repayLoanButton.addEventListener(`click`, repayLoan);
buyLaptopButton.addEventListener(`click`, buyLaptop);
repayLoanButtonCondition();
