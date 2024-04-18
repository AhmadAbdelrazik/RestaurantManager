import inquirer from "inquirer";

let items = [];

// Items.js

class Item {
  constructor(name, actualPrice, sellingPrice, amount) {
    this.name = name;
    this.actualPrice = actualPrice;
    this.sellingPrice = sellingPrice;
    this.amount = amount;
  }

  get discountPercentage() {
    return ((this.actualPrice - this.sellingPrice) / this.actualPrice) * 100;
  }

  set discountPercentage(discount) {
    this.sellingPrice = this.actualPrice * (discount / 100);
  }

  toString() {
    return this.name;
  }

  printInfo() {
    console.log(`Item's Name:`.padEnd(35), this.name);
    console.log(`Item's Actual Price:`.padEnd(35), this.actualPrice, ' EGP');
    console.log(`Item's Selling Price:`.padEnd(35), this.sellingPrice, ' EGP');
    console.log(`Item's amount:`.padEnd(35), this.amount);
  }
}

// Initialized Values

items.push(new Item("Pizza", 99, 59, 10));
items.push(new Item("Chicken Burger", 109, 99, 6));
items.push(new Item("Waffle", 129, 119, 13));
items.push(new Item("Meat Burger", 159, 159, 10));
items.push(new Item("Croissant", 19, 19, 40));

// Main Menu

async function mainMenu() {
  let c = 1;
  while (c < 100) {
    console.clear();
    let answer = await inquirer.prompt({
      type: "list",
      name: "mainChoice",
      message: "Menu: ",
      choices: [
        "Make an Order",
        "Add an Item",
        "Edit Items",
        "Print Menu",
        "Close the Program",
      ],
    });

    if (answer.mainChoice === "Make an Order") await order();
    else if (answer.mainChoice === "Add an Item") await addItem();
    else if (answer.mainChoice === "Edit Items") await changeStock();
    else if (answer.mainChoice === "Print Menu") await printMenu();
    else if (answer.mainChoice === "Close the Program") {
      console.clear();
      process.exit(0);
    }

    c++;
  }
}

// Main Functions (Order, Add Item, Restock).

/*
1. Select the food items
2. Select the amount for each item.
3. Make the receipt.
4. Confirm the receipt.
5. Mark recepit as done.
*/

function orderMenu() {
  console.clear();
  console.log("Food Menu:\n");
  console.log(`   ${"Name".padEnd(20)}Price`);
  console.log(`---------------------------------`);

  let i = 1;
  for (let item of items.filter((val) => {
    if (val.amount > 0) return val;
  })) {
    console.log(`${i++}. ${item.name.padEnd(20)}${item.sellingPrice} EGP`);
  }
  console.log("\n\n\n");
}

async function order() {
  orderMenu();

  let answer = await inquirer.prompt({
    type: "checkbox",
    name: "cart",
    message: "select Items to buy",
    choices: items
      .filter((val) => {
        if (val.amount) return val;
      })
      .map((val) => ({
        name: val.name,
        value: val,
      })),
  });

  let questions = [];
  let cart = [];
  let i = 0;

  for (let item of answer.cart) {
    cart.push(item);

    let question = {
      type: "number",
      name: `item_${i++}`,
      message: `How many ${item.name}s you want? (max ${item.amount})`,
      filter: (val) => {
        if (val > item.amount) val = item.amount;
        else if (val < 0) val = 0;
        return val;
      },
    };
    questions.push(question);
  }

  console.clear();
  let amounts = await inquirer.prompt(questions);

  i = 0;
  for (let enough in amounts) {
    cart[i++].orderedAmount = amounts[enough];
  }

  await printReceipt(cart);

  let confirmer = await inquirer.prompt({
    name: "back",
    type: "confirm",
    message: "Return Back?",
  });

  if (!confirmer.back) {
    process.exit(0);
  }
}

async function printReceipt(cart) {
  let totalCost = 0;
  let i = 0;

  console.log(`Oredred Items:`);
  console.log(
    `${"Name".padEnd(18)}${"Price".padEnd(10)}${"Ordered".padEnd(
      10
    )}${"Total".padEnd(10)}`
  );
  for (let item of cart) {
    if (item.orderedAmount == 0) continue;
    console.log(
      `${item.name.padEnd(18)}${String(item.sellingPrice + " EGP").padEnd(
        10
      )}${String(item.orderedAmount).padEnd(10)}${
        item.sellingPrice * item.orderedAmount
      } EGP`
    );
    totalCost += item.sellingPrice * item.orderedAmount;
  }
  if (totalCost == 0) {
    console.clear();
    return;
  }
  console.log("------------------------------------------\n");
  console.log(`Total Price = ${totalCost} EGP\n`);
}

