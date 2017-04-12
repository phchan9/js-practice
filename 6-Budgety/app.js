// Budget Controller
var budgetController = (function() {
    // some code
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
