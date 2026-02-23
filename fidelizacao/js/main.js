// Constantes do Sistema
const POINTS = {
    TRIP: 5,
    REFERRAL_GIVER: 10,
    REFERRAL_RECEIVER: 10,
    SURVEY: 5
};

const DISCOUNTS = [
    { points: 50, discount: 5 },
    { points: 100, discount: 10 },
    { points: 150, discount: 15 },
    { points: 200, discount: 20 },
    { points: 250, discount: 25 },
    { points: 300, discount: 30 },
    { points: 500, discount: 'FREE' }
];

// URL do Google Apps Script
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyBWCKVhOATg_FRyuI9AM9f26A_L1bwpsHR4tM_mRkhBri_HXjC4I0n4uesBvC2RIIORA/exec';


// Navegação entre seções
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const section = btn.dataset.section;

        // Atualizar botões ativos
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Mostrar seção correta
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        document.getElementById(section).classList.add('active');
    });
});

// Sistema de Avaliação por Estrelas
document.querySelectorAll('.stars').forEach(starContainer => {
    const stars = starContainer.querySelectorAll('i');

    stars.forEach((star, index) => {
        star.addEventListener('click', () => {
            // Remover todas as estrelas ativas
            stars.forEach(s => s.classList.remove('active', 'fas'));
            stars.forEach(s => s.classList.add('far'));

            // Ativar estrelas até o índice clicado
            for (let i = 0; i <= index; i++) {
                stars[i].classList.remove('far');
                stars[i].classList.add('fas', 'active');
            }

            // Armazenar valor
            starContainer.dataset.value = index + 1;
        });

        // Hover effect
        star.addEventListener('mouseenter', () => {
            stars.forEach((s, i) => {
                if (i <= index) {
                    s.classList.remove('far');
                    s.classList.add('fas');
                } else {
                    s.classList.remove('fas');
                    s.classList.add('far');
                }
            });
        });
    });

    starContainer.addEventListener('mouseleave', () => {
        const value = starContainer.dataset.value || 0;
        stars.forEach((s, i) => {
            if (i < value) {
                s.classList.remove('far');
                s.classList.add('fas', 'active');
            } else {
                s.classList.remove('fas', 'active');
                s.classList.add('far');
            }
        });
    });
});

// Calcular Desconto
function calculateDiscount(points) {
    let currentDiscount = 0;
    let nextMilestone = DISCOUNTS[0];

    for (let i = DISCOUNTS.length - 1; i >= 0; i--) {
        if (points >= DISCOUNTS[i].points) {
            currentDiscount = DISCOUNTS[i].discount;
            nextMilestone = DISCOUNTS[i + 1] || null;
            break;
        } else {
            nextMilestone = DISCOUNTS[i];
        }
    }

    return { currentDiscount, nextMilestone };
}

// Formatar Telefone
function formatPhone(phone) {
    return phone.replace(/\D/g, '');
}

// Funções Google Sheet
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

// Adicionar/Atualizar Cliente
async function upsertCustomer(name, phone) {
    const formattedPhone = formatPhone(phone);

    try {
        const result = await sheetGet({ action: 'getCustomer', telefone: formattedPhone });

        if (result.success && result.cliente) {
            return result.cliente;
        } else {
            await sheetPost({
                action: 'addCustomer',
                nome: name,
                telefone: formattedPhone,
                pontos: 0,
                viagens: 0,
                indicacoes: 0,
                pesquisas: 0
            });
            const newResult = await sheetGet({ action: 'getCustomer', telefone: formattedPhone });
            return newResult.cliente;
        }
    } catch (error) {
        console.error('Erro ao processar cliente:', error);
        throw error;
    }
}

// Buscar Cliente
async function getCustomer(phone) {
    const formattedPhone = formatPhone(phone);

    try {
        const result = await sheetGet({ action: 'getCustomer', telefone: formattedPhone });
        if (result.success && result.cliente) {
            return result.cliente;
        }
        return null;
    } catch (error) {
        console.error('Erro ao buscar cliente:', error);
        return null;
    }
}

// Atualizar Pontos do Cliente
async function updateCustomerPoints(phone, pointsToAdd, field) {
    try {
        const result = await sheetGet({ action: 'getCustomer', telefone: formatPhone(phone) });
        if (!result.success || !result.cliente) throw new Error('Cliente não encontrado');

        const customer = result.cliente;
        const updates = {
            action: 'updatePoints',
            telefone: formatPhone(phone),
            pontos: parseInt(customer.pontos || 0) + pointsToAdd,
            viagens: parseInt(customer.viagens || 0),
            indicacoes: parseInt(customer.indicacoes || 0),
            pesquisas: parseInt(customer.pesquisas || 0)
        };

        if (field === 'trips') updates.viagens += 1;
        if (field === 'referrals') updates.indicacoes += 1;
        if (field === 'surveys') updates.pesquisas += 1;

        await sheetPost(updates);
        return updates.pontos;
    } catch (error) {
        console.error('Erro ao atualizar pontos:', error);
        throw error;
    }
}