// add Item

async function addItem() {
  let answer = await inquirer.prompt([
    {
      type: "input",
      name: "itemName",
      message: "Name of the item: ",
    },
    {
      type: "number",
      name: "itemPrice",
      message: "Actual price of the item: ",
    },
    {
      type: "number",
      name: "sellingPrice",
      message: "selling price of the item: ",
    },
    {
      type: "number",
      name: "amount",
      message: "How many is in the stock: ",
      default: 0,
    },
    {
      type: "confirm",
      message: "Add the Item?",
      name: "confirmation",
    },
  ]);

  if (
    !answer.confirmation ||
    isNaN(answer.sellingPrice) ||
    isNaN(answer.itemPrice) ||
    isNaN(answer.amount)
  ) {
    return;
  }

  items.push(
    new Item(
      answer.itemName,
      answer.itemPrice,
      answer.sellingPrice,
      answer.amount
    )
  );

  console.log(`${answer.itemName} has been added to the menu`);

  let confirmer = await inquirer.prompt({
    name: "back",
    type: "confirm",
    message: "Return Back?",
  });
  if (!confirmer.back) {
    process.exit(0);
  }
}

async function changeStock() {
  let answer = await inquirer.prompt({
    type: "list",
    name: "item",
    message: "Select the Item to Update: ",
    choices: items.map((val, idx, arr) => ({
      name: val.name,
      value: arr[idx],
    })),
  });

  console.clear();
  answer.item.printInfo();
  console.log("\n");

  let changer = await inquirer.prompt({
    type: "checkbox",
    name: "changes",
    message: "What do you want to change? ",
    choices: ["Item name", "Item price", "Available amount"],
  });

  if (changer.changes.find((val) => val === "Item name") !== undefined) {
    let changeName = await inquirer.prompt([
      {
        type: "input",
        name: "newName",
        message: `Enter a new name for ${answer.item}: `,
      },
      {
        type: "confirm",
        name: "confirm",
        message: (ans) => `Change ${answer.item} to ${ans.newName}?`,
      },
    ]);

    if (changeName.confirm) answer.item.name = changeName.newName;
  }

  if (changer.changes.find((val) => val === "Item price") !== undefined) {
    let changePrice = await inquirer.prompt([
      {
        type: "number",
        name: "newActualPrice",
        message: `Enter the new Price for ${answer.item}: `,
        filter: val => val < 0 ? 0 : val,
      },
      {
        type: "number",
        name: "newSellingPrice",
        message: `Enter the new Selling Price for ${answer.item} after discount: `,
        filter: val => val < 0 ? 0 : val,
      },
      {
        type: "confirm",
        name: "confirm",
        message: (ans) =>
          `Change actual price of ${answer.item} to ${ans.newActualPrice} and selling price to ${ans.newSellingPrice}?`,
      },
    ]);

    if (changePrice.confirm) {
      answer.item.sellingPrice = changePrice.newSellingPrice;
      answer.item.actualPrice = changePrice.newActualPrice;
    }
  }
  
  if (changer.changes.find((val) => val === "Available amount") !== undefined) {
    let changeAmount = await inquirer.prompt([
      {
        type: "number",
        name: "newAmount",
        message: `Enter the new Amount for ${answer.item}: `,
        filter: val => val < 0 ? 0 : val,
      },
      {
        type: "confirm",
        name: "confirm",
        message: ans =>
          `Change amount of ${answer.item} to ${ans.newAmount}?`,
      },
    ]);

    if (changeAmount.confirm) 
      answer.item.amount = changeAmount.newAmount;
  }
  
  let confirmer = await inquirer.prompt({
    name: "back",
    type: "confirm",
    message: "Return Back?",
  });
  if (!confirmer.back) {
    process.exit(0);
  }
}


async function printMenu() {
  orderMenu();

  let confirmer = await inquirer.prompt({
    name: "back",
    type: "confirm",
    message: "Return Back?",
  });
  if (!confirmer.back) {
    process.exit(0);
  }
}

// Events

// Main Code

mainMenu();
