document.addEventListener("DOMContentLoaded", () => {
  const isTransactionPage = window.location.pathname.includes('transaction-');
  
  if (isTransactionPage) {
    import('./transaction.js').then(module => {
      module.renderTransactionGauges();
    });
    import('./charts.js').then(module => {
      module.renderSummaryChart();
      module.renderUsageBreakdownChart(312.5, 600, 15, 40, 150, 500);
    });
    import('./status.js').then(module => {
      module.updateBillStatus();
    });
  } else {
    import('./charts.js').then(module => {
      module.renderCharts();
    });
  }
});

// === Light/Dark Theme Toggle ===
function applySavedTheme() {
  const theme = localStorage.getItem("theme");
  if (theme === "light") {
    document.body.classList.add("light-mode");
  }
}

function toggleTheme() {
  document.body.classList.toggle("light-mode");
  const newTheme = document.body.classList.contains("light-mode") ? "light" : "dark";
  localStorage.setItem("theme", newTheme);

  // Re-render all charts so they pick up new font color
  if (window.renderAreaChart) renderAreaChart();
  if (window.renderSummaryChart) renderSummaryChart();
  if (window.renderBreakdownChart) renderBreakdownChart();
  if (window.renderPowerSavingsChart) renderPowerSavingsChart();
}

document.addEventListener("DOMContentLoaded", applySavedTheme);