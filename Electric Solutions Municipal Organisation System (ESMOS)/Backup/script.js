// Tab Activation Logic
function setActive(el, tab) {
  document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
  if (el) el.classList.add('active');

  const iconMap = {
    home: ["icon-home", "HomeIcon"],
    billing: ["icon-billing", "BillingIcon"],
    usage: ["icon-electricity", "ElectricityIcon"],
    setting: ["icon-setting", "Setting"]
  };

  for (const key in iconMap) {
    const [id, base] = iconMap[key];
    const icon = document.getElementById(id);
    if (icon) {
      const filled = key === tab ? "-Filled" : "";
      icon.src = `img/${base}${filled}.png`;
    }
  }
}

// Smart Page Loader
function loadPage(pageName, el) {
  const path = pageName.startsWith('transaction-')
    ? `pages/transactions/${pageName}.html`
    : `pages/${pageName}.html`;

  fetch(path)
    .then(res => res.text())
    .then(html => {
      document.querySelector('.app').innerHTML = html;
      setActive(el, pageName);

      setTimeout(() => {
        renderCharts();          // ✅ Make sure this is here
        applyBillStatusLogic();  // ✅ As fixed before
      }, 100);
    });
}

// Pull-to-refresh
const app = document.querySelector('.app');
let startY = null, isPulling = false, refreshing = false;
const spinner = document.getElementById('refreshSpinner');

if (app) {
  app.addEventListener('touchstart', e => {
    if (app.scrollTop === 0 && !refreshing) {
      startY = e.touches[0].clientY;
      isPulling = true;
    }
  });

  app.addEventListener('touchmove', e => {
    if (!isPulling || startY === null) return;
    const diff = e.touches[0].clientY - startY;
    if (diff > 60) triggerRefresh();
  });

  app.addEventListener('touchend', () => {
    startY = null;
    isPulling = false;
  });
}

function triggerRefresh() {
  refreshing = true;
  if (spinner) spinner.classList.add('active');
  setTimeout(() => {
    if (spinner) spinner.classList.remove('active');
    refreshing = false;
  }, 1000);
}

// Drag scroll for desktop
if (app) {
  let isDragging = false, mouseStartY = 0, scrollTop = 0;
  app.addEventListener('mousedown', e => {
    isDragging = true;
    mouseStartY = e.clientY;
    scrollTop = app.scrollTop;
    app.style.cursor = 'grabbing';
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
    app.style.cursor = 'default';
  });

  document.addEventListener('mousemove', e => {
    if (isDragging) {
      const diff = e.clientY - mouseStartY;
      app.scrollTop = scrollTop - diff;
    }
  });
}

// Main render handler
function renderCharts() {
  renderAreaChart();  // Breakdown per Area chart
  renderSummaryChart();  // Summary chart
  renderGaugeChart("gaugeElectricity", 312.5, 600, "#FF4B4B");
  renderGaugeChart("gaugeWater", 15, 40, "#57A5F6");
  renderGaugeChart("gaugeGas", 150, 500, "#00FF99");
  renderDailyUsageChart();  // Add this function call for Daily Usage chart
  renderUsageBreakdownChart(312.5, 600, 15, 40, 150, 500);  // Breakdown chart
  renderSavingsChart();  // Power savings chart
}

function renderAreaChart() {
  const ctx = document.getElementById('areaChart');
  if (!ctx) return;
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Living Room', 'Johnâ€™s Room', 'Master Room', 'Rented Room', 'Kitchen'],
      datasets: [{
        data: [42, 18, 47, 28, 21],
        backgroundColor: ['#FF5E5E', '#A3A3FF', '#FF9E4B', '#4BC0C0', '#B2FF66'],
        borderRadius: 8,
        barThickness: 28
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        y: { ticks: { color: '#fff' }, grid: { color: '#333' }},
        x: { ticks: { color: '#fff' }, grid: { display: false }}
      }
    }
  });
}

function renderDailyUsageChart() {
  const ctx = document.getElementById('dailyUsageChart');
  if (!ctx) return;
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'kWh Used',
        data: [11.2, 12.7, 9.5, 13.8, 12.0, 10.6, 14.3],
        borderColor: '#00FF99',
        backgroundColor: 'rgba(0, 255, 153, 0.2)',
        tension: 0.3,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        y: { ticks: { color: '#fff' }, grid: { color: '#333' }},
        x: { ticks: { color: '#fff' }, grid: { display: false }}
      }
    }
  });
}

