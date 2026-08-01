document.addEventListener("DOMContentLoaded", () => {
  const showMoreBtn = document.querySelector(".show-more-btn");
  const extraRows = document.querySelectorAll(".extra-transactions");

  if (showMoreBtn && extraRows.length) {
    showMoreBtn.addEventListener("click", () => {
      const isHidden = extraRows[0].classList.contains("hidden");

      extraRows.forEach(row => {
        row.classList.toggle("hidden", !isHidden);
      });

      showMoreBtn.textContent = isHidden ? "Show Less" : "Show All";
    });
  }
});

let isExpanded = false;

function toggleTransactions() {
  const extra = document.querySelector('.extra-transactions');
  const button = document.querySelector('.show-more-btn');

  if (!extra || !button) return;

  isExpanded = !isExpanded;

  extra.style.display = isExpanded ? 'flex' : 'none';
  button.textContent = isExpanded ? 'Show Less' : 'Show All';
}