// Form: Adicionar Cliente
document.getElementById('customerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('customerNameInput').value;
    const phone = document.getElementById('customerPhone').value;

    try {
        await upsertCustomer(name, phone);
        alert('✅ Cliente salvo com sucesso!');
        document.getElementById('customerForm').reset();
        loadCustomers();
    } catch (error) {
        alert('❌ Erro ao salvar cliente. Tente novamente.');
    }
});

// Form: Registrar Viagem
document.getElementById('tripForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const phone = document.getElementById('tripPhone').value;
    const origin = document.getElementById('tripOrigin').value;
    const destination = document.getElementById('tripDestination').value;
    const value = document.getElementById('tripValue').value;

    try {
        const customer = await getCustomer(phone);

        if (!customer) {
            alert('❌ Cliente não encontrado. Por favor, cadastre o cliente primeiro.');
            return;
        }

        const newPoints = await updateCustomerPoints(phone, POINTS.TRIP, 'trips');

        alert(`✅ Viagem registada!\n${customer.nome} ganhou ${POINTS.TRIP} pontos.\nTotal: ${newPoints} pontos`);
        document.getElementById('tripForm').reset();
        loadCustomers();
    } catch (error) {
        alert('❌ Erro ao registar viagem. Tente novamente.');
    }
});

// Form: Registrar Indicação
document.getElementById('referralForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const referrerPhone = document.getElementById('referrerPhone').value;
    const referredName = document.getElementById('referredName').value;
    const referredPhone = document.getElementById('referredPhone').value;

    try {
        const referrer = await getCustomer(referrerPhone);

        if (!referrer) {
            alert('❌ Cliente indicador não encontrado.');
            return;
        }

        const referredId = await upsertCustomer(referredName, referredPhone);

        const referrerPoints = await updateCustomerPoints(referrerPhone, POINTS.REFERRAL_GIVER, 'referrals');
        const referredPoints = await updateCustomerPoints(referredPhone, POINTS.REFERRAL_RECEIVER);

        alert(`✅ Indicação registada!\n${referrer.nome} ganhou ${POINTS.REFERRAL_GIVER} pontos (Total: ${referrerPoints})\n${referredName} ganhou ${POINTS.REFERRAL_RECEIVER} pontos (Total: ${referredPoints})`);
        document.getElementById('referralForm').reset();
        loadCustomers();
    } catch (error) {
        alert('❌ Erro ao registar indicação. Tente novamente.');
    }
});

// Form: Pesquisa de Satisfação
document.getElementById('surveyForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const phone = document.getElementById('surveyPhone').value;
    const overall = document.querySelector('[data-rating="overall"]').dataset.value || 0;
    const driver = document.querySelector('[data-rating="driver"]').dataset.value || 0;
    const vehicle = document.querySelector('[data-rating="vehicle"]').dataset.value || 0;
    const punctuality = document.querySelector('[data-rating="punctuality"]').dataset.value || 0;
    const service = document.querySelector('[data-rating="service"]').dataset.value || 0;
    const comments = document.getElementById('surveyComments').value;

    if (!overall || !driver || !vehicle || !punctuality || !service) {
        alert('❌ Por favor, avalie todos os itens com estrelas.');
        return;
    }

    try {
        const customer = await getCustomer(phone);

        if (!customer) {
            alert('❌ Cliente não encontrado. Verifique o telefone.');
            return;
        }

        const newPoints = await updateCustomerPoints(phone, POINTS.SURVEY, 'surveys');
                await sheetPost({
            action: 'addAvaliacao',
            telefone: phone,
            nome: customer.nome,
            geral: overall,
            motorista: driver,
            veiculo: vehicle,
            pontualidade: punctuality,
            atendimento: service,
            comentarios: comments
        });


        alert(`✅ Pesquisa enviada com sucesso!\n${customer.nome} ganhou ${POINTS.SURVEY} pontos de bónus.\nTotal: ${newPoints} pontos`);
        document.getElementById('surveyForm').reset();

        // Resetar estrelas
        document.querySelectorAll('.stars').forEach(container => {
            container.dataset.value = 0;
            container.querySelectorAll('i').forEach(star => {
                star.classList.remove('fas', 'active');
                star.classList.add('far');
            });
        });
    } catch (error) {
        alert('❌ Erro ao enviar pesquisa. Tente novamente.');
    }
});