function renderSavingsChart() {
  const ctx = document.getElementById('savingsChart');
  if (!ctx) return;

  const labels = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
  const actualSavings = [10.2, 11.4, 9.8, 10.0, 11.1, 9.6, 10.5, 12.2, 11.7, 10.8, 12.0, 13.2];
  const predictedSavings = [9.5, 10.0, 10.5, 10.3, 11.0, 10.2, 10.8, 11.6, 11.9, 11.3, 12.2, 13.5];
  const areaAverage =     [8.8, 9.7, 9.4, 9.6, 10.2, 9.8, 10.0, 11.0, 10.9, 10.5, 11.3, 11.9];

  const barColors = labels.map((_, idx) =>
    idx === labels.length - 1 ? '#FFD700' : '#4BC0C0'
  );

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          type: 'line',
          label: 'Predicted Savings',
          data: predictedSavings,
          borderColor: '#FFA500',
          borderWidth: 2,
          fill: false,
          tension: 0.3,
          pointRadius: 4,
          order: 2
        },
        {
          type: 'line',
          label: 'Area Average',
          data: areaAverage,
          borderColor: '#8884FF',
          borderWidth: 2,
          borderDash: [4, 4],
          fill: false,
          tension: 0.3,
          pointRadius: 4,
          order: 3
        },
        {
          type: 'bar',
          label: 'Actual Savings (kWh)',
          data: actualSavings,
          backgroundColor: barColors,
          borderRadius: 6,
          barThickness: 22,
          order: 1
        }
      ]
    },
    options: {
      plugins: {
        legend: {
          labels: { color: '#fff', font: { size: 12 } }
        },
        tooltip: { enabled: true }
      },
      scales: {
        y: {
          ticks: { color: '#fff' },
          grid: { color: '#333' }
        },
        x: {
          ticks: { color: '#fff' },
          grid: { display: false }
        }
      },
      onClick: (event, elements) => {
        if (elements.length > 0) {
          const index = elements[0].index;
          const months = ['april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december', 'january', 'february', 'march'];
          const target = months[index];
          loadPage(`transaction-${target}`);
        }
      }
    }
  });
}

function renderGaugeChart(id, used, total, color) {
  const canvas = document.getElementById(id);
  if (!canvas) return;

  new Chart(canvas, {
    type: "doughnut",
    data: {
      datasets: [{
        data: [used, total - used],
        backgroundColor: [color, "#2b2b2b"],
        borderWidth: 0,
        cutout: "70%",
        circumference: 180,
        rotation: 270
      }]
    },
    options: {
      responsive: false,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false }
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const isTransactionPage = window.location.pathname.includes('transaction-');

  if (isTransactionPage) {
    // Render gauges only for transaction detail pages
    renderTransactionGauges();
    renderSummaryChart();
    renderUsageBreakdownChart(312.5, 600, 15, 40, 150, 500);

    const currentBill = {
      amount: 123.00,
      status: statusEl?.dataset.status || "pending",
    };

    if (amountEl) amountEl.textContent = `$${currentBill.amount.toFixed(2)}`;
    statusEl?.classList.remove("paid", "pending", "overdue");
    amountEl?.classList.remove("strike");
    if (buttonEl) {
      buttonEl.disabled = false;
      buttonEl.classList.remove("disabled", "paid-button");
      buttonEl.textContent = "Pay Now";
    }

    if (currentBill.status === "paid") {
      statusEl?.classList.add("paid");
      amountEl?.classList.add("strike");
      if (buttonEl) {
        buttonEl.textContent = "Paid";
        buttonEl.disabled = true;
        buttonEl.classList.add("paid-button");
      }
    } else if (currentBill.status === "pending") {
      statusEl?.classList.add("pending");
    } else if (currentBill.status === "overdue") {
      statusEl?.classList.add("overdue");
    }
  } else {
    // Homepage or other sections
    renderAreaChart();
    renderDailyUsageChart();
    renderSavingsChart();
  }
});

function renderSummaryChart() {
  const ctx = document.getElementById("summaryChart");
  if (!ctx) return;

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Electricity", "Water", "Gas"],
      datasets: [{
        data: [312.5, 15, 150],
        backgroundColor: ["#FF4B4B", "#57A5F6", "#00FF99"],
        borderRadius: 8,
        barThickness: 40
      }]
    },
    options: {
      plugins: {
        legend: { display: false },
        tooltip: { enabled: true }
      },
      scales: {
        y: {
          ticks: { color: "#fff" },
          grid: { color: "#444" }
        },
        x: {
          ticks: { color: "#fff" },
          grid: { display: false }
        }
      }
    }
  });
}

