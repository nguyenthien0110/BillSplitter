function generateInputs() {
  var people = parseInt(document.getElementById("people").value);

  if (isNaN(people) || people <= 0) {
    document.getElementById("result").innerText =
      "Please enter a valid number of people.";
    return;
  }

  var inputGroupNames = document.getElementById("input-group-names");
  inputGroupNames.innerHTML = "";

  for (var i = 0; i < people; i++) {
    var nameLabel = document.createElement("label");
    nameLabel.textContent = "Name of Person " + (i + 1) + ":";
    inputGroupNames.appendChild(nameLabel);

    var nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.className = "person-name";
    inputGroupNames.appendChild(nameInput);

    var amountLabel = document.createElement("label");
    amountLabel.textContent = "Amount spent by " + nameInput.value + ": $";
    inputGroupNames.appendChild(amountLabel);

    var amountInput = document.createElement("input");
    amountInput.type = "number";
    amountInput.min = "0";
    amountInput.step = "0.01";
    amountInput.className = "person-amount";
    inputGroupNames.appendChild(amountInput);

    inputGroupNames.appendChild(document.createElement("br"));
  }
}

function calculate() {
  var amountInputs = document.querySelectorAll(".person-amount");
  var namesInputs = document.querySelectorAll(".person-name");

  var total = 0;
  var people = amountInputs.length;
  var amounts = [];
  var names = [];

  amountInputs.forEach(function (input, index) {
    total += parseFloat(input.value);
    amounts.push(parseFloat(input.value));
    names.push(namesInputs[index].value);
  });

  var amountPerPerson = total / people;

  var debts = [];
  for (var i = 0; i < people; i++) {
    debts.push({ name: names[i], amount: amounts[i] - amountPerPerson });
  }

  var positiveDebts = debts
    .filter((debt) => debt.amount > 0)
    .sort((a, b) => b.amount - a.amount);
  var negativeDebts = debts
    .filter((debt) => debt.amount < 0)
    .sort((a, b) => a.amount - b.amount);

  var transactions = [];

  for (var i = 0; i < positiveDebts.length; i++) {
    for (var j = 0; j < negativeDebts.length; j++) {
      var payment = Math.min(positiveDebts[i].amount, -negativeDebts[j].amount);
      positiveDebts[i].amount -= payment;
      negativeDebts[j].amount += payment;
      transactions.push({
        from: negativeDebts[j].name,
        to: positiveDebts[i].name,
        amount: payment,
      });
      if (positiveDebts[i].amount === 0) break;
    }
  }

  var result = "Total bill: $" + total.toFixed(2) + "\n";
  result += "Each person should pay: $" + amountPerPerson.toFixed(2) + "\n";
  result += "Transactions:\n";

  transactions.forEach(function (transaction) {
    result +=
      transaction.from +
      " should pay " +
      transaction.amount.toFixed(2) +
      " to " +
      transaction.to +
      "\n";
  });

  document.getElementById("result").innerText = result;
}

function toggleMode(mode) {
  const body = document.body;
  const sunIcon = document.getElementById("sun-icon");
  const moonIcon = document.getElementById("moon-icon");

  if (mode === "light") {
    body.classList.remove("dark-mode");
    sunIcon.style.display = "none";
    moonIcon.style.display = "inline";
  } else {
    body.classList.add("dark-mode");
    sunIcon.style.display = "inline";
    moonIcon.style.display = "none";
  }
}
