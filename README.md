# Restaurant Manager Project

This project is designed to assist restaurant managers in managing their menu, inventory, and orders efficiently. It provides a user-friendly interface through the command line using Node.js.

## Installation

To use this project, ensure you have Node.js installed on your machine. Then, follow these steps:

1. Clone this repository to your local machine.
2. Navigate to the project directory in your terminal.
3. Run `npm install` to install the required dependencies.

## Usage

To start the application, run `node app.js` in your terminal from the project directory. This will launch the interactive menu where you can perform various tasks such as making orders, adding items to the menu, editing items, and printing the menu.

### Main Menu

Upon launching the application, you will be presented with the main menu options:

- **Make an Order**: Select this option to make a new order.
- **Add an Item**: Add a new item to the restaurant's menu.
- **Edit Items**: Modify existing items in the menu, including their names, prices, and stock availability.
- **Print Menu**: View the current menu with prices and availability.
- **Close the Program**: Exit the application.

### Making an Order

When selecting the "Make an Order" option, you can choose items from the menu and specify the quantity for each item. The application will generate a receipt with the total cost.

### Adding an Item

Choose "Add an Item" to add a new item to the menu. You will be prompted to enter the item's name, actual price, selling price, and initial stock amount.

### Editing Items

Select "Edit Items" to modify existing items in the menu. You can change the item's name, price, or available stock.

### Printing Menu

This option allows you to view the current menu, displaying each item's name, selling price, and availability.

## Technologies Used

- **Node.js**: JavaScript runtime environment.
- **inquirer**: Interactive command-line interface for user input.

## Contributors

This project was developed by Ahmad Abdelrazik.

## License

This project is licensed under the [MIT License](LICENSE). Feel free to modify and distribute it as needed.