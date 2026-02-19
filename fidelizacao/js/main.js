// =============================================
// GRUTUR - SISTEMA DE FIDELIZAÇÃO
// Versão Google Sheets
// =============================================

// URL do Google Apps Script
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz61dhsq9NXu1SsTjbKZ7GoC-edUqbk6nLsGy9kU5GJsTG0bzR3QjWnwvKHymYbLNElg/exec';

// Sistema de Pontos
const PONTOS = {
    VIAGEM: 5,
    INDICACAO: 10,
    AMIGO_INDICADO: 10,
    PESQUISA: 5
};

// Tabela de Descontos
const DESCONTOS = [
    { pontos: 50,  desconto: 5 },
    { pontos: 100, desconto: 10 },
    { pontos: 150, desconto: 15 },
    { pontos: 200, desconto: 20 },
    { pontos: 250, desconto: 25 },
    { pontos: 300, desconto: 30 },
    { pontos: 500, desconto: 100, viagemGratis: true }
];

// Senha Admin
const ADMIN_PASSWORD = 'grutur2024';

// Estado das estrelas
const ratings = { general: 0, driver: 0, vehicle: 0, punctuality: 0, service: 0 };

// =============================================
// FUNÇÕES GOOGLE SHEET
// =============================================

async function sheetGet(params) {
    const url = GOOGLE_SCRIPT_URL + '?' + new URLSearchParams(params).toString();
    const res = await fetch(url);
    return await res.json();
}

async function sheetPost(data) {
    const res = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify(data)
    });
    return await res.json();
}

async function getCustomer(phone) {
    const result = await sheetGet({ action: 'getCustomer', telefone: phone });
    if (result.success) return result.cliente;
    return null;
}

// =============================================
// NAVEGAÇÃO
// =============================================
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        const section = this.getAttribute('data-section');
        if (section === 'admin') {
            openPasswordModal();
            return;
        }
        navigateTo(section);
    });
});

function navigateTo(sectionId) {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));

    const targetBtn = document.querySelector(`.nav-btn[data-section="${sectionId}"]`);
    const targetSection = document.getElementById(sectionId);

    if (targetBtn) targetBtn.classList.add('active');
    if (targetSection) targetSection.classList.add('active');

    if (sectionId === 'admin') {
        loadCustomers();
    }
}

// =============================================
// MODAL DE SENHA ADMIN
// =============================================
function openPasswordModal() {
    document.getElementById('passwordModal').style.display = 'block';
    document.getElementById('adminPassword').value = '';
    document.getElementById('passwordError').style.display = 'none';
    setTimeout(() => document.getElementById('adminPassword').focus(), 100);
}

function closePasswordModal() {
    document.getElementById('passwordModal').style.display = 'none';
}

function checkPassword() {
    const password = document.getElementById('adminPassword').value;
    if (password === ADMIN_PASSWORD) {
        closePasswordModal();
        navigateTo('admin');
    } else {
        document.getElementById('passwordError').style.display = 'block';
        document.getElementById('adminPassword').value = '';
        document.getElementById('adminPassword').focus();
    }
}

document.getElementById('passwordModal').addEventListener('click', function (e) {
    if (e.target === this) closePasswordModal();
});

// =============================================
// TABS ADMIN
// =============================================
function showTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));

    document.getElementById('tab-' + tabName).classList.add('active');
    event.currentTarget.classList.add('active');

    if (tabName === 'customer') {
        loadCustomers();
    }
}

// =============================================
// TOAST
// =============================================
function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast show' + (isError ? ' error' : '');
    setTimeout(() => { toast.className = 'toast'; }, 3500);
}

