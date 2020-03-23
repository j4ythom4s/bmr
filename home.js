let inputedMoney = 0;

$(document).ready(function () {

    test();

    loadVendingItems();  
    
    $('#add-dollar-button').on('click', function () {
        inputedMoney += 1;
        messageBox("You added a Dollar");
        updateMoneyBox(inputedMoney);
    });

    $('#add-quarter-button').on('click', function () {
        inputedMoney += .25;
        messageBox("You added a Quarter");
        updateMoneyBox(inputedMoney);
    });

    $('#add-dime-button').on('click', function () {
        inputedMoney += .10;
        messageBox("You added a Dime");
        updateMoneyBox(inputedMoney);
    });

    $('#add-nickel-button').on('click', function () {
        inputedMoney += .05;
        messageBox("You added a Nickel");
        updateMoneyBox(inputedMoney);
    });

    $('#purchase-button').click(function () {
        makePurchase();
    });

    $('#return-change-button').on('click', function () {
        returnChange();
        inputedMoney = 0;
    });
});

function selectItem(id) {
    console.log(id);
    $("#vending-message").val(id + " selected!");
    $("#item-to-vend").val(id);
}

function loadVendingItems() {
    const vendingDiv = $('#vending-items');
    $.ajax({
        type: 'GET',
        url: 'http://tsg-vending.herokuapp.com/items',
        success: function (vendingItemsArray) {
            vendingDiv.empty();

            $.each(vendingItemsArray, function (index, item) {
                const id = item.id;
                const name = item.name;
                const price = item.price.toFixed(2);
                const quantity = item.quantity;

                let vendingInfo = '<div class="card display-inline-block vendingCard" onclick="selectItem(1)">';
                        vendingInfo += '<p style ="text-align: left">' + id + '</p>';
                        vendingInfo += '<p><b>' + name + '</b></p>';
                        vendingInfo += '<p>$ ' + price + '</p>';
                        vendingInfo += '<p> Quantity Left: ' + quantity + '</p>';
                    vendingInfo += '</div>';
                    vendingDiv.append(vendingInfo);
                });
        },
        error: function () {
            alert("Failure Calling The Web Service. Please try again later.");
        }
    });
}

function test() {
    console.log("Hi");
}

function messageBox(message) {
    $("#vending-message").val(message);
}

function updateMoneyBox(money) {
    $("#money-input").empty();
    $("#money-input").val(money.toFixed(2));
}

function makePurchase() {
    var money = $("#money-input").val();
    var item = $("#item-to-vend").val();

    $.ajax({
        type: 'POST',
        url: 'http://tsg-vending.herokuapp.com/money/' + money + '/item/' + item,
        success: function (returnMoney) {
            var change = $('#change-input-box');
            $('#vending-message').val("Item vended. Thank you!");
            var pennies = returnMoney.pennies;
            var nickels = returnMoney.nickels;
            var quarters = returnMoney.quarters;
            var dimes = returnMoney.dimes;
            var returnMessage = "";
            if (quarters != 0) {
                returnMessage += quarters + ' Quarter/s ';              
            }
            if (dimes != 0) {
                returnMessage += dimes + ' Dime/s ';                     
            }
            if (nickels != 0) {
                returnMessage += nickels + ' Nickel/s ';                 
            }
            if (pennies != 0) {
                returnMessage += pennies + ' Penny/ies ';              
            }
            if (quarters == 0 && dimes == 0 && nickels == 0 && pennies == 0) {
                returnMessage += "There is no change";                  
            }
            change.val(returnMessage);                                 
            $('#money-input').val('');
            loadVendingItems();
            inputedMoney = 0;
        },
        error: function (error) {
            var errorMessage = error.responseJSON.message;
            messageBox(errorMessage);
        }
    });
}

function returnChange() {
    var inputMoney = $('#money-input').val();
    var money = $('#money-input').val();

    var quarter = Math.floor(money / 0.25);
    money = (money - quarter * 0.25).toFixed(2);
    var dime = Math.floor(money / 0.10);
    money = (money - dime * 0.10).toFixed(2);
    var nickel = Math.floor(money / 0.05);
    money = (money - nickel * 0.05).toFixed(2);
    var penny = Math.floor(money / 0.01);
    money = (money - penny * 0.01).toFixed(2);

    var returnMessage = "";
    var vendingMessage = "";

    if (quarter != 0 && quarter > 1) {
        returnMessage += quarter + ' Quarters ';    
    }   else if (quarter != 0 && quarter == 1) {
        returnMessage += quarter + ' Quarter';
    }
    if (dime != 0 && dime > 1) {
        returnMessage += dime + ' Dimes ';
    } else if (dime != 0 && dime == 1) {
        returnMessage += dime + ' Dime ';
    }
    if (nickel != 0 && nickel > 1) {
        returnMessage += nickel + ' Nickels ';    
    } else if (nickel != 0 && nickel == 1) {
        returnMessage += nickel + ' Nickel ';
    }
    if (penny != 0 && penny > 1) {
        returnMessage += penny + ' Pennies ';     
    } else if (penny != 0 && penny == 1) {
        returnMessage += penny + ' Penny ';
    }
    if (quarter == 0 && dime == 0 && nickel == 0 && penny == 0) {
        returnMessage += "There is no change.";   
        vendingMessage = "No money was inputted.";           
    } else {
        vendingMessage = "Transaction cancelled. Money inputted ($" + inputMoney + ") is returned through change.";
    }
    inputedMoney = 0;
    messageBox("");
    $('#vending-message').val(vendingMessage);
    $('#change-input-box').val(returnMessage);
    $('#item-to-vend').val('');
    $('#money-input').val(''); 
}