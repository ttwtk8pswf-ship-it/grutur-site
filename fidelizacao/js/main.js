// Sistema de Pontos Atualizado
const PONTOS = {
    VIAGEM: 5,
    INDICACAO: 10,
    AMIGO_INDICADO: 10,
    PESQUISA: 5,
    BOAS_VINDAS: 5
};

// URL do Google Apps Script (será configurado pelo usuário)
let GOOGLE_SCRIPT_URL = localStorage.getItem('google_script_url') || '';

// Tabela de Descontos Atualizada
const DESCONTOS = [
    { pontos: 50, desconto: 5 },
    { pontos: 100, desconto: 10 },
    { pontos: 150, desconto: 15 },
    { pontos: 200, desconto: 20 },
    { pontos: 250, desconto: 25 },
    { pontos: 300, desconto: 30 },
    { pontos: 500, desconto: 100, viagemGratis: true }
];

// Estado Global
let ratings = {
    geral: 0,
    motorista: 0,
    veiculo: 0,
    pontualidade: 0,
    atendimento: 0
};

// Navegação
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        const href = e.target.getAttribute('href');
        
        // Se for link externo (admin.html), não prevenir
        if (href && href.includes('.html')) {
            return; // Deixa o link funcionar normalmente
        }
        
        e.preventDefault();

        const target = e.target.getAttribute('href').substring(1);
        
        // Update active nav
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        e.target.classList.add('active');
        
        // Show target section
        document.querySelectorAll('.section').forEach(section => {
            section.classList.add('hidden');
        });
        document.getElementById(target).classList.remove('hidden');
        
        // Load data if needed
        if (target === 'admin') {
            loadClientes();
        }
    });
});

// Rating Stars
document.querySelectorAll('.stars').forEach(starsContainer => {
    const stars = starsContainer.querySelectorAll('i');
    const categoryId = starsContainer.id.replace('rating-', '');
    
    stars.forEach(star => {
        star.addEventListener('click', () => {
            const rating = parseInt(star.getAttribute('data-rating'));
            ratings[categoryId] = rating;
            
            // Update visual
            stars.forEach((s, index) => {
                if (index < rating) {
                    s.classList.remove('far');
                    s.classList.add('fas');
                } else {
                    s.classList.remove('fas');
                    s.classList.add('far');
                }
            });
        });
        
        star.addEventListener('mouseenter', () => {
            const rating = parseInt(star.getAttribute('data-rating'));
            stars.forEach((s, index) => {
                if (index < rating) {
                    s.style.color = '#ffd700';
                } else {
                    s.style.color = '#ddd';
                }
            });
        });
    });
    
    starsContainer.addEventListener('mouseleave', () => {
        const currentRating = ratings[categoryId] || 0;
        stars.forEach((s, index) => {
            if (index < currentRating) {
                s.style.color = '#ffd700';
            } else {
                s.style.color = '#ddd';
            }
        });
    });
});
// Toast Notification
function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    
    toastMessage.textContent = message;
    toast.classList.remove('hidden', 'error');
    
    if (isError) {
        toast.classList.add('error');
    }
    
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

// Calcular Desconto Disponível
function calcularDesconto(pontos) {
    let descontoDisponivel = null;
    
    for (let i = DESCONTOS.length - 1; i >= 0; i--) {
        if (pontos >= DESCONTOS[i].pontos) {
            descontoDisponivel = DESCONTOS[i];
            break;
        }
    }
    
    return descontoDisponivel;
}

// Calcular Próximo Desconto
function calcularProximoDesconto(pontos) {
    for (let desconto of DESCONTOS) {
        if (pontos < desconto.pontos) {
            return {
                pontos: desconto.pontos,
                desconto: desconto.desconto,
                faltam: desconto.pontos - pontos,
                viagemGratis: desconto.viagemGratis || false
            };
        }
    }
    return null;
}

// Consultar Pontos
async function consultarPontos() {
    const telefone = document.getElementById('consulta-telefone').value.trim();
    
    if (!telefone) {
        showToast('Por favor, informe o número de telefone', true);
        return;
    }
    
    try {
        const response = await fetch(`tables/customers?search=${encodeURIComponent(telefone)}`);
        const data = await response.json();
        
        if (data.data && data.data.length > 0) {
            const cliente = data.data[0];
            mostrarPontos(cliente);
        } else {
            showToast('Cliente não encontrado', true);
        }
    } catch (error) {
        console.error('Erro ao consultar pontos:', error);
        showToast('Erro ao consultar pontos', true);
    }
}

