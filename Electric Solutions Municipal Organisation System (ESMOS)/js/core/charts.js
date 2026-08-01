function renderCharts() {
  if (document.getElementById('areaChart')) renderAreaChart();
  if (document.getElementById('dailyUsageChart')) renderDailyUsageChart();
  if (document.getElementById('savingsChart')) renderSavingsChart();
  if (document.getElementById('summaryChart')) renderSummaryChart();
  if (document.getElementById('gaugeElectricity')) renderGaugeChart("gaugeElectricity", 312.5, 600, "#FF4B4B");
  if (document.getElementById('gaugeWater')) renderGaugeChart("gaugeWater", 15, 40, "#57A5F6");
  if (document.getElementById('gaugeGas')) renderGaugeChart("gaugeGas", 150, 500, "#00FF99");
  if (document.getElementById('usageBreakdownChart')) renderUsageBreakdownChart(312.5, 600, 15, 40, 150, 500);
  if (document.getElementById('predictiveChart')) renderPredictiveChart();
}

function renderPredictiveChart(){
  const fontColor = document.body.classList.contains('light-mode') ? '#111' : '#fff';
  const ctx = document.getElementById('predictiveChart');
  if (!ctx) return;
  axios.get("http://localhost:5001/predict/user1")  // Flask endpoint
  .then(response => {
    const predictionData = response.data;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Living Room', "John's Room", 'Master Room', 'Rented Room', 'Kitchen'],
        datasets: [{
          data: predictionData,
          backgroundColor: ['#FF5E5E', '#A3A3FF', '#FF9E4B', '#4BC0C0', '#B2FF66'],
          borderRadius: 8,
          barThickness: 28
        }]
      },
      options: {
        plugins: { legend: { display: false } },
        scales: {
          y: { ticks: { color: fontColor }, grid: { color: '#333' }},
          x: { ticks: { color: fontColor }, grid: { display: false }}
        }
      }
    });
  })
  .catch(error => {
    console.error("Failed to load predictive chart:", error);
  });

  /*
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Living Room', 'John\'s Room', 'Master Room', 'Rented Room', 'Kitchen'],
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
        y: { ticks: { color: fontColor }, grid: { color: '#333' }},
        x: { ticks: { color: fontColor }, grid: { display: false }}
      }
    }
  }); */
}


function renderAreaChart() {
  const fontColor = document.body.classList.contains('light-mode') ? '#111' : '#fff';
  const ctx = document.getElementById('areaChart');
  if (!ctx) return;
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Living Room', 'John\'s Room', 'Master Room', 'Rented Room', 'Kitchen'],
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
        y: { ticks: { color: fontColor }, grid: { color: '#333' }},
        x: { ticks: { color: fontColor }, grid: { display: false }}
      }
    }
  });
}

function renderDailyUsageChart() {
  const fontColor = document.body.classList.contains('light-mode') ? '#111' : '#fff';
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
        y: { ticks: { color: fontColor }, grid: { color: '#333' }},
        x: { ticks: { color: fontColor }, grid: { display: false }}
      }
    }
  });
}

function renderSavingsChart() {
  const ctx = document.getElementById('savingsChart');
  const fontColor = document.body.classList.contains('light-mode') ? '#111' : '#fff';
  if (!ctx) return;
  const labels = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
  const actualSavings = [10.2, 11.4, 9.8, 10.0, 11.1, 9.6, 10.5, 12.2, 11.7, 10.8, 12.0, 13.2];
  const predictedSavings = [9.5, 10.0, 10.5, 10.3, 11.0, 10.2, 10.8, 11.6, 11.9, 11.3, 12.2, 13.5];
  const areaAverage = [8.8, 9.7, 9.4, 9.6, 10.2, 9.8, 10.0, 11.0, 10.9, 10.5, 11.3, 11.9];
  const barColors = labels.map((_, idx) => idx === labels.length - 1 ? '#FFD700' : '#4BC0C0');
  
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
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
      }]
    },
    options: {
      plugins: {
        legend: {
          labels: { color: '#fff', font: { size: 12 } }
        },
        tooltip: { enabled: true }
      },
      scales: {
        y: { ticks: { color: fontColor }, grid: { color: '#333' }},
        x: { ticks: { color: fontColor }, grid: { display: false }}
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
const fontColor = document.body.classList.contains('light-mode') ? '#111' : '#fff';

function renderSummaryChart() {
  const ctx = document.getElementById("summaryChart");
  if (!ctx) return;
  
  const fontColor = document.body.classList.contains('light-mode') ? '#111' : '#fff';
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
        legend: {
          labels: { color: fontColor }
        },
        tooltip: { enabled: true }
      },
      scales: {
        y: {
          ticks: { color: fontColor },
          grid: { color: '#ccc' }
        },
        x: {
          ticks: { color: fontColor },
          grid: { display: false }
        }
      }
    }
  });
}

function renderGaugeChart(id, used, total, color) {
  const fontColor = document.body.classList.contains('light-mode') ? '#111' : '#fff';
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

function renderUsageBreakdownChart(electricityUsed, electricityTotal, waterUsed, waterTotal, gasUsed, gasTotal) {
  const fontColor = document.body.classList.contains('light-mode') ? '#111' : '#fff';
  const ctx = document.getElementById("usageBreakdownChart");
  if (!ctx) return;
  
  new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Electricity", "Water", "Gas"],
      datasets: [{
        data: [electricityUsed, waterUsed, gasUsed],
        backgroundColor: ["#FF4B4B", "#57A5F6", "#00FF99"],
        borderWidth: 0
      }]
    },
    options: {
      plugins: {
        legend: {
          position: "right",
          labels: { color: fontColor, font: { size: 14 } }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.raw || 0;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = Math.round((value / total) * 100);
              return `${label}: ${value} (${percentage}%)`;
            }
          }
        }
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", renderCharts);
