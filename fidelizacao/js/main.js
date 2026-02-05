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

// Base URL para API
const API_BASE = 'https://api.genspark.ai/v1/agents/4d898592-9e7c-48a0-8fe9-1f7654d73e91/tables';

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

// Adicionar/Atualizar Cliente
async function upsertCustomer(name, phone) {
    const formattedPhone = formatPhone(phone);
    
    try {
        // Verificar se cliente existe
        const response = await fetch(`${API_BASE}/customers/rows?phone=${formattedPhone}`);
        const data = await response.json();
        
        if (data.rows && data.rows.length > 0) {
            // Atualizar cliente existente
            const customer = data.rows[0];
            await fetch(`${API_BASE}/customers/rows/${customer.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name })
            });
            return customer.id;
        } else {
            // Criar novo cliente
            const createResponse = await fetch(`${API_BASE}/customers/rows`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    phone: formattedPhone,
                    points: 0,
                    trips: 0,
                    referrals: 0,
                    surveys: 0
                })
            });
            const newCustomer = await createResponse.json();
            return newCustomer.id;
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
        const response = await fetch(`${API_BASE}/customers/rows?phone=${formattedPhone}`);
        const data = await response.json();
        
        if (data.rows && data.rows.length > 0) {
            return data.rows[0];
        }
        return null;
    } catch (error) {
        console.error('Erro ao buscar cliente:', error);
        return null;
    }
}

// Atualizar Pontos do Cliente
async function updateCustomerPoints(customerId, pointsToAdd, field) {
    try {
        const response = await fetch(`${API_BASE}/customers/rows/${customerId}`);
        const customer = await response.json();
        
        const updates = {
            points: customer.points + pointsToAdd
        };
        
        if (field) {
            updates[field] = (customer[field] || 0) + 1;
        }
        
        await fetch(`${API_BASE}/customers/rows/${customerId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
        });
        
        return updates.points;
    } catch (error) {
        console.error('Erro ao atualizar pontos:', error);
        throw error;
    }
}

// Form: Adicionar Cliente
document.getElementById('customerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('customerName').value;
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
        
        // Registrar viagem
        await fetch(`${API_BASE}/trips/rows`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                customer_id: customer.id,
                origin,
                destination,
                value: parseFloat(value) || 0,
                date: new Date().toISOString()
            })
        });
        
        // Adicionar pontos
        const newPoints = await updateCustomerPoints(customer.id, POINTS.TRIP, 'trips');
        
        alert(`✅ Viagem registrada!\n${customer.name} ganhou ${POINTS.TRIP} pontos.\nTotal: ${newPoints} pontos`);
        document.getElementById('tripForm').reset();
        loadCustomers();
    } catch (error) {
        alert('❌ Erro ao registrar viagem. Tente novamente.');
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
        
        // Criar ou buscar cliente indicado
        const referredId = await upsertCustomer(referredName, referredPhone);
        
        // Registrar indicação
        await fetch(`${API_BASE}/referrals/rows`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                referrer_id: referrer.id,
                referred_id: referredId,
                date: new Date().toISOString()
            })
        });
        
        // Adicionar pontos para quem indicou
        const referrerPoints = await updateCustomerPoints(referrer.id, POINTS.REFERRAL_GIVER, 'referrals');
        
        // Adicionar pontos para quem foi indicado
        const referredPoints = await updateCustomerPoints(referredId, POINTS.REFERRAL_RECEIVER);
        
        alert(`✅ Indicação registrada!\n\n${referrer.name} ganhou ${POINTS.REFERRAL_GIVER} pontos (Total: ${referrerPoints})\n${referredName} ganhou ${POINTS.REFERRAL_RECEIVER} pontos (Total: ${referredPoints})`);
        document.getElementById('referralForm').reset();
        loadCustomers();
    } catch (error) {
        alert('❌ Erro ao registrar indicação. Tente novamente.');
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
        
        // Registrar pesquisa
        await fetch(`${API_BASE}/surveys/rows`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                customer_id: customer.id,
                overall_rating: parseInt(overall),
                driver_rating: parseInt(driver),
                vehicle_rating: parseInt(vehicle),
                punctuality_rating: parseInt(punctuality),
                service_rating: parseInt(service),
                comments,
                date: new Date().toISOString()
            })
        });
        
        // Adicionar pontos
        const newPoints = await updateCustomerPoints(customer.id, POINTS.SURVEY, 'surveys');
        
        alert(`✅ Pesquisa enviada com sucesso!\n${customer.name} ganhou ${POINTS.SURVEY} pontos de bônus.\nTotal: ${newPoints} pontos`);
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
        
        // Calcular desconto
        const { currentDiscount, nextMilestone } = calculateDiscount(customer.points);
        
        // Mostrar resultados
        document.getElementById('customerName').textContent = customer.name;
        document.getElementById('totalPoints').textContent = customer.points;
        document.getElementById('tripCount').textContent = customer.trips || 0;
        document.getElementById('referralCount').textContent = customer.referrals || 0;
        document.getElementById('surveyCount').textContent = customer.surveys || 0;
        
        const discountBadge = document.getElementById('currentDiscount');
        if (currentDiscount === 'FREE') {
            discountBadge.textContent = '🎉 VIAGEM GRÁTIS!';
            document.getElementById('discountMessage').textContent = 'Parabéns! Você conquistou uma viagem grátis!';
        } else if (currentDiscount > 0) {
            discountBadge.textContent = `${currentDiscount}%`;
            if (nextMilestone) {
                const pointsNeeded = nextMilestone.points - customer.points;
                document.getElementById('discountMessage').textContent = 
                    `Faltam ${pointsNeeded} pontos para ${nextMilestone.discount === 'FREE' ? 'viagem grátis' : nextMilestone.discount + '% de desconto'}!`;
            } else {
                document.getElementById('discountMessage').textContent = 'Você alcançou o desconto máximo!';
            }
        } else {
            discountBadge.textContent = '0%';
            document.getElementById('discountMessage').textContent = 
                `Faltam ${nextMilestone.points - customer.points} pontos para ${nextMilestone.discount}% de desconto!`;
        }
        
        // Barra de progresso
        if (nextMilestone) {
            const progress = (customer.points / nextMilestone.points) * 100;
            document.getElementById('progressBar').style.width = `${Math.min(progress, 100)}%`;
            document.getElementById('progressText').textContent = 
                `${customer.points} / ${nextMilestone.points} pontos`;
        } else {
            document.getElementById('progressBar').style.width = '100%';
            document.getElementById('progressText').textContent = 'Nível máximo alcançado!';
        }
        
        document.getElementById('pointsResult').style.display = 'block';
        
        // Configurar botão WhatsApp
        document.getElementById('shareWhatsapp').onclick = () => {
            const message = `🎁 Meus Pontos Grutur 🚖\n\n` +
                `Total: ${customer.points} pontos\n` +
                `Desconto atual: ${currentDiscount === 'FREE' ? 'Viagem Grátis!' : currentDiscount + '%'}\n` +
                `Viagens: ${customer.trips || 0}\n` +
                `Indicações: ${customer.referrals || 0}\n\n` +
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
    const message = `🌟 Grutur - Pesquisa de Satisfação\n\n` +
        `Olá! Agradecemos por utilizar nossos serviços.\n\n` +
        `Sua opinião é muito importante! Responda nossa pesquisa e ganhe 5 pontos extras:\n\n` +
        `${surveyUrl}\n\n` +
        `Obrigado! 🚖`;
    
    window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`, '_blank');
});

// Carregar Lista de Clientes
async function loadCustomers() {
    try {
        const response = await fetch(`${API_BASE}/customers/rows`);
        const data = await response.json();
        
        const container = document.getElementById('customersList');
        
        if (!data.rows || data.rows.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px 20px; color: #666;">
                    <i class="fas fa-users" style="font-size: 48px; color: #ddd; margin-bottom: 15px;"></i>
                    <p style="font-size: 16px; margin: 0;">ℹ️ Nenhum cliente cadastrado ainda.</p>
                    <p style="font-size: 14px; margin-top: 10px; color: #999;">Adicione o primeiro cliente usando o formulário acima!</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = data.rows
            .sort((a, b) => b.points - a.points)
            .map(customer => `
                <div class="customer-item">
                    <div class="customer-info">
                        <h4>${customer.name}</h4>
                        <p>📱 ${customer.phone} | 🚖 ${customer.trips || 0} viagens | 👥 ${customer.referrals || 0} indicações</p>
                    </div>
                    <div class="customer-points">
                        ${customer.points} pontos
                    </div>
                </div>
            `).join('');
    } catch (error) {
        console.error('Erro ao carregar clientes:', error);
        document.getElementById('customersList').innerHTML = `
            <div style="text-align: center; padding: 40px 20px;">
                <i class="fas fa-exclamation-triangle" style="font-size: 48px; color: #f39c12; margin-bottom: 15px;"></i>
                <p style="color: #e74c3c; font-size: 16px; margin: 0;">⚠️ Erro ao conectar com o servidor.</p>
                <p style="color: #999; font-size: 14px; margin-top: 10px;">Verifique sua conexão e tente recarregar a página.</p>
            </div>
        `;
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