// Mostrar Pontos
function mostrarPontos(cliente) {
    document.getElementById('cliente-nome').textContent = cliente.name;
    document.getElementById('total-pontos').textContent = cliente.points || 0;
    document.getElementById('total-viagens').textContent = cliente.total_trips || 0;
    document.getElementById('total-indicacoes').textContent = cliente.total_referrals || 0;
    document.getElementById('total-pesquisas').textContent = cliente.total_surveys || 0;
    
    const pontos = cliente.points || 0;
    const descontoAtual = calcularDesconto(pontos);
    const proximoDesconto = calcularProximoDesconto(pontos);
    
    // Mostrar desconto disponível
    const discountBadge = document.getElementById('discount-badge');
    const discountText = document.getElementById('discount-text');
    
    if (descontoAtual) {
        if (descontoAtual.viagemGratis) {
            discountText.textContent = '🎉 Viagem GRÁTIS Disponível!';
        } else {
            discountText.textContent = `${descontoAtual.desconto}% de Desconto Disponível!`;
        }
        discountBadge.style.display = 'block';
    } else {
        discountBadge.style.display = 'none';
    }
    
    // Mostrar progresso
    if (proximoDesconto) {
        const progressPercentage = ((pontos % proximoDesconto.pontos) / proximoDesconto.pontos) * 100;
        document.getElementById('progress-fill').style.width = `${progressPercentage}%`;
        
        if (proximoDesconto.viagemGratis) {
            document.getElementById('progress-text').textContent = 
                `Faltam ${proximoDesconto.faltam} pontos para VIAGEM GRÁTIS!`;
        } else {
            document.getElementById('progress-text').textContent = 
                `Faltam ${proximoDesconto.faltam} pontos para ${proximoDesconto.desconto}% de desconto`;
        }
    } else {
        document.getElementById('progress-fill').style.width = '100%';
        document.getElementById('progress-text').textContent = 'Você atingiu o nível máximo!';
    }
    
    document.getElementById('resultado-pontos').classList.remove('hidden');
}

