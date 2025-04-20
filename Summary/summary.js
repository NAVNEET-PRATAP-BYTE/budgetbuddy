function calculatePercentages(data) {
    const total = Object.values(data).reduce((sum, value) => sum + value, 0);
    return Object.entries(data).map(([category, amount]) => ({
      category,
      amount,
      percentage: total > 0 ? ((amount / total) * 100).toFixed(1) : 0,
    })).sort((a, b) => b.amount - a.amount);
  }
  
  function renderExpenseTable(data) {
    const tbody = document.getElementById('expenseDetailsTable');
    const expenses = calculatePercentages(data);
  
    tbody.innerHTML = expenses.map(expense => `
      <tr>
        <td>${expense.category}</td>
        <td>₹${expense.amount.toFixed(2)}</td>
        <td>${expense.percentage}%</td>
      </tr>
    `).join('');
  }
  
  function renderChart(data) {
    const ctx = document.getElementById('expensesChart').getContext('2d');
    const labels = Object.keys(data);
    const amounts = Object.values(data);
  
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Expenses Amount',
          data: amounts,
          backgroundColor: 'rgba(16, 185, 129, 0.7)',
          borderColor: 'rgba(16, 185, 129, 1)',
          borderWidth: 1,
        }],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  
    renderExpenseTable(data);
  }
  
  function aggregateExpenses(transactions) {
    const totals = {
      Groceries: 0,
      Households: 0,
      Healthcare: 0,
      Travelling: 0,
      Education: 0,
    };
  
    transactions.forEach(tx => {
      totals.Groceries += tx.expenses.groceries || 0;
      totals.Households += tx.expenses.households || 0;
      totals.Healthcare += tx.expenses.healthcare || 0;
      totals.Travelling += tx.expenses.travelling || 0;
      totals.Education += tx.expenses.education || 0;
  
      if (tx.customExpenses && Array.isArray(tx.customExpenses)) {
        tx.customExpenses.forEach(ce => {
          if (totals[ce.name]) {
            totals[ce.name] += ce.amount;
          } else {
            totals[ce.name] = ce.amount;
          }
        });
      }
    });
  
    return totals;
  }
  
  function renderSingleTransactionChart(transaction) {
    // Clear any existing chart
    const chartElement = document.getElementById('expensesChart');
    if (Chart.getChart(chartElement)) {
      Chart.getChart(chartElement).destroy();
    }
  
    const data = {};
    
    // Add regular expenses
    for (const key in transaction.expenses) {
      if (transaction.expenses[key] > 0) {
        const category = key.charAt(0).toUpperCase() + key.slice(1);
        data[category] = transaction.expenses[key];
      }
    }
  
    // Add custom expenses
    if (transaction.customExpenses && Array.isArray(transaction.customExpenses)) {
      transaction.customExpenses.forEach(ce => {
        data[ce.name] = ce.amount;
      });
    }
  
    const ctx = chartElement.getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(data),
        datasets: [{
          label: `Expenses for ${transaction.date}`,
          data: Object.values(data),
          backgroundColor: 'rgba(4, 120, 87, 0.7)',
          borderColor: 'rgba(4, 120, 87, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Amount (₹)'
            }
          }
        }
      }
    });
  
    // Update expense table
    renderExpenseTable(data);
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
  
    if (id) {
      const transaction = transactions.find(tx => tx.id.toString() === id);
      if (transaction) {
        renderSingleTransactionChart(transaction);
      }
    } else {
      const aggregated = aggregateExpenses(transactions);
      renderChart(aggregated);
    }
  });