const form = document.getElementById('transactionForm');
const customExpensesContainer = document.getElementById('customExpensesContainer');
const addCustomExpenseBtn = document.getElementById('addCustomExpenseBtn');

let customExpenseCount = 1;

const refreshSalaryBtn = document.getElementById('refreshSalary');
const addToSalaryBtn = document.getElementById('addToSalary');
const salaryInput = document.getElementById('salary');

// Refresh salary button
refreshSalaryBtn.addEventListener('click', () => {
  salaryInput.value = '';
});

// Add to salary button
addToSalaryBtn.addEventListener('click', () => {
  const currentSalary = parseFloat(salaryInput.value) || 0;
  const bonusAmount = parseFloat(prompt('Enter bonus amount:')) || 0;
  salaryInput.value = (currentSalary + bonusAmount).toFixed(2);
});

// Store permanent custom expenses
let permanentExpenses = JSON.parse(localStorage.getItem('permanentExpenses')) || [];

function addCustomExpenseWithActions() {
  const newCustomExpenseDiv = document.createElement('div');
  newCustomExpenseDiv.className = 'grid';
  
  newCustomExpenseDiv.innerHTML = `
    <div>
      <label for="customExpenseName${customExpenseCount}">Expense Name</label>
      <input type="text" id="customExpenseName${customExpenseCount}" name="customExpenseName${customExpenseCount}" placeholder="e.g. Gym" />
    </div>
    <div>
      <label for="customExpenseAmount${customExpenseCount}">Amount</label>
      <input type="number" id="customExpenseAmount${customExpenseCount}" name="customExpenseAmount${customExpenseCount}" min="0" step="0.01" />
    </div>
    <div class="custom-expense-actions">
      <button type="button" class="make-permanent-btn" title="Make Permanent">
        <i class="fas fa-thumbtack"></i>
      </button>
      <button type="button" class="delete-permanent-btn" title="Delete Permanent">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  `;

  customExpensesContainer.appendChild(newCustomExpenseDiv);

  // Add event listeners for permanent and delete buttons
  const makePermanentBtn = newCustomExpenseDiv.querySelector('.make-permanent-btn');
  const deletePermanentBtn = newCustomExpenseDiv.querySelector('.delete-permanent-btn');
  const nameInput = newCustomExpenseDiv.querySelector(`#customExpenseName${customExpenseCount}`);
  
  makePermanentBtn.addEventListener('click', () => {
    const expenseName = nameInput.value.trim();
    if (expenseName && !permanentExpenses.includes(expenseName)) {
      permanentExpenses.push(expenseName);
      localStorage.setItem('permanentExpenses', JSON.stringify(permanentExpenses));
      alert(`${expenseName} added to permanent expenses!`);
    }
  });

  deletePermanentBtn.addEventListener('click', () => {
    const expenseName = nameInput.value.trim();
    permanentExpenses = permanentExpenses.filter(name => name !== expenseName);
    localStorage.setItem('permanentExpenses', JSON.stringify(permanentExpenses));
    alert(`${expenseName} removed from permanent expenses!`);
  });

  customExpenseCount++;
}

// Replace the existing add custom expense functionality
addCustomExpenseBtn.addEventListener('click', addCustomExpenseWithActions);

// Load permanent expenses on form load
document.addEventListener('DOMContentLoaded', () => {
  permanentExpenses.forEach(() => {
    addCustomExpenseWithActions();
  });
});

form.addEventListener('submit', function (e) {
  e.preventDefault();

  // Get all form data
  const salary = parseFloat(form.salary.value) || 0;
  const expenses = {
    groceries: parseFloat(form.groceries.value) || 0,
    households: parseFloat(form.households.value) || 0,
    healthcare: parseFloat(form.healthcare.value) || 0,
    travelling: parseFloat(form.travelling.value) || 0,
    education: parseFloat(form.education.value) || 0,
  };

  // Calculate total expenses
  const regularExpensesTotal = Object.values(expenses).reduce((sum, value) => sum + value, 0);

  // Handle custom expenses
  const customExpenses = [];
  for (let i = 0; i < customExpenseCount; i++) {
    const nameInput = form[`customExpenseName${i}`];
    const amountInput = form[`customExpenseAmount${i}`];
    if (nameInput && amountInput) {
      const name = nameInput.value.trim();
      const amount = parseFloat(amountInput.value) || 0;
      if (name && amount > 0) {
        customExpenses.push({ name, amount });
      }
    }
  }

  // Calculate custom expenses total
  const customExpensesTotal = customExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Create transaction object with totals
  const transaction = {
    id: Date.now(),
    date: form.transactionDate.value,
    salary,
    expenses,
    regularExpensesTotal,
    customExpenses,
    customExpensesTotal,
    totalExpenses: regularExpensesTotal + customExpensesTotal,
    remainingAmount: salary - (regularExpensesTotal + customExpensesTotal)
  };

  // Save to localStorage
  let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
  transactions.push(transaction);
  localStorage.setItem('transactions', JSON.stringify(transactions));

  // Show success message with transaction summary
  const message = `
    Transaction Added Successfully!
    Total Expenses: ₹${transaction.totalExpenses.toFixed(2)}
    Remaining Amount: ₹${transaction.remainingAmount.toFixed(2)}
  `;
  alert(message);

  // Reset form and custom expenses
  form.reset();
  resetCustomExpenses();
});

