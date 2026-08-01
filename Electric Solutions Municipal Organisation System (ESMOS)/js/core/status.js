function updateBillStatus() {
  const statusEl = document.getElementById('billStatus');
  const amountEl = document.getElementById('billAmount');
  const payBtn = document.getElementById('payButton');

  if (!statusEl || !payBtn) return;

  const status = statusEl.dataset.status || 'pending';

  statusEl.classList.remove('paid', 'pending', 'overdue');
  amountEl?.classList.remove('strike', 'text-red', 'text-orange', 'text-grey');
  payBtn.classList.remove('paid-button', 'green-button', 'disabled');
  payBtn.disabled = false;
  payBtn.style.display = 'inline-block';

  if (status === 'paid') {
    statusEl.classList.add('paid');
    statusEl.textContent = 'Status: PAID';
    amountEl.classList.add('strike', 'text-grey');
    payBtn.textContent = 'Paid';
    payBtn.classList.add('paid-button');
    payBtn.disabled = true;
  } else if (status === 'overdue') {
    statusEl.classList.add('overdue');
    statusEl.textContent = 'Status: Overdue';
    amountEl.classList.add('text-red');
    payBtn.textContent = 'Pay Now';
    payBtn.classList.add('green-button');
    payBtn.onclick = () => loadPage('payment');
  } else if (status === 'pending') {
    statusEl.classList.add('pending');
    statusEl.textContent = 'Status: Pending';
    amountEl.classList.add('text-orange');
    payBtn.textContent = 'Pay Now';
    payBtn.classList.add('green-button');
    payBtn.onclick = () => loadPage('payment');
  } else {
    payBtn.style.display = 'none';
  }
}

// Alias for backward compatibility
const applyBillStatusLogic = updateBillStatus;

document.addEventListener('DOMContentLoaded', updateBillStatus);

export { updateBillStatus, applyBillStatusLogic };
