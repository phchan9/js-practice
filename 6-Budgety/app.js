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
        },
        budget: 0,
        percentage: -1
    };

    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(cur, idx, arr) {
            sum += cur.value;
        });
        data.totals[type] = sum;
    }

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
        deleteItem: function(type, id) {
            var ids, pos;
            ids = data.allItems[type].map(function(curr) {
                return curr.id;
            });

            pos = ids.indexOf(id);
            if (pos !== -1) {
                data.allItems[type].splice(pos, 1);
            }
        },
        calculateBudget: function() {
            calculateTotal('inc');
            calculateTotal('exp');

            data.budget = data.totals.inc - data.totals.exp;
            if (data.totals.inc > 0) {
                data.percentage = Math.round(data.totals.exp / data.totals.inc * 100);
            } else {
                data.percentage = -1;
            }
        },
        getBudget: function() {
            return {
                budget: data.budget,
                percentage: data.percentage,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp
            };
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
        expenseList: '.expenses__list',
        budgetLabel: '.budget__value',
        budgetIncomeLabel: '.budget__income--value',
        budgetExpenseLabel: '.budget__expenses--value',
        budgetPercentageLabel: '.budget__expenses--percentage',
        container: '.container'
    };
    
    
    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            };
        },
        getDOMStrings: function() {
            return DOMStrings;
        },
        clearFields: function() {
            var fields, fieldsArr;
            fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);

            fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach(function(curr, idx, arr) {
                curr.value = '';
            });

            fieldsArr[0].focus();
        },
        displayBudget: function(obj) {
            document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMStrings.budgetIncomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMStrings.budgetExpenseLabel).textContent = obj.totalExp;

            if (obj.percentage > 0) {
                document.querySelector(DOMStrings.budgetPercentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMStrings.budgetPercentageLabel).textContent = '---';
            }
            
        },
        addListItems: function(obj, type) {
            var html, newHtml, domList;

            if (type === 'inc') {
                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"><div class="item__value">+%value%</div> <div class="item__delete"> <button class="item__delete--btn"> <i class="ion-ios-close-outline"></i> </button> </div> </div> </div>';
                domList = document.querySelector(DOMStrings.incomeList);
            } else if (type === 'exp') {
                html = '<div class="item clearfix"id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">-%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
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
        document.querySelector(DOM.container).addEventListener('click', crtlDeleteItems);
    };

    var updateBudget = function() {
        // 1. calculate the budget
        budgetCtrl.calculateBudget();
        // 2. return the budget
        var budget = budgetCtrl.getBudget();
        // 3. display the budget on the UI
        UICtrl.displayBudget(budget);
    };
    
    var crtlAddItems = function() {
        // 1. Get the input
        var input = UICtrl.getInput();

        if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
            // 2. add the item into budget controller
            var newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            // 3. add the item to the UI
            UICtrl.addListItems(newItem, input.type);
            // 4. clear the fields
            UICtrl.clearFields();
            // 5. update budget
            updateBudget();
        }
        
    };

    var crtlDeleteItems = function(event) {

        var itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (itemId) {
            var split = itemId.split('-');
            var type = split[0];
            var id = parseInt(split[1]);
            // 1. delete the item from budget
            budgetCtrl.deleteItem(type, id);
            // 2. delete the item from UI
            // 3. re-calculate the budget and show it
        }
        
    }

    return {
        init: function() {
            console.log('App init');
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListener();
        }
    }
    
    
})(budgetController, UIController);

controller.init();