function renderTransactionGauges() {
  const match = window.location.pathname.match(/transaction-(\w+)\.html/);
  if (!match) return;
  const month = match[1];

  const usageMap = {
    march: { electricity: [312.5, 600], water: [15, 40], gas: [150, 500] },
    april: { electricity: [320, 600], water: [16, 40], gas: [145, 500] },
    // Add rest of months as needed
  };

  const data = usageMap[month];
  if (!data) return;

  renderGaugeChart('gaugeElectricity', data.electricity[0], data.electricity[1], '#FF4B4B');
  renderGaugeChart('gaugeWater', data.water[0], data.water[1], '#57A5F6');
  renderGaugeChart('gaugeGas', data.gas[0], data.gas[1], '#00FF99');
}

// Initial Load
window.addEventListener('DOMContentLoaded', () => {
  const defaultTab = document.querySelector('.nav-item.active');
  if (defaultTab) loadPage('home', defaultTab);
});

document.addEventListener("DOMContentLoaded", () => {
  // Gauges
  renderGaugeChart("gaugeElectricity", 312.5, 600, "#FF4B4B");
  renderGaugeChart("gaugeWater", 15, 40, "#57A5F6");
  renderGaugeChart("gaugeGas", 150, 500, "#00FF99");

  // Summary Chart
  const ctx = document.getElementById("summaryChart");
  if (ctx) {
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Electricity', 'Water', 'Gas'],
        datasets: [{
          label: 'Usage',
          data: [312.5, 15, 150],
          backgroundColor: ['#FF4B4B', '#57A5F6', '#00FF99'],
          borderRadius: 8,
          barThickness: 40
        }]
      },
      options: {
        plugins: {
          legend: { display: false },
          tooltip: { enabled: true },
          datalabels: {
            anchor: 'end',
            align: 'start',
            color: '#fff',
            font: { weight: 'bold' },
            formatter: value => value
          }
        },
        scales: {
          y: {
            ticks: { color: '#fff' },
            grid: { color: '#444' }
          },
          x: {
            ticks: { color: '#fff' },
            grid: { display: false }
          }
        }
      },
      plugins: [ChartDataLabels]
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const billStatusEl = document.getElementById("billStatus");
  const billAmountEl = document.getElementById("billAmount");
  const payButtonEl = document.getElementById("payButton");

  const currentStatus = billStatusEl?.dataset.status?.toLowerCase() || "paid";

  // Set Amount
  if (billAmountEl) {
    billAmountEl.textContent = "$123.00";
  }

  // Reset classes
  billStatusEl?.classList.remove("paid", "pending", "overdue");
  billAmountEl?.classList.remove("strike", "text-red", "text-orange", "text-grey");
  if (payButtonEl) {
    payButtonEl.classList.remove("paid-button", "green-button", "disabled");
    payButtonEl.disabled = false;
    payButtonEl.style.display = "inline-block";
  }

  // Apply styles based on status
  if (currentStatus === "paid") {
    billStatusEl?.classList.add("paid");
    billStatusEl.textContent = "Status: PAID";
    billAmountEl?.classList.add("strike", "text-grey");
    if (payButtonEl) {
      payButtonEl.textContent = "Paid";
      payButtonEl.disabled = true;
      payButtonEl.classList.add("paid-button");
    }
  } else if (currentStatus === "overdue") {
    billStatusEl?.classList.add("overdue");
    billStatusEl.textContent = "Status: Overdue";
    billAmountEl?.classList.add("text-red");
    if (payButtonEl) {
      payButtonEl.textContent = "Pay Now";
      payButtonEl.disabled = false;
      payButtonEl.classList.add("green-button");
      payButtonEl.onclick = () => loadPage("payment");
    }
  } else if (currentStatus === "pending") {
    billStatusEl?.classList.add("pending");
    billStatusEl.textContent = "Status: Pending";
    billAmountEl?.classList.add("text-orange");
    if (payButtonEl) {
      payButtonEl.textContent = "Pay Now";
      payButtonEl.disabled = false;
      payButtonEl.classList.add("green-button");
      payButtonEl.onclick = () => loadPage("payment");
    }
  } else {
    if (payButtonEl) payButtonEl.style.display = "none";
  }
});