// Compartilhar WhatsApp
function compartilharWhatsApp() {
    const nome = document.getElementById('cliente-nome').textContent;
    const pontos = document.getElementById('total-pontos').textContent;
    const desconto = calcularDesconto(parseInt(pontos));
    
    let mensagem = `🎉 Meus pontos Grutur: ${pontos} pontos!\n\n`;
    
    if (desconto) {
        if (desconto.viagemGratis) {
            mensagem += `🎁 Tenho uma VIAGEM GRÁTIS disponível!\n\n`;
        } else {
            mensagem += `💰 Desconto disponível: ${desconto.desconto}%\n\n`;
        }
    }
    
    mensagem += `Junte-se ao Programa de Fidelização Grutur e ganhe pontos em cada viagem! 🚖`;
    
    const url = `https://wa.me/?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
}
// Cadastro Form - Auto-cadastro de Clientes
document.getElementById('cadastro-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const nome = document.getElementById('cadastro-nome').value.trim();
    const telefone = document.getElementById('cadastro-telefone').value.trim();
    const email = document.getElementById('cadastro-email').value.trim();
    const termos = document.getElementById('cadastro-termos').checked;
    
    if (!nome || !telefone) {
        showToast('Por favor, preencha nome e telefone', true);
        return;
    }
    
    if (!termos) {
        showToast('Por favor, aceite os termos e condições', true);
        return;
    }
    
    // Validar formato de telefone português
    const telefoneRegex = /^\+351\d{9}$/;
    if (!telefoneRegex.test(telefone)) {
        showToast('Formato de telefone inválido. Use: +351912345678', true);
        return;
    }
    
    try {
        // Verificar se cliente já existe
        const existeResponse = await fetch(`tables/customers?search=${encodeURIComponent(telefone)}`);
        const existeData = await existeResponse.json();
        
        if (existeData.data && existeData.data.length > 0) {
            showToast('Este telefone já está cadastrado! Acesse "Meus Pontos" para consultar.', true);
            return;
        }
        
        // Criar novo cliente com pontos de boas-vindas
        const novoCliente = {
            name: nome,
            phone: telefone,
            email: email || '',
            points: PONTOS.BOAS_VINDAS,
            total_trips: 0,
            total_referrals: 0,
            total_surveys: 0
        };
        
        const response = await fetch('tables/customers', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(novoCliente)
        });
        
        if (response.ok) {
            const clienteCriado = await response.json();
            
            // Enviar para Google Sheets se configurado
            if (GOOGLE_SCRIPT_URL) {
                await enviarParaGoogleSheets(clienteCriado);
            }
            
            showToast(`🎉 Cadastro realizado! Você ganhou ${PONTOS.BOAS_VINDAS} pontos de boas-vindas!`);
            
            // Reset form
            document.getElementById('cadastro-form').reset();
            
            // Redirecionar para consulta de pontos após 2 segundos
            setTimeout(() => {
                document.getElementById('consulta-telefone').value = telefone;
                document.querySelector('a[href="#consulta"]').click();
                consultarPontos();
            }, 2000);
        } else {
            throw new Error('Erro ao cadastrar');
        }
        
    } catch (error) {
        console.error('Erro ao cadastrar cliente:', error);
        showToast('Erro ao realizar cadastro. Tente novamente.', true);
    }
});

// Enviar dados para Google Sheets
async function enviarParaGoogleSheets(cliente) {
    if (!GOOGLE_SCRIPT_URL) {
        console.log('Google Script URL não configurada');
        return;
    }
    
    try {
        const dados = {
            action: 'addCustomer',
            data: {
                name: cliente.name,
                phone: cliente.phone,
                email: cliente.email || '',
                points: cliente.points,
                date: new Date().toLocaleString('pt-PT')
            }
        };
        
        await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(dados)
        });
        
        console.log('Dados enviados para Google Sheets');
    } catch (error) {
        console.error('Erro ao enviar para Google Sheets:', error);
    }
}

// Pesquisa Form
document.getElementById('pesquisa-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const telefone = document.getElementById('pesquisa-telefone').value.trim();
    const comentarios = document.getElementById('comentarios').value.trim();
    
    if (!telefone) {
        showToast('Por favor, informe o telefone', true);
        return;
    }
    
    if (!ratings.geral || !ratings.motorista || !ratings.veiculo || 
        !ratings.pontualidade || !ratings.atendimento) {
        showToast('Por favor, avalie todos os itens', true);
        return;
    }
    
    try {
        // Verificar se cliente existe
        const clienteResponse = await fetch(`tables/customers?search=${encodeURIComponent(telefone)}`);
        const clienteData = await clienteResponse.json();
        
        if (!clienteData.data || clienteData.data.length === 0) {
            showToast('Cliente não encontrado. Entre em contato conosco.', true);
            return;
        }
        
        const cliente = clienteData.data[0];
        
        // Salvar pesquisa
        await fetch('tables/surveys', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                customer_id: cliente.id,
                phone: telefone,
                rating_general: ratings.geral,
                rating_driver: ratings.motorista,
                rating_vehicle: ratings.veiculo,
                rating_punctuality: ratings.pontualidade,
                rating_service: ratings.atendimento,
                comments: comentarios
            })
        });
        
        // Atualizar pontos do cliente (+5 pontos)
        const novosPontos = (cliente.points || 0) + PONTOS.PESQUISA;
        const totalPesquisas = (cliente.total_surveys || 0) + 1;
        
        await fetch(`tables/customers/${cliente.id}`, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                points: novosPontos,
                total_surveys: totalPesquisas
            })
        });
        
        showToast(`Obrigado! Você ganhou ${PONTOS.PESQUISA} pontos!`);
        
        // Reset form
        document.getElementById('pesquisa-form').reset();
        ratings = {
            geral: 0,
            motorista: 0,
            veiculo: 0,
            pontualidade: 0,
            atendimento: 0
        };
        
        // Reset stars
        document.querySelectorAll('.stars i').forEach(star => {
            star.classList.remove('fas');
            star.classList.add('far');
        });
        
    } catch (error) {
        console.error('Erro ao enviar pesquisa:', error);
        showToast('Erro ao enviar pesquisa', true);
    }
});
// Admin Tabs
function showAdminTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    document.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));
    document.getElementById(`tab-${tab}`).classList.remove('hidden');
    
    if (tab === 'cliente') {
        loadClientes();
    }
}

// Viagem Form
document.getElementById('viagem-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const telefone = document.getElementById('viagem-telefone').value.trim();
    const origem = document.getElementById('viagem-origem').value.trim();
    const destino = document.getElementById('viagem-destino').value.trim();
    const valor = parseFloat(document.getElementById('viagem-valor').value) || 0;
    
    if (!telefone) {
        showToast('Por favor, informe o telefone do cliente', true);
        return;
    }
    
    try {
        // Buscar cliente
        const clienteResponse = await fetch(`tables/customers?search=${encodeURIComponent(telefone)}`);
        const clienteData = await clienteResponse.json();
        
        if (!clienteData.data || clienteData.data.length === 0) {
            showToast('Cliente não encontrado. Cadastre-o primeiro.', true);
            return;
        }
        
        const cliente = clienteData.data[0];
        
        // Registrar viagem
        await fetch('tables/trips', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                customer_id: cliente.id,
                phone: telefone,
                origin: origem,
                destination: destino,
                amount: valor
            })
        });
        
        // Atualizar pontos (+5 pontos)
        const novosPontos = (cliente.points || 0) + PONTOS.VIAGEM;
        const totalViagens = (cliente.total_trips || 0) + 1;
        
        await fetch(`tables/customers/${cliente.id}`, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                points: novosPontos,
                total_trips: totalViagens
            })
        });
        
        showToast(`Viagem registrada! Cliente ganhou ${PONTOS.VIAGEM} pontos`);
        document.getElementById('viagem-form').reset();
        
    } catch (error) {
        console.error('Erro ao registrar viagem:', error);
        showToast('Erro ao registrar viagem', true);
    }
});

// Indicação Form
document.getElementById('indicacao-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const telefoneIndicador = document.getElementById('indicacao-quem-indica').value.trim();
    const nomeAmigo = document.getElementById('indicacao-amigo-nome').value.trim();
    const telefoneAmigo = document.getElementById('indicacao-amigo-telefone').value.trim();
    
    if (!telefoneIndicador || !nomeAmigo || !telefoneAmigo) {
        showToast('Por favor, preencha todos os campos', true);
        return;
    }
    
    try {
        // Buscar cliente indicador
        const indicadorResponse = await fetch(`tables/customers?search=${encodeURIComponent(telefoneIndicador)}`);
        const indicadorData = await indicadorResponse.json();
        
        if (!indicadorData.data || indicadorData.data.length === 0) {
            showToast('Cliente indicador não encontrado', true);
            return;
        }
        
        const indicador = indicadorData.data[0];
        
        // Verificar se amigo já existe
        const amigoResponse = await fetch(`tables/customers?search=${encodeURIComponent(telefoneAmigo)}`);
        const amigoData = await amigoResponse.json();
        
        let amigo;
        
        if (!amigoData.data || amigoData.data.length === 0) {
            // Criar novo cliente para o amigo
            const novoAmigoResponse = await fetch('tables/customers', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    name: nomeAmigo,
                    phone: telefoneAmigo,
                    points: PONTOS.AMIGO_INDICADO,
                    total_trips: 0,
                    total_referrals: 0,
                    total_surveys: 0
                })
            });
            amigo = await novoAmigoResponse.json();
        } else {
            amigo = amigoData.data[0];
            
            // Adicionar pontos ao amigo (+10 pontos)
            const novosPontosAmigo = (amigo.points || 0) + PONTOS.AMIGO_INDICADO;
            await fetch(`tables/customers/${amigo.id}`, {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    points: novosPontosAmigo
                })
            });
        }
        
        // Registrar indicação
        await fetch('tables/referrals', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                referrer_id: indicador.id,
                referrer_phone: telefoneIndicador,
                referred_id: amigo.id,
                referred_name: nomeAmigo,
                referred_phone: telefoneAmigo
            })
        });
        
        // Atualizar pontos do indicador (+10 pontos)
        const novosPontosIndicador = (indicador.points || 0) + PONTOS.INDICACAO;
        const totalIndicacoes = (indicador.total_referrals || 0) + 1;
        
        await fetch(`tables/customers/${indicador.id}`, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                points: novosPontosIndicador,
                total_referrals: totalIndicacoes
            })
        });
        
        showToast(`Indicação registrada! Indicador ganhou ${PONTOS.INDICACAO} pontos e amigo ganhou ${PONTOS.AMIGO_INDICADO} pontos`);
        document.getElementById('indicacao-form').reset();
        
    } catch (error) {
        console.error('Erro ao registrar indicação:', error);
        showToast('Erro ao registrar indicação', true);
    }
});
// Cliente Form
document.getElementById('cliente-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const nome = document.getElementById('cliente-nome').value.trim();
    const telefone = document.getElementById('cliente-telefone').value.trim();
    
    if (!nome || !telefone) {
        showToast('Por favor, preencha todos os campos', true);
        return;
    }
    
    try {
        // Verificar se já existe
        const existeResponse = await fetch(`tables/customers?search=${encodeURIComponent(telefone)}`);
        const existeData = await existeResponse.json();
        
        if (existeData.data && existeData.data.length > 0) {
            // Atualizar
            const cliente = existeData.data[0];
            await fetch(`tables/customers/${cliente.id}`, {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ name: nome })
            });
            showToast('Cliente atualizado com sucesso!');
        } else {
            // Criar novo
            await fetch('tables/customers', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    name: nome,
                    phone: telefone,
                    points: 0,
                    total_trips: 0,
                    total_referrals: 0,
                    total_surveys: 0
                })
            });
            showToast('Cliente cadastrado com sucesso!');
        }
        
        document.getElementById('cliente-form').reset();
        loadClientes();
        
    } catch (error) {
        console.error('Erro ao salvar cliente:', error);
        showToast('Erro ao salvar cliente', true);
    }
});

// Load Clientes
async function loadClientes() {
    try {
        const response = await fetch('tables/customers?limit=100&sort=-points');
        const data = await response.json();
        
        const listaDiv = document.getElementById('lista-clientes');
        
        if (data.data && data.data.length > 0) {
            listaDiv.innerHTML = data.data.map(cliente => `
                <div class="cliente-item">
                    <div class="cliente-info">
                        <h4>${cliente.name}</h4>
                        <p><i class="fas fa-phone"></i> ${cliente.phone}</p>
                        <p>
                            <i class="fas fa-taxi"></i> ${cliente.total_trips || 0} viagens | 
                            <i class="fas fa-users"></i> ${cliente.total_referrals || 0} indicações | 
                            <i class="fas fa-star"></i> ${cliente.total_surveys || 0} pesquisas
                        </p>
                    </div>
                    <div class="cliente-pontos">
                        ${cliente.points || 0} pts
                    </div>
                </div>
            `).join('');
        } else {
            listaDiv.innerHTML = '<p class="loading">Nenhum cliente cadastrado</p>';
        }
    } catch (error) {
        console.error('Erro ao carregar clientes:', error);
        document.getElementById('lista-clientes').innerHTML = 
            '<p class="loading">Erro ao carregar clientes</p>';
    }
}

// Enviar Pesquisa WhatsApp
document.getElementById('enviar-pesquisa-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const telefone = document.getElementById('enviar-telefone').value.trim();
    
    if (!telefone) {
        showToast('Por favor, informe o telefone do cliente', true);
        return;
    }
    
    const linkPesquisa = `${window.location.origin}${window.location.pathname}#pesquisa`;
    
    const mensagem = `🚖 *Grutur Táxi*\n\n` +
        `Olá! Esperamos que tenha gostado da sua viagem conosco.\n\n` +
        `Responda nossa pesquisa de satisfação e *ganhe 5 pontos* no nosso Programa de Fidelização!\n\n` +
        `📝 Acesse: ${linkPesquisa}\n\n` +
        `Obrigado por escolher a Grutur! 🙏`;
    
    const whatsappUrl = `https://wa.me/${telefone.replace(/\D/g, '')}?text=${encodeURIComponent(mensagem)}`;
    
    window.open(whatsappUrl, '_blank');
    showToast('Link do WhatsApp aberto!');
    
    document.getElementById('enviar-pesquisa-form').reset();
});