// Form: Consultar Pontos
document.getElementById('pointsForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const phone = document.getElementById('pointsPhone').value;

    try {
        const customer = await getCustomer(phone);

        if (!customer) {
            alert('❌ Cliente não encontrado. Verifique o telefone.');
            return;
        }

        const { currentDiscount, nextMilestone } = calculateDiscount(customer.pontos);

        document.getElementById('customerName').textContent = customer.nome;
        document.getElementById('totalPoints').textContent = customer.pontos;
        document.getElementById('tripCount').textContent = customer.viagens || 0;
        document.getElementById('referralCount').textContent = customer.indicacoes || 0;
        document.getElementById('surveyCount').textContent = customer.pesquisas || 0;

        const discountBadge = document.getElementById('currentDiscount');
        if (currentDiscount === 'FREE') {
            discountBadge.textContent = '🎉 VIAGEM GRÁTIS!';
            document.getElementById('discountMessage').textContent = 'Parabéns! Você conquistou uma viagem grátis!';
        } else if (currentDiscount > 0) {
            discountBadge.textContent = `${currentDiscount}%`;
            if (nextMilestone) {
                const pointsNeeded = nextMilestone.points - customer.pontos;
                document.getElementById('discountMessage').textContent =
                    `Faltam ${pointsNeeded} pontos para ${nextMilestone.discount === 'FREE' ? 'viagem grátis' : nextMilestone.discount + '% de desconto'}!`;
            } else {
                document.getElementById('discountMessage').textContent = 'Você alcançou o desconto máximo!';
            }
        } else {
            discountBadge.textContent = '0%';
            document.getElementById('discountMessage').textContent =
                `Faltam ${nextMilestone.points - customer.pontos} pontos para ${nextMilestone.discount}% de desconto!`;
        }

        if (nextMilestone) {
            const progress = (customer.pontos / nextMilestone.points) * 100;
            document.getElementById('progressBar').style.width = `${Math.min(progress, 100)}%`;
            document.getElementById('progressText').textContent =
                `${customer.pontos} / ${nextMilestone.points} pontos`;
        } else {
            document.getElementById('progressBar').style.width = '100%';
            document.getElementById('progressText').textContent = 'Nível máximo alcançado!';
        }

        document.getElementById('pointsResult').style.display = 'block';

        // Configurar botão WhatsApp
        document.getElementById('shareWhatsapp').onclick = () => {
            const message = `🚖 Meus Pontos Grutur 🚖\n\n` +
                `Total: ${customer.pontos} pontos\n` +
                `Desconto atual: ${currentDiscount === 'FREE' ? 'Viagem Grátis' : currentDiscount + '%'}\n` +
                `Viagens: ${customer.viagens || 0}\n` +
                `Indicações: ${customer.indicacoes || 0}\n\n` +
                `Participe você também!`;

            window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
        };

    } catch (error) {
        alert('❌ Erro ao consultar pontos. Tente novamente.');
    }
});

// Form: Enviar Pesquisa via WhatsApp
document.getElementById('sendSurveyForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const phone = document.getElementById('sendSurveyPhone').value;
    const formattedPhone = formatPhone(phone);

    const surveyUrl = window.location.origin + window.location.pathname + '#survey';
    const message = `🚖 Grutur - Pesquisa de Satisfação\n\n` +
        `Olá! Agradecemos por utilizar nossos serviços.\n\n` +
        `Sua opinião é muito importante! Responda nossa pesquisa e ganhe 5 pontos extras:\n\n` +
        `${surveyUrl}\n\n` +
        `Obrigado! 🚖`;

    window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`, '_blank');
});

// Carregar Lista de Clientes
async function loadCustomers() {
    try {
        const result = await sheetGet({ action: 'getAllCustomers' });
        const container = document.getElementById('customersList');

        if (!result.success || !result.clientes || result.clientes.length === 0) {
            container.innerHTML = '<p>Nenhum cliente cadastrado ainda.</p>';
            return;
        }

        container.innerHTML = result.clientes
            .sort((a, b) => b.pontos - a.pontos)
            .map(customer => `
                <div class="customer-item">
                    <div class="customer-info">
                        <h4>${customer.nome}</h4>
                        <p>📞 ${customer.telefone} | 🚖 ${customer.viagens || 0} viagens | 👥 ${customer.indicacoes || 0} indicações</p>
                    </div>
                    <div class="customer-points">
                        ${customer.pontos} pontos
                    </div>
                </div>
            `).join('');
    } catch (error) {
        console.error('Erro ao carregar clientes:', error);
        document.getElementById('customersList').innerHTML =
            '<p style="color: red;">Erro ao carregar clientes. Tente recarregar a página.</p>';
    }
}

// Carregar clientes ao abrir a seção admin
document.querySelector('[data-section="admin"]').addEventListener('click', loadCustomers);

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Verificar se há hash na URL (ex: #survey)
    if (window.location.hash) {
        const section = window.location.hash.substring(1);
        const btn = document.querySelector(`[data-section="${section}"]`);
        if (btn) {
            btn.click();
        }
    }
});
