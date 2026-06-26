const state = {
    bankIncome: '',
    zayyatSubs: '',
    flourSacks: '2',
    sackValue: '',
    transport: '',
    dailyCash: [],
    bakerySubs: [],
    gas: [],
    misc: []
};

function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

function loadState() {
    const saved = localStorage.getItem('bakeryStateV2');
    if (saved) {
        Object.assign(state, JSON.parse(saved));
    }
}

function saveState() {
    localStorage.setItem('bakeryStateV2', JSON.stringify(state));
    calculateAndRender();
}

function calculateAndRender() {
    document.getElementById('bank-income').value = state.bankIncome;
    document.getElementById('zayyat-subs').value = state.zayyatSubs;
    document.getElementById('flour-sacks').value = state.flourSacks;
    document.getElementById('sack-value').value = state.sackValue;
    document.getElementById('transport-cost').value = state.transport;

    const valBankIncome = parseFloat(state.bankIncome) || 0;
    document.getElementById('total-bank-income').textContent = valBankIncome.toFixed(2);

    const valZayyat = parseFloat(state.zayyatSubs) || 0;
    document.getElementById('total-zayyat-subs').textContent = valZayyat.toFixed(2);

    const valTransport = parseFloat(state.transport) || 0;
    document.getElementById('total-transport').textContent = valTransport.toFixed(2);

    const flourSavingsTotal = (parseFloat(state.flourSacks) || 0) * (parseFloat(state.sackValue) || 0);
    document.getElementById('total-flour-savings').textContent = flourSavingsTotal.toFixed(2);

    renderTable('daily-cash-table', state.dailyCash, ['date', 'amount'], true);
    const totalDailyCash = state.dailyCash.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    document.getElementById('total-daily-cash').textContent = totalDailyCash.toFixed(2);

    renderBakerySubsTable();
    const totalBakery = state.bakerySubs.filter(item => item.paid).reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    document.getElementById('total-bakery-subs').textContent = totalBakery.toFixed(2);

    renderGasTable();
    const totalGas = state.gas.reduce((sum, item) => sum + ((parseFloat(item.quantity) || 0) * (parseFloat(item.costPerTin) || 0)), 0);
    document.getElementById('total-gas').textContent = totalGas.toFixed(2);

    renderTable('misc-table', state.misc, ['date', 'desc', 'cost'], true);
    const totalMisc = state.misc.reduce((sum, item) => sum + (parseFloat(item.cost) || 0), 0);
    document.getElementById('total-misc').textContent = totalMisc.toFixed(2);

    const totalIncome = valBankIncome + valZayyat + flourSavingsTotal + totalDailyCash + totalBakery;
    const totalExpenses = valTransport + totalGas + totalMisc;
    
    const netProfit = totalIncome - totalExpenses;
    const partnerShare = netProfit / 2;

    document.getElementById('total-income').textContent = totalIncome.toFixed(2) + ' ج.م';
    document.getElementById('total-expenses').textContent = totalExpenses.toFixed(2) + ' ج.م';
    document.getElementById('net-profit').textContent = netProfit.toFixed(2) + ' ج.م';
    document.getElementById('partner-share').textContent = partnerShare.toFixed(2) + ' ج.م';
}

function renderTable(tableId, data, columns, hasDelete) {
    const tbody = document.querySelector(`#${tableId} tbody`);
    tbody.innerHTML = '';
    data.forEach(item => {
        const tr = document.createElement('tr');
        columns.forEach(col => {
            const td = document.createElement('td');
            td.textContent = item[col];
            tr.appendChild(td);
        });
        if (hasDelete) {
            const tdAction = document.createElement('td');
            const btn = document.createElement('button');
            btn.textContent = 'حذف';
            btn.className = 'btn-delete';
            btn.onclick = () => {
                const arrayName = getArrayNameByTableId(tableId);
                const index = state[arrayName].findIndex(i => i.id === item.id);
                if (index > -1) {
                    state[arrayName].splice(index, 1);
                    saveState();
                }
            };
            tdAction.appendChild(btn);
            tr.appendChild(tdAction);
        }
        tbody.appendChild(tr);
    });
}

function renderGasTable() {
    const tbody = document.querySelector('#gas-table tbody');
    tbody.innerHTML = '';
    state.gas.forEach(item => {
        const tr = document.createElement('tr');
        
        let td = document.createElement('td');
        td.textContent = item.date;
        tr.appendChild(td);
        
        td = document.createElement('td');
        td.textContent = item.quantity;
        tr.appendChild(td);

        td = document.createElement('td');
        td.textContent = item.costPerTin;
        tr.appendChild(td);

        td = document.createElement('td');
        const rowTotal = (parseFloat(item.quantity) || 0) * (parseFloat(item.costPerTin) || 0);
        td.textContent = rowTotal.toFixed(2);
        tr.appendChild(td);

        const tdAction = document.createElement('td');
        const btn = document.createElement('button');
        btn.textContent = 'حذف';
        btn.className = 'btn-delete';
        btn.onclick = () => {
            const index = state.gas.findIndex(i => i.id === item.id);
            if (index > -1) {
                state.gas.splice(index, 1);
                saveState();
            }
        };
        tdAction.appendChild(btn);
        tr.appendChild(tdAction);

        tbody.appendChild(tr);
    });
}