// =============================================
// ESTRELAS
// =============================================
document.querySelectorAll('.stars').forEach(starsEl => {
    const category = starsEl.id.replace('stars-', '');
    const stars = starsEl.querySelectorAll('.star');

    stars.forEach(star => {
        star.addEventListener('click', function () {
            const val = parseInt(this.getAttribute('data-value'));
            ratings[category] = val;
            updateStars(starsEl, val);
        });

        star.addEventListener('mouseenter', function () {
            const val = parseInt(this.getAttribute('data-value'));
            updateStars(starsEl, val);
        });
    });

    starsEl.addEventListener('mouseleave', function () {
        updateStars(starsEl, ratings[category] || 0);
    });
});

function updateStars(container, value) {
    container.querySelectorAll('.star').forEach((s, i) => {
        s.classList.toggle('active', i < value);
    });
}

// =============================================
// PESQUISA DE SATISFAÇÃO
// =============================================
document.getElementById('surveyForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const phone = document.getElementById('surveyPhone').value.trim();
    if (!phone) {
        showToast('Por favor, insira o número de telefone.', true);
        return;
    }

    if (!ratings.general && !ratings.driver && !ratings.vehicle && !ratings.punctuality && !ratings.service) {
        showToast('Por favor, faça pelo menos uma avaliação.', true);
        return;
    }

    try {
        const customer = await getCustomer(phone);
        if (!customer) {
            showToast('Cliente não encontrado. Peça ao administrador para o registar.', true);
            return;
        }

        const newPoints = parseInt(customer.pontos || 0) + PONTOS.PESQUISA;
        const newSurveys = parseInt(customer.pesquisas || 0) + 1;

        await sheetPost({
            action: 'updatePoints',
            telefone: phone,
            pontos: newPoints,
            viagens: customer.viagens || 0,
            indicacoes: customer.indicacoes || 0,
            pesquisas: newSurveys
        });

        showToast(`✅ Obrigado! Ganhou ${PONTOS.PESQUISA} pontos. Total: ${newPoints} pontos!`);

        this.reset();
        Object.keys(ratings).forEach(k => { ratings[k] = 0; });
        document.querySelectorAll('.stars').forEach(s => updateStars(s, 0));

    } catch (err) {
        console.error('Erro na pesquisa:', err);
        showToast('Erro ao enviar pesquisa. Tente novamente.', true);
    }
});

// =============================================
// CONSULTAR PONTOS
// =============================================
async function checkPoints() {
    const phone = document.getElementById('pointsPhone').value.trim();
    if (!phone) {
        showToast('Por favor, insira o número de telefone.', true);
        return;
    }

    try {
        const customer = await getCustomer(phone);
        if (!customer) {
            showToast('Cliente não encontrado.', true);
            document.getElementById('pointsResult').style.display = 'none';
            return;
        }
        displayPoints(customer);

    } catch (err) {
        console.error('Erro ao consultar pontos:', err);
        showToast('Erro ao consultar pontos.', true);
    }
}

function displayPoints(customer) {
    const pontos = parseInt(customer.pontos || 0);

    document.getElementById('pointsValue').textContent = pontos;
    document.getElementById('customerName').textContent = customer.nome || '';
    document.getElementById('totalTrips').textContent = customer.viagens || 0;
    document.getElementById('totalReferrals').textContent = customer.indicacoes || 0;
    document.getElementById('totalSurveys').textContent = customer.pesquisas || 0;

    let descontoActual = null;
    for (let i = DESCONTOS.length - 1; i >= 0; i--) {
        if (pontos >= DESCONTOS[i].pontos) {
            descontoActual = DESCONTOS[i];
            break;
        }
    }

    const discountBadge = document.getElementById('discountBadge');
    if (descontoActual) {
        document.getElementById('discountText').textContent = descontoActual.viagemGratis
            ? '🎉 Viagem GRÁTIS Disponível!'
            : `${descontoActual.desconto}% de Desconto Disponível!`;
        discountBadge.style.display = 'flex';
    } else {
        discountBadge.style.display = 'none';
    }

    let proximo = null;
    for (let d of DESCONTOS) {
        if (pontos < d.pontos) { proximo = d; break; }
    }

    if (proximo) {
        const prev = descontoActual ? descontoActual.pontos : 0;
        const range = proximo.pontos - prev;
        const progress = ((pontos - prev) / range) * 100;
        document.getElementById('progressFill').style.width = Math.max(2, progress) + '%';
        document.getElementById('progressText').textContent = proximo.viagemGratis
            ? `Faltam ${proximo.pontos - pontos} pontos para VIAGEM GRÁTIS!`
            : `Faltam ${proximo.pontos - pontos} pontos para ${proximo.desconto}% de desconto`;
    } else {
        document.getElementById('progressFill').style.width = '100%';
        document.getElementById('progressText').textContent = '🏆 Nível máximo atingido!';
    }

    document.getElementById('pointsResult').style.display = 'block';
}