function resetCustomExpenses() {
  customExpensesContainer.innerHTML = `
    <div class="grid">
      <div>
        <label for="customExpenseName0">Expense Name</label>
        <input type="text" id="customExpenseName0" name="customExpenseName0" placeholder="e.g. Gym" />
      </div>
      <div>
        <label for="customExpenseAmount0">Amount</label>
        <input type="number" id="customExpenseAmount0" name="customExpenseAmount0" min="0" step="0.01" />
      </div>
      <div class="custom-expense-actions">
        <button type="button" class="make-permanent-btn" title="Make Permanent">
          <i class="fas fa-thumbtack"></i>
        </button>
        <button type="button" class="delete-permanent-btn" title="Delete Permanent">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
  `;
  customExpenseCount = 1;
}

// Modify salary handling
document.addEventListener('DOMContentLoaded', () => {
  // Load last salary
  const lastTransaction = JSON.parse(localStorage.getItem('transactions') || '[]').pop();
  if (lastTransaction) {
    salaryInput.value = lastTransaction.salary;
  }

  // Load permanent expenses
  loadPermanentExpenses();
});

// Replace alert messages with status messages
function showMessage(message, type = 'success') {
  const messageElement = document.getElementById('salaryMessage');
  messageElement.textContent = message;
  messageElement.className = `status-message ${type}`;
  
  // Auto hide after 3 seconds
  setTimeout(() => {
    messageElement.style.opacity = '0';
  }, 3000);
}

// Update add bonus functionality
addToSalaryBtn.addEventListener('click', () => {
  const currentSalary = parseFloat(salaryInput.value) || 0;
  const bonusAmount = parseFloat(document.getElementById('bonusAmount').value) || 0;
  
  if (bonusAmount > 0) {
    salaryInput.value = (currentSalary + bonusAmount).toFixed(2);
    document.getElementById('bonusAmount').value = '';
    showMessage(`Added bonus: ₹${bonusAmount.toFixed(2)}`);
  } else {
    showMessage('Please enter a valid bonus amount', 'error');
  }
});

// Update permanent expense handlers
function addPermanentExpense(expenseName) {
  const permanentExpensesSection = document.getElementById('permanentExpensesSection');
  const container = document.getElementById('permanentExpensesContainer');
  
  const expenseDiv = document.createElement('div');
  expenseDiv.className = 'permanent-expense-item';
  expenseDiv.innerHTML = `
    <div class="permanent-expense-name">
      <i class="fas fa-star"></i>
      <span class="permanent-text">${expenseName}</span>
    </div>
    <button type="button" class="remove-permanent-btn" title="Remove Permanent">
      <i class="fas fa-times"></i>
    </button>
  `;

  container.appendChild(expenseDiv);
  permanentExpensesSection.style.display = 'block';

  // Add remove functionality
  expenseDiv.querySelector('.remove-permanent-btn').addEventListener('click', () => {
    permanentExpenses = permanentExpenses.filter(name => name !== expenseName);
    localStorage.setItem('permanentExpenses', JSON.stringify(permanentExpenses));
    expenseDiv.remove();
    if (container.children.length === 0) {
      permanentExpensesSection.style.display = 'none';
    }
  });
}

function loadPermanentExpenses() {
  permanentExpenses.forEach(addPermanentExpense);
}

// Update make permanent functionality
makePermanentBtn.addEventListener('click', () => {
  const expenseName = nameInput.value.trim();
  if (expenseName && !permanentExpenses.includes(expenseName)) {
    permanentExpenses.push(expenseName);
    localStorage.setItem('permanentExpenses', JSON.stringify(permanentExpenses));
    addPermanentExpense(expenseName);
  }
});

// Update form submit handler
form.addEventListener('submit', function(e) {
  e.preventDefault();
  showMessage('Transaction added successfully!');
  form.reset();
  resetCustomExpenses();
});