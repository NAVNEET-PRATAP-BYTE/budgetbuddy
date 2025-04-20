function calculateTotals(transactions) {
  let totalExpenses = 0;
  let totalSalary = 0;
  let expenseCategories = {
    groceries: 0,
    households: 0,
    healthcare: 0,
    travelling: 0,
    education: 0
  };

  transactions.forEach(tx => {
    totalSalary += tx.salary || 0;
    
    // Sum regular expenses
    for (const key in tx.expenses) {
      totalExpenses += tx.expenses[key] || 0;
      expenseCategories[key] += tx.expenses[key] || 0;
    }

    // Sum custom expenses
    if (tx.customExpenses && Array.isArray(tx.customExpenses)) {
      tx.customExpenses.forEach(ce => {
        totalExpenses += ce.amount || 0;
        if (expenseCategories[ce.name]) {
          expenseCategories[ce.name] += ce.amount;
        } else {
          expenseCategories[ce.name] = ce.amount;
        }
      });
    }
  });

  return { totalExpenses, totalSalary, expenseCategories };
}

function renderTransactions(transactions) {
  const tbody = document.getElementById('transactionsTableBody');
  tbody.innerHTML = '';

  transactions.forEach(tx => {
    const tr = document.createElement('tr');
    
    // Date column
    const dateTd = document.createElement('td');
    dateTd.textContent = tx.date;
    dateTd.className = 'font-medium text-lg'; // Added text weight and size
    tr.appendChild(dateTd);

    // Salary column
    const salaryTd = document.createElement('td');
    salaryTd.textContent = `₹${tx.salary.toFixed(2)}`;
    salaryTd.className = 'expense-amount font-semibold text-lg'; // Added text weight and size
    tr.appendChild(salaryTd);

    // Expenses column (only total)
    const expensesTd = document.createElement('td');
    let totalExpense = 0;
    for (const key in tx.expenses) {
      totalExpense += tx.expenses[key] || 0;
    }
    expensesTd.textContent = `₹${totalExpense.toFixed(2)}`;
    expensesTd.className = 'expense-amount font-semibold text-lg'; // Added text weight and size
    tr.appendChild(expensesTd);

    // Custom Expenses column (only total)
    const customExpenseTd = document.createElement('td');
    customExpenseTd.className = 'expense-amount font-semibold text-lg'; // Added text weight and size
    if (tx.customExpenses && Array.isArray(tx.customExpenses) && tx.customExpenses.length > 0) {
      const customTotal = tx.customExpenses.reduce((sum, ce) => sum + ce.amount, 0);
      customExpenseTd.textContent = `₹${customTotal.toFixed(2)}`;
    } else {
      customExpenseTd.textContent = '-';
    }
    tr.appendChild(customExpenseTd);

    // Actions column
    const actionsTd = document.createElement('td');
    actionsTd.className = 'text-center flex justify-center items-center gap-6 py-2'; // Added flex and gap
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'bg-red-100 text-red-600 hover:bg-red-200 p-2 rounded-full transition-all duration-300'; // Styled button
    deleteBtn.innerHTML = '<i class="fas fa-trash-alt text-lg"></i>'; // Increased icon size
    deleteBtn.title = 'Delete Transaction';
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteTransaction(tx.id);
    });
    
    const viewGraphLink = document.createElement('a');
    viewGraphLink.href = `../Summary/summary.html?id=${tx.id}`;
    viewGraphLink.className = 'bg-blue-100 text-blue-600 hover:bg-blue-200 p-2 rounded-full transition-all duration-300'; // Styled button
    viewGraphLink.innerHTML = '<i class="fas fa-chart-bar text-lg"></i>'; // Increased icon size
    viewGraphLink.title = 'View Graph';
    
    actionsTd.appendChild(deleteBtn);
    actionsTd.appendChild(viewGraphLink);
    tr.appendChild(actionsTd);

    tbody.appendChild(tr);

    // Details row
    const detailsTr = document.createElement('tr');
    detailsTr.className = 'details-row';
    detailsTr.style.display = 'none';

    const detailsTd = document.createElement('td');
    detailsTd.colSpan = 5;
    
    const detailsContent = document.createElement('div');
    detailsContent.className = 'p-4';
    
    // Create details table
    let detailsHTML = '<table class="details-table"><tbody>';
    
    // Regular expenses
    for (const key in tx.expenses) {
      if (tx.expenses[key] > 0) {
        detailsHTML += `
          <tr>
            <td class="font-semibold">${key.charAt(0).toUpperCase() + key.slice(1)}</td>
            <td class="text-right expense-amount">₹${tx.expenses[key].toFixed(2)}</td>
          </tr>
        `;
      }
    }
    
    // Custom expenses
    if (tx.customExpenses && Array.isArray(tx.customExpenses)) {
      tx.customExpenses.forEach(ce => {
        detailsHTML += `
          <tr>
            <td class="font-semibold">${ce.name}</td>
            <td class="text-right expense-amount">₹${ce.amount.toFixed(2)}</td>
          </tr>
        `;
      });
    }
    
    detailsHTML += '</tbody></table>';
    detailsContent.innerHTML = detailsHTML;
    detailsTd.appendChild(detailsContent);
    detailsTr.appendChild(detailsTd);
    tbody.appendChild(detailsTr);

    // Toggle details on row click
    tr.addEventListener('click', () => {
      const currentDisplay = detailsTr.style.display;
      detailsTr.style.display = currentDisplay === 'none' ? 'table-row' : 'none';
    });
  });
}

function deleteTransaction(id) {
  let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
  transactions = transactions.filter(tx => tx.id !== id);
  localStorage.setItem('transactions', JSON.stringify(transactions));
  updateDisplay();
}

function updateDisplay() {
  const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
  renderTransactions(transactions);
  const totals = calculateTotals(transactions);
  document.getElementById('totalExpenses').textContent = totals.totalExpenses.toFixed(2);
  const leftover = totals.totalSalary - totals.totalExpenses;
  document.getElementById('leftoverAmount').textContent = leftover.toFixed(2);
}

document.addEventListener('DOMContentLoaded', () => {
  updateDisplay();
});