// Configuração Google Sheets Form
document.getElementById('config-google-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const url = document.getElementById('google-script-url').value.trim();
    
    if (!url) {
        showToast('Por favor, informe a URL do Google Apps Script', true);
        return;
    }
    
    if (!url.includes('script.google.com') || !url.includes('/exec')) {
        showToast('URL inválida. Use a URL completa do Google Apps Script', true);
        return;
    }
    
    localStorage.setItem('google_script_url', url);
    GOOGLE_SCRIPT_URL = url;
    
    document.getElementById('config-status').style.display = 'block';
    showToast('✅ Integração com Google Sheets configurada com sucesso!');
});

// Initialize tables on page load
async function initializeTables() {
    try {
        await fetch('tables/customers', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                name: 'Teste Inicial',
                phone: '+351000000000',
                points: 0,
                total_trips: 0,
                total_referrals: 0,
                total_surveys: 0
            })
        }).catch(() => {});
    } catch (error) {
        console.log('Tables already initialized');
    }
}

// Run initialization on load
window.addEventListener('load', () => {
    initializeTables();
    
    const savedUrl = localStorage.getItem('google_script_url');
    if (savedUrl) {
        document.getElementById('google-script-url').value = savedUrl;
        document.getElementById('config-status').style.display = 'block';
    }
    
    if (!GOOGLE_SCRIPT_URL && window.location.hash !== '#admin') {
        console.log('Google Script URL não configurada. Configure no painel Admin.');
    }
});
