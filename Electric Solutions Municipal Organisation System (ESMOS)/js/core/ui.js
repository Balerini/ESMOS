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

function scrollToTop() {
  const app = document.querySelector('.app');
  if (app) app.scrollTo({ top: 0, behavior: 'smooth' });
}

// === Footer Navigation Events ===
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function () {
      const page = this.querySelector('p').textContent.toLowerCase();
      loadPage(page, this);
    });
  });
});

// Export functions for use in other modules
export { setActive, scrollToTop };