function shareWhatsApp() {
    const nome = document.getElementById('customerName').textContent;
    const pontos = document.getElementById('pointsValue').textContent;
    const desconto = (() => {
        for (let i = DESCONTOS.length - 1; i >= 0; i--) {
            if (parseInt(pontos) >= DESCONTOS[i].pontos) return DESCONTOS[i];
        }
        return null;
    })();

    let msg = `🚖 *Grutur - Programa de Fidelização*\n\n`;
    msg += `👤 ${nome}\n`;
    msg += `⭐ ${pontos} pontos acumulados\n\n`;
    if (desconto) {
        msg += desconto.viagemGratis
            ? `🎉 Tenho uma VIAGEM GRÁTIS disponível!\n\n`
            : `💰 Desconto disponível: ${desconto.desconto}%\n\n`;
    }
    msg += `Junte-se ao Programa Grutur! 🎁`;

    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
}

// =============================================
// ADMIN: REGISTAR VIAGEM
// =============================================
document.getElementById('tripForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const phone = document.getElementById('tripPhone').value.trim();
    if (!phone) {
        showToast('Insira o telefone do cliente.', true);
        return;
    }

    try {
        const customer = await getCustomer(phone);
        if (!customer) {
            showToast('Cliente não encontrado. Registe-o primeiro em "Gerir Clientes".', true);
            return;
        }

        const newPoints = parseInt(customer.pontos || 0) + PONTOS.VIAGEM;
        const newTrips = parseInt(customer.viagens || 0) + 1;

        await sheetPost({
            action: 'updatePoints',
            telefone: phone,
            pontos: newPoints,
            viagens: newTrips,
            indicacoes: customer.indicacoes || 0,
            pesquisas: customer.pesquisas || 0
        });

        showToast(`✅ Viagem registada! ${customer.nome} ganhou ${PONTOS.VIAGEM} pontos. Total: ${newPoints} pts`);
        this.reset();

    } catch (err) {
        console.error('Erro ao registar viagem:', err);
        showToast('Erro ao registar viagem.', true);
    }
});

// =============================================
// ADMIN: REGISTAR INDICAÇÃO
// =============================================
document.getElementById('referralForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const giverPhone = document.getElementById('referralGiverPhone').value.trim();
    const receiverName = document.getElementById('referralReceiverName').value.trim();
    const receiverPhone = document.getElementById('referralReceiverPhone').value.trim();

    if (!giverPhone || !receiverName || !receiverPhone) {
        showToast('Preencha todos os campos.', true);
        return;
    }

    try {
        const giver = await getCustomer(giverPhone);
        if (!giver) {
            showToast('Cliente que indica não encontrado. Registe-o primeiro.', true);
            return;
        }

        let receiver = await getCustomer(receiverPhone);
        if (!receiver) {
            await sheetPost({
                action: 'addCustomer',
                nome: receiverName,
                telefone: receiverPhone,
                pontos: PONTOS.AMIGO_INDICADO,
                viagens: 0,
                indicacoes: 0,
                pesquisas: 0
            });
        } else {
            await sheetPost({
                action: 'updatePoints',
                telefone: receiverPhone,
                pontos: parseInt(receiver.pontos || 0) + PONTOS.AMIGO_INDICADO,
                viagens: receiver.viagens || 0,
                indicacoes: receiver.indicacoes || 0,
                pesquisas: receiver.pesquisas || 0
            });
        }

        await sheetPost({
            action: 'updatePoints',
            telefone: giverPhone,
            pontos: parseInt(giver.pontos || 0) + PONTOS.INDICACAO,
            viagens: giver.viagens || 0,
            indicacoes: parseInt(giver.indicacoes || 0) + 1,
            pesquisas: giver.pesquisas || 0
        });

        showToast(`✅ Indicação registada! ${giver.nome} e ${receiverName} ganharam ${PONTOS.INDICACAO} pontos cada!`);
        this.reset();

    } catch (err) {
        console.error('Erro ao registar indicação:', err);
        showToast('Erro ao registar indicação.', true);
    }
});

