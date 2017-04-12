// Budget Controller
var budgetController = (function() {
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var data = {
        allItems: {
            inc: [],
            exp: []
        },
        totals: {
            inc: 0,
            exp: 0
        }
    };

    return {
        addItem: function(type, des, value) {
            var newItem;
            var ID;

            if (data.allItems[type].length === 0) {
                ID = 0;
            } else {
                var idx = data.allItems[type].length - 1;
                ID = data.allItems[type][idx].id + 1;
            }
            
            if (type === 'inc') {
                newItem = new Income(ID, des, value);
            } else if (type === 'exp') {
                newItem = new Expense(ID, des, value);
            }

            data.allItems[type].push(newItem);
            return newItem;
        },
        testing: function() {
            console.log(data);
        }
    };
    

    
})();

// UI Controller
var UIController = (function() {
    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'
    };
    
    
    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: document.querySelector(DOMStrings.inputValue).value
                
            };
        },
        getDOMStrings: function() {
            return DOMStrings;
        }
    }
    
})();

// Global App Controller
var controller = (function(budgetCtrl, UICtrl) {

    var DOM = UICtrl.getDOMStrings();

    var setupEventListener = function() {
        document.querySelector(DOM.inputBtn).addEventListener('click', crtlAddItems);
        document.addEventListener('keypress', function(event) {
            if (event.keyCode === 13 || event.which === 13) {
                crtlAddItems();
            }
        });    
    };
    
    var crtlAddItems = function() {
        // 1. Get the input
        var input = UICtrl.getInput();
                
        // 2. add the item into budget controller
        var newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        // 3. add  the item to the UI
        // 4. calculate the budget
        // 5. display the budget on the UI
        
    };

    return {
        init: function() {
            console.log('App init');
            setupEventListener();
        }
    }
    
    
})(budgetController, UIController);

controller.init();
