const memberList = document.querySelector('#member-list');
const viewButtons = document.querySelectorAll('.view-button');
const statusMessage = document.querySelector('#directory-status');
let members = [];
let activeView = 'grid';

const membershipLabels = { 1: 'Member', 2: 'Silver', 3: 'Gold' };
const escapeHTML = (value = '') => String(value).replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
})[character]);

function renderMembers(view = activeView) {
  if (!memberList) return;
  activeView = view;
  memberList.className = view === 'list' ? 'member-list' : 'member-grid';
  memberList.innerHTML = members.map((member) => {
    const level = Number(member.membershipLevel);
    const label = membershipLabels[level] || 'Member';
    const website = /^https:\/\//i.test(member.website) ? member.website : `https://${member.website}`;
    return `<article class="member-card">
      <div class="member-image-wrap"><img class="member-image" src="images/${escapeHTML(member.image)}" alt="${escapeHTML(member.company)} logo" width="220" height="72" loading="lazy"></div>
      <div class="member-details">
        <div class="member-header"><h3>${escapeHTML(member.company)}</h3><span class="membership-badge membership-${level}">${label}</span></div>
        <p class="member-category">${escapeHTML(member.category)}</p>
        <p><strong>Address:</strong> ${escapeHTML(member.address)}</p>
        <p><strong>Phone:</strong> <a href="tel:${escapeHTML(member.phone.replace(/[^\d+]/g, ''))}">${escapeHTML(member.phone)}</a></p>
        <p><strong>Website:</strong> <a href="${escapeHTML(website)}" target="_blank" rel="noopener noreferrer">${escapeHTML(member.website)}</a></p>
        <p>${escapeHTML(member.description)}</p>
      </div>
    </article>`;
  }).join('');
  if (statusMessage) statusMessage.textContent = `${members.length} member businesses displayed in ${view} view.`;
  memberList.setAttribute('aria-busy', 'false');
}

async function loadMembers() {
  if (!memberList) return;
  try {
    const response = await fetch('data/members.json');
    if (!response.ok) throw new Error(`Member data request failed: ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data)) throw new TypeError('Member data must be an array.');
    members = data;
    renderMembers(activeView);
  } catch (error) {
    console.error('Unable to load chamber members:', error);
    memberList.setAttribute('aria-busy', 'false');
    memberList.innerHTML = '<p class="member-empty">Member information is temporarily unavailable. Please try again later.</p>';
  }
}

viewButtons.forEach((button) => button.addEventListener('click', () => {
  viewButtons.forEach((item) => {
    const selected = item === button;
    item.classList.toggle('active', selected);
    item.setAttribute('aria-pressed', String(selected));
  });
  renderMembers(button.dataset.view === 'list' ? 'list' : 'grid');
}));
loadMembers();
