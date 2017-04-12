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
        inputBtn: '.add__btn',
        incomeList: '.income__list',
        expenseList: '.expenses__list'
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
        },
        addListItems: function(obj, type) {
            var html, newHtml, domList;

            if (type === 'inc') {
                html = '<div class="item clearfix" id="income-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"><div class="item__value">+%value%</div> <div class="item__delete"> <button class="item__delete--btn"> <iclass="ion-ios-close-outline"></i> </button> </div> </div> </div>';
                domList = document.querySelector(DOMStrings.incomeList);
            } else if (type === 'exp') {
                html = '<div class="item clearfix"id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">-%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><iclass="ion-ios-close-outline"></i></button></div></div></div>';
                domList = document.querySelector(DOMStrings.expenseList);
            }

            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            domList.insertAdjacentHTML('beforeend', newHtml);
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
        // 3. add the item to the UI
        UICtrl.addListItems(newItem, input.type);

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