function renderUsageBreakdownChart(electricityUsed, electricityTotal, waterUsed, waterTotal, gasUsed, gasTotal) {
  const ctx = document.getElementById("usageBreakdownChart");
  if (!ctx) return;

  const data = {
    labels: ['Electricity', 'Water', 'Gas'],
    datasets: [{
      label: 'Used',
      data: [electricityUsed, waterUsed, gasUsed],
      backgroundColor: ['#FF4B4B', '#57A5F6', '#00FF99'],
      borderRadius: 10,
      barThickness: 24
    }]
  };

  const options = {
    indexAxis: 'y',
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.raw;
            const total = [electricityTotal, waterTotal, gasTotal][context.dataIndex];
            return `${value} of ${total}`;
          }
        }
      }
    },
    scales: {
      x: {
        max: Math.max(electricityTotal, waterTotal, gasTotal),
        ticks: { color: '#ccc' },
        grid: { color: '#333' }
      },
      y: {
        ticks: { color: '#fff' },
        grid: { display: false }
      }
    }
  };

  new Chart(ctx, {
    type: 'bar',
    data,
    options
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderSummaryChart();
  renderUsageBreakdownChart(312.5, 600, 15, 40, 150, 500);
});

// Summary Chart with values on top
function renderSummaryChart() {
  const ctx = document.getElementById("summaryChart");
  if (!ctx) return;

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Electricity", "Water", "Gas"],
      datasets: [{
        label: "Usage",
        data: [312.5, 15, 150],
        backgroundColor: ["#FF4B4B", "#57A5F6", "#00FF99"],
        borderRadius: 8,
        barThickness: 40
      }]
    },
    options: {
      plugins: {
        legend: { display: false },
        tooltip: { enabled: true },
        datalabels: {
          color: "#fff",
          anchor: "end",
          align: "start",
          font: { weight: "bold" },
          formatter: value => `${value}`
        }
      },
      scales: {
        y: { ticks: { color: "#fff" }, grid: { color: "#444" } },
        x: { ticks: { color: "#fff" }, grid: { display: false } }
      }
    },
    plugins: [ChartDataLabels]
  });
}

// Usage Breakdown chart replacing failed gauge
function renderUsageBreakdownChart(eUsed, eTotal, wUsed, wTotal, gUsed, gTotal) {
  const ctx = document.getElementById("usageBreakdownChart");
  if (!ctx) return;

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Electricity", "Water", "Gas"],
      datasets: [
        {
          label: "Used",
          data: [eUsed, wUsed, gUsed],
          backgroundColor: ["#FF4B4B", "#57A5F6", "#00FF99"],
          borderRadius: 6,
          barThickness: 20
        },
        {
          label: "Remaining",
          data: [eTotal - eUsed, wTotal - wUsed, gTotal - gUsed],
          backgroundColor: "#333",
          borderRadius: 6,
          barThickness: 20
        }
      ]
    },
    options: {
      indexAxis: "y",
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: true }
      },
      scales: {
        x: { stacked: true, ticks: { color: "#fff" }, grid: { color: "#444" } },
        y: { stacked: true, ticks: { color: "#fff" }, grid: { display: false } }
      }
    }
  });
}

