let prospects = JSON.parse(localStorage.getItem('prospects')) || [];
const statusColors = {
    'New': '#007bff',
    'Contacted': '#ffc107',
    'Presented': '#6f42c1',
    'FollowUp': '#fd7e14',
    'Purchased': '#28a745'
};

function saveProspects() {
    localStorage.setItem('prospects', JSON.stringify(prospects));
}

function addProspect(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const nextAction = document.getElementById('nextAction').value;
    const nextActionDate = document.getElementById('nextActionDate').value;
    const notes = document.getElementById('notes').value;

    const newProspect = {
        id: Date.now().toString(),
        name,
        nextAction,
        nextActionDate,
        notes,
        status: 'New'
    };

    prospects.push(newProspect);
    saveProspects();
    document.getElementById('prospectForm').reset();
    document.getElementById('addProspectForm').classList.add('hidden');
    renderProspects();
}

function updateProspectStatus(id, newStatus) {
    prospects = prospects.map(p => 
        p.id === id ? { ...p, status: newStatus } : p
    );
    saveProspects();
    renderProspects();
}

function deleteProspect(id) {
    prospects = prospects.filter(p => p.id !== id);
    saveProspects();
    renderProspects();
}

function editProspect(id) {
    const prospect = prospects.find(p => p.id === id);
    if (prospect) {
        document.getElementById('name').value = prospect.name;
        document.getElementById('nextAction').value = prospect.nextAction;
        document.getElementById('nextActionDate').value = prospect.nextActionDate;
        document.getElementById('notes').value = prospect.notes;
        document.getElementById('addProspectForm').classList.remove('hidden');
        document.getElementById('prospectForm').onsubmit = (event) => {
            event.preventDefault();
            prospect.name = document.getElementById('name').value;
            prospect.nextAction = document.getElementById('nextAction').value;
            prospect.nextActionDate = document.getElementById('nextActionDate').value;
            prospect.notes = document.getElementById('notes').value;
            saveProspects();
            renderProspects();
            document.getElementById('prospectForm').reset();
            document.getElementById('addProspectForm').classList.add('hidden');
            document.getElementById('prospectForm').onsubmit = addProspect;
        };
    }
}

function renderProspects() {
    const activeTab = document.querySelector('.tab.active').dataset.status;
    const filteredProspects = prospects.filter(p => p.status === activeTab);
    const prospectsList = document.getElementById('prospectsList');
    prospectsList.innerHTML = '';

    filteredProspects.forEach((prospect, index) => {
        const prospectCard = document.createElement('div');
        prospectCard.className = 'prospect-card';
        prospectCard.style.opacity = '0';
        prospectCard.style.transform = 'translateY(20px)';
        prospectCard.innerHTML = `
            <h3>${prospect.name}</h3>
            <p>Next Action: ${prospect.nextAction}</p>
            <p>Date: ${prospect.nextActionDate}</p>
            <p>Notes: ${prospect.notes}</p>
            <select onchange="updateProspectStatus('${prospect.id}', this.value)">
                ${Object.keys(statusColors).map(status => 
                    `<option value="${status}" ${status === prospect.status ? 'selected' : ''}>${status}</option>`
                ).join('')}
            </select>
            <div class="prospect-actions">
                <button onclick="editProspect('${prospect.id}')">Edit</button>
                <button onclick="deleteProspect('${prospect.id}')">Delete</button>
            </div>
        `;
        prospectsList.appendChild(prospectCard);
      setTimeout(() => {
            prospectCard.style.transition = 'opacity 0.5s, transform 0.5s';
            prospectCard.style.opacity = '1';
            prospectCard.style.transform = 'translateY(0)';
        }, index * 100); // Stagger the animations
    });
}

document.getElementById('addProspectBtn').addEventListener('click', () => {
    document.getElementById('addProspectForm').classList.toggle('hidden');
});

document.getElementById('prospectForm').addEventListener('submit', addProspect);

document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        renderProspects();
    });
});

renderProspects();