// =============================================
// ADMIN: GERIR CLIENTES
// =============================================
document.getElementById('customerForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const name = document.getElementById('customerName').value.trim();
    const phone = document.getElementById('customerPhone').value.trim();

    if (!name || !phone) {
        showToast('Preencha o nome e o telefone.', true);
        return;
    }

    try {
        const existing = await getCustomer(phone);

        if (existing) {
            showToast(`✅ Cliente "${name}" já existe com ${existing.pontos || 0} pontos!`);
        } else {
            await sheetPost({
                action: 'addCustomer',
                nome: name,
                telefone: phone,
                pontos: 0,
                viagens: 0,
                indicacoes: 0,
                pesquisas: 0
            });
            showToast(`✅ Cliente "${name}" registado com sucesso!`);
        }

        this.reset();
        loadCustomers();

    } catch (err) {
        console.error('Erro ao guardar cliente:', err);
        showToast('Erro ao guardar cliente. Tente novamente.', true);
    }
});

async function loadCustomers() {
    const listEl = document.getElementById('customerList');
    listEl.innerHTML = '<p style="color:#666;">A carregar...</p>';

    try {
        const result = await sheetGet({ action: 'getAllCustomers' });

        if (!result.success || !result.clientes || result.clientes.length === 0) {
            listEl.innerHTML = '<p style="color:#666;">Nenhum cliente registado ainda.</p>';
            return;
        }

        listEl.innerHTML = result.clientes.map(c => `
            <div class="customer-item">
                <div class="customer-info">
                    <h4>${c.nome || 'Sem nome'}</h4>
                    <p>📞 ${c.telefone || ''} &nbsp;|&nbsp; 🚖 ${c.viagens || 0} viagens &nbsp;|&nbsp; 👥 ${c.indicacoes || 0} indicações</p>
                </div>
                <div class="customer-points">${c.pontos || 0} pts</div>
            </div>
        `).join('');

    } catch (err) {
        console.error('Erro ao carregar clientes:', err);
        listEl.innerHTML = '<p style="color:#dc3545;">Erro ao carregar clientes.</p>';
    }
}

// =============================================
// ADMIN: ENVIAR PESQUISA VIA WHATSAPP
// =============================================
document.getElementById('sendSurveyForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const phone = document.getElementById('sendSurveyPhone').value.trim();
    if (!phone) {
        showToast('Insira o número de telefone do cliente.', true);
        return;
    }

    const surveyUrl = 'https://grutur.com/fidelizacao/#survey';
    const msg = `🚖 *Grutur Táxi*\n\nObrigado pela sua viagem! 🙏\n\nPor favor, avalie o nosso serviço e ganhe *5 pontos bónus*:\n\n${surveyUrl}\n\nA sua opinião é muito importante para nós! ⭐`;

    const waPhone = phone.replace(/[\s\-]/g, '').replace(/^\+/, '');
    window.open(`https://wa.me/${waPhone}?text=${encodeURIComponent(msg)}`, '_blank');

    showToast('✅ WhatsApp aberto!');
    this.reset();
});