function renderBakerySubsTable() {
    const tbody = document.querySelector('#bakery-sub-table tbody');
    tbody.innerHTML = '';
    state.bakerySubs.forEach(item => {
        const tr = document.createElement('tr');
        
        let td = document.createElement('td');
        td.textContent = item.name;
        tr.appendChild(td);
        
        td = document.createElement('td');
        td.textContent = item.amount;
        tr.appendChild(td);

        td = document.createElement('td');
        td.textContent = item.date;
        tr.appendChild(td);

        td = document.createElement('td');
        td.className = 'checkbox-center';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = item.paid;
        checkbox.onchange = (e) => {
            item.paid = e.target.checked;
            saveState();
        };
        td.appendChild(checkbox);
        tr.appendChild(td);

        const tdAction = document.createElement('td');
        const btn = document.createElement('button');
        btn.textContent = 'حذف';
        btn.className = 'btn-delete';
        btn.onclick = () => {
            const index = state.bakerySubs.findIndex(i => i.id === item.id);
            if (index > -1) {
                state.bakerySubs.splice(index, 1);
                saveState();
            }
        };
        tdAction.appendChild(btn);
        tr.appendChild(tdAction);

        tbody.appendChild(tr);
    });
}

function getArrayNameByTableId(tableId) {
    const map = {
        'daily-cash-table': 'dailyCash',
        'misc-table': 'misc'
    };
    return map[tableId];
}

function attachListeners() {
    const singleInputs = [
        { id: 'bank-income', key: 'bankIncome' },
        { id: 'zayyat-subs', key: 'zayyatSubs' },
        { id: 'flour-sacks', key: 'flourSacks' },
        { id: 'sack-value', key: 'sackValue' },
        { id: 'transport-cost', key: 'transport' }
    ];

    singleInputs.forEach(input => {
        document.getElementById(input.id).addEventListener('input', (e) => {
            state[input.key] = e.target.value;
            saveState();
        });
    });

    document.getElementById('daily-cash-form').addEventListener('submit', (e) => {
        e.preventDefault();
        state.dailyCash.push({
            id: generateId(),
            date: document.getElementById('daily-cash-date').value,
            amount: document.getElementById('daily-cash-amount').value
        });
        e.target.reset();
        saveState();
    });

    document.getElementById('bakery-sub-form').addEventListener('submit', (e) => {
        e.preventDefault();
        state.bakerySubs.push({
            id: generateId(),
            name: document.getElementById('bakery-sub-name').value,
            amount: document.getElementById('bakery-sub-amount').value,
            date: document.getElementById('bakery-sub-date').value,
            paid: false
        });
        e.target.reset();
        saveState();
    });

    document.getElementById('gas-form').addEventListener('submit', (e) => {
        e.preventDefault();
        state.gas.push({
            id: generateId(),
            date: document.getElementById('gas-date').value,
            quantity: document.getElementById('gas-quantity').value,
            costPerTin: document.getElementById('gas-cost-per-tin').value
        });
        e.target.reset();
        saveState();
    });

    document.getElementById('misc-form').addEventListener('submit', (e) => {
        e.preventDefault();
        state.misc.push({
            id: generateId(),
            date: document.getElementById('misc-date').value,
            desc: document.getElementById('misc-desc').value,
            cost: document.getElementById('misc-cost').value
        });
        e.target.reset();
        saveState();
    });

    document.getElementById('btn-export-pdf').addEventListener('click', exportPDF);
    document.getElementById('btn-reset-data').addEventListener('click', resetData);
}

function exportPDF() {
    const element = document.getElementById('dashboard-content');
    element.classList.add('exporting');
    
    setTimeout(() => {
        const date = new Date();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const filename = `Bakery_Monthly_Report_${month}_${year}.pdf`;
        
        const opt = {
            margin:       0.5,
            filename:     filename,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true },
            jsPDF:        { unit: 'in', format: 'a3', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save().then(() => {
            element.classList.remove('exporting');
        });
    }, 100);
}

function resetData() {
    const isConfirmed = window.confirm('هل أنت متأكد أنك تريد مسح جميع البيانات لبدء شهر جديد؟ تأكد من تحميل ملف PDF أولاً!');
    if (isConfirmed) {
        localStorage.removeItem('bakeryStateV2');
        window.location.reload();
    }
}

function init() {
    loadState();
    attachListeners();
    calculateAndRender();
}

document.addEventListener('DOMContentLoaded', init);
