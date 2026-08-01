// === Tab Activation Logic ===
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
  } // Missing closing brace for the for loop
} // Missing closing brace for the setActive function

// === Smart Page Loader ===
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
        if (typeof renderCharts === "function") renderCharts();
        if (typeof applyBillStatusLogic === "function") applyBillStatusLogic();
      }, 100);
    })
    .catch(error => {
      console.error("Error loading page:", error);
      document.querySelector('.app').innerHTML = '<p>Error loading content. Please try again.</p>';
    });
}

// === Initial Load ===
window.addEventListener('DOMContentLoaded', () => {
  const defaultTab = document.querySelector('.nav-item.active');
  if (defaultTab) loadPage('home', defaultTab);
});