function toggleTransactions() {
  const extras = document.querySelector('.extra-transactions');
  const button = document.querySelector('.show-more-btn');

  if (extras && button) {
    const isHidden = extras.style.display === 'none' || extras.style.display === '';
    extras.style.display = isHidden ? 'flex' : 'none';
    button.textContent = isHidden ? 'Show Less' : 'Show All';
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const isTransactionPage = window.location.pathname.includes('transaction-');

  if (isTransactionPage) {
    // Define data per month
    const usageMap = {
      january:   { amount: 110.00, status: "paid" },
      february:  { amount: 137.40, status: "pending" },
      march:     { amount: 123.00, status: "paid" },
      april:     { amount: 141.50, status: "overdue" },
      may:       { amount: 131.20, status: "pending" },
      june:      { amount: 149.10, status: "paid" },
      july:      { amount: 138.60, status: "overdue" },
      august:    { amount: 144.30, status: "pending" },
      september: { amount: 115.20, status: "paid" },
      october:   { amount: 129.80, status: "overdue" },
      november:  { amount: 120.50, status: "paid" },
      december:  { amount: 124.60, status: "pending" }
    };

    // Extract month from URL
    const match = window.location.pathname.match(/transaction-(\w+)\.html/);
    const month = match?.[1];

    if (!month || !usageMap[month]) return;

    const billStatusEl = document.getElementById("billStatus");
    const billAmountEl = document.getElementById("billAmount");
    const payButtonEl = document.getElementById("payButton");

    const { amount, status } = usageMap[month];

    // Apply values
    if (billAmountEl) billAmountEl.textContent = `$${amount.toFixed(2)}`;
    if (!billStatusEl || !payButtonEl) return;

    billStatusEl.classList.remove("paid", "pending", "overdue");
    billAmountEl.classList.remove("strike", "text-orange", "text-red", "text-grey");
    payButtonEl.classList.remove("paid-button", "green-button", "disabled");
    payButtonEl.disabled = false;
    payButtonEl.style.display = "inline-block";

    // Apply status-specific styles
    if (status === "paid") {
      billStatusEl.textContent = "Status: PAID";
      billStatusEl.classList.add("paid");
      billAmountEl.classList.add("strike", "text-grey");
      payButtonEl.textContent = "Paid";
      payButtonEl.disabled = true;
      payButtonEl.classList.add("paid-button");
    } else if (status === "pending") {
      billStatusEl.textContent = "Status: Pending";
      billStatusEl.classList.add("pending");
      billAmountEl.classList.add("text-orange");
      payButtonEl.textContent = "Pay Now";
      payButtonEl.classList.add("green-button");
      payButtonEl.onclick = () => loadPage("payment");
    } else if (status === "overdue") {
      billStatusEl.textContent = "Status: Overdue";
      billStatusEl.classList.add("overdue");
      billAmountEl.classList.add("text-red");
      payButtonEl.textContent = "Pay Now";
      payButtonEl.classList.add("green-button");
      payButtonEl.onclick = () => loadPage("payment");
    } else {
      payButtonEl.style.display = "none";
    }
  }
});

function applyBillStatusLogic() {
  const billStatusEl = document.getElementById("billStatus");
  const billAmountEl = document.getElementById("billAmount");
  const payButtonEl = document.getElementById("payButton");

  if (!billStatusEl || !billAmountEl || !payButtonEl) return;

  const currentStatus = billStatusEl.dataset.status?.toLowerCase() || "paid";

  billStatusEl.classList.remove("paid", "pending", "overdue");
  billAmountEl.classList.remove("strike", "text-orange", "text-red");
  payButtonEl.classList.remove("paid-button");
  payButtonEl.style.display = "inline-block";

  if (currentStatus === "paid") {
    billStatusEl.textContent = "Status: PAID";
    billStatusEl.classList.add("paid");
    billAmountEl.classList.add("strike", "text-grey");
    payButtonEl.disabled = true;
    payButtonEl.textContent = "Paid";
    payButtonEl.classList.add("paid-button");
  } else if (currentStatus === "pending") {
    billStatusEl.textContent = "Status: Pending";
    billStatusEl.classList.add("pending");
    billAmountEl.classList.add("text-orange");
    payButtonEl.disabled = false;
    payButtonEl.textContent = "Pay Now";
    payButtonEl.onclick = () => loadPage("payment");
  } else if (currentStatus === "overdue") {
    billStatusEl.textContent = "Status: Overdue";
    billStatusEl.classList.add("overdue");
    billAmountEl.classList.add("text-red");
    payButtonEl.disabled = false;
    payButtonEl.textContent = "Pay Now";
    payButtonEl.onclick = () => loadPage("payment");
  } else {
    payButtonEl.style.display = "none";
  }
}