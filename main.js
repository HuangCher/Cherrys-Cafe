var kitchenButton = document.getElementById('kitchenScreenBtn');
var orderButton = document.getElementById('orderScreenBtn');
var clearButton = document.getElementById('clearBtn');
var orderScreen = document.getElementById('orderScreen');
var kitchenScreen = document.getElementById('kitchenScreen');
var text = document.getElementById('dialogueText');
var ice = document.getElementById('ice');
var espresso = document.getElementById('espresso');
var milk = document.getElementById('milk');
var cocoa = document.getElementById('cocoa');
var vanilla = document.getElementById('vanilla');
var water = document.getElementById('water');
var playerIngredients = [];
var coffeeChosen = '';
var money = 0.00;
var reputation = 3;

// coffee options
var coffeeOptions = [
    { name: 'cappuccino', ingredients: ['espresso', 'milk'], price: 4.49 },
    { name: 'vanilla latte', ingredients: ['espresso', 'milk', 'vanilla'], price: 6.49 },
    { name: 'chocolate cold brew', ingredients: ['espresso', 'milk', 'cocoa', 'vanilla', 'ice'], price: 6.99 },
    { name: 'americano', ingredients: ['espresso', 'water'], price: 3.99 },
    { name: 'mocha', ingredients: ['espresso', 'milk', 'cocoa'], price: 5.99 }
];

// customers and their character dialogue
var customers = [
    { name: 'Alice', image: 'assets/customer1.png', dialogue: {
        'Hey, can you get me a cappuccino.' : 'cappuccino',
        'Hi! Mind fetching me a latte?' : 'vanilla latte',
        'Oh my gosh! It is so hot! Can you please get me something to cool off?' : 'chocolate cold brew',
        'Ughhh I cannot believe he found another girl so quickly... Gimme something bitter!' : 'americano',
        'I can definitely go for some hot chocolate! You don\'t have any? Um, well anything similar?' : 'mocha'
        }
    },
    { name: 'Dylan', image: 'assets/customer2.png', dialogue: {
        'Hey pretty lady, can I order a cappuccino please? ' : 'cappuccino',
        'I\'m in the mood for something sweet, just like you. Any ideas Ms. Barista' : 'vanilla latte',
        'I just got my paycheck so I can splurge a little bit. Could I get the most expensive one?' : 'chocolate cold brew',
        'Heya! simple drinks are so underrated. Some espresso and water should do.' : 'americano',
        'Jeez, it is way too cold today... Oh hi Ms. Barista, I\'m looking for something warm and chocolately.' : 'mocha'
        }
    },
    { name: 'Charlie', image: 'assets/customer3.png', dialogue: {
        'I would love to indulge in a Kapuziner please?' : 'cappuccino',
        'A caffe latte please.' : 'vanilla latte',
        'Hello Madam, could you kindly brew me your most elaborate drink?' : 'chocolate cold brew',
        'Hello, a caffe americano please.' : 'americano',
        'Good afternoon young lady, may I request a mocaccino?' : 'mocha'
        }
    },
];

//will generate a random customer and their dialogue
//updates the coffeeChosen variable to the coffee the customer wants
function generateCustomer() {
    var customerAmount = 3;
    var randomizerCustomer = Math.floor(Math.random() * customerAmount);
    var customerChosen = customers[randomizerCustomer];
    var customer = document.getElementById('customer');
    customer.src = customerChosen.image;

    var customerDialogues = Object.keys(customerChosen.dialogue);
    var randomizerDialogue = Math.floor(Math.random() * customerDialogues.length);
    var dialogueChosen = customerDialogues[randomizerDialogue];
    text.innerHTML = dialogueChosen;
    var coffee = customerChosen.dialogue[dialogueChosen];
    coffeeChosen = coffee;
}

//will show the order screen and hide the kitchen screen
function showOrderScreen() {
    coffeeChosen = '';
    orderScreen.style.display = 'block';
    kitchenScreen.style.display = 'none';
    generateCustomer();
    console.log(coffeeChosen);
}

//will show the kitchen screen and hide the order screen
function showKitchenScreen() {
    kitchenScreen.style.display = 'block';
    orderScreen.style.display = 'none';
}

//loops through the player ingredients and updates the inventory slots
function inventory() {
    var inventorySlots = document.querySelectorAll('.inventorySlot');
    for (let i = 0; i < inventorySlots.length; i++) {
        if (playerIngredients[i]) {
            inventorySlots[i].style.backgroundImage = 'url(assets/' + playerIngredients[i] + '.png)';
        } else {
            inventorySlots[i].style.backgroundImage = '';
        }
    }
}

//will add the ingredient to the playerIngredients array if not already in the array
//will then call the inventory function to update the inventory slots
function addList(ingredient){
    if (playerIngredients.includes(ingredient)) {
        pass;
    } else {
        playerIngredients.push(ingredient);
        inventory();
    }
    console.log(playerIngredients);
}
  
//will check if the playerIngredients array matches the coffeeChosen array
//return whether the order is correct or not
function checkOrder() {
    var correct = false;
    for (let i=0; i < coffeeOptions.length; i++) {
        if (coffeeOptions[i].name == coffeeChosen) {
            if (coffeeOptions[i].ingredients.length == playerIngredients.length) {
                for (let j in coffeeOptions[i].ingredients) {
                    if (j in playerIngredients) {
                        correct = true;
                    } else {
                        correct = false;
                        break;
                    }
                }
            }
        }
    } 
    return correct;
}

//will check the reputation and update the reputation icons
function checkReputation() {
    var icons = document.querySelectorAll('.repIcon');
    for (var i = 0; i < icons.length; i++) {
        if (i < reputation) {
            icons[i].style.display = 'inline';
        } else {
            icons[i].style.display = 'none'; 
        }
    }
}

//will update the money display and keep it to 2 decimal places
function updateMoney() {
    var bank = document.getElementById('bank');
    bank.textContent = '$' + money.toFixed(2);
}

//will calculate the payment based on the coffee chosen
//will add a 30% tip if the order is correct
//will subtract 1 from the reputation if the order is incorrect and add the flat price of the coffee
//updates the money and the reputation display 
function payment() {
    for (let i=0; i < coffeeOptions.length; i++) {
        if (coffeeOptions[i].name == coffeeChosen) {
            if (checkOrder() == true) {
                money += Math.round((coffeeOptions[i].price + (coffeeOptions[i].price * 0.30)) * 100) / 100
            } else {
                money += coffeeOptions[i].price
                reputation -= 1
            }
            updateMoney();
            checkReputation();  
        }    
    } 
}

//will reset the game to the initial state
function resetGame() {
    money = 0.00;
    reputation = 3;
    playerIngredients = [];
    inventory();
    checkReputation();
    showOrderScreen();
    updateMoney();
}

//will check if the player has reached $100 and has not lost all their customers
function win() {
    if (money >= 100 && reputation != 0) {
        setTimeout(function() {
            alert('Congratulations! You have reached $100.00, great job!\nPress OK to restart.');
            resetGame();
        }, 500);
    }
}

//will check if the player has lost all their customers
function lose() {
    if (reputation == 0) {
        setTimeout(function() {
            alert('You have lost all your customers due to bad ratings. Game Over!\nPress OK to restart.');
            resetGame();
        }, 500);
    }
}

//will run the game and make sure the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    //start the game with the order screen
    showOrderScreen();

    //event listeners for the buttons
    kitchenButton.addEventListener('click', function() {
        showKitchenScreen();
    });
    clearButton.addEventListener('click', function() {
        playerIngredients = [];
        inventory();
    });
    //update the money and check the order
    //update the reputation and check if the player has won or lost
    //reset the playerIngredients array and update the inventory
    orderButton.addEventListener('click', function() {
        checkOrder();
        setTimeout(function() {
            payment();
            updateMoney();
            win();
            lose();
            playerIngredients = [];
            inventory();
            showOrderScreen();
        }, 0);
    });

    //event listeners for the ingredients
    ice.addEventListener('click', function() {
        addList('ice');
    });
    espresso.addEventListener('click', function() {
        addList('espresso');
    });
    milk.addEventListener('click', function() {
        addList('milk');
    });
    vanilla.addEventListener('click', function() {
        addList('vanilla');
    });
    water.addEventListener('click', function() {
        addList('water');
    });
    cocoa.addEventListener('click', function() {
        addList('cocoa');
    });
    
});

