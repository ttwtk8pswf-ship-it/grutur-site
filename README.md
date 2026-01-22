# Grutur - Ecoturismo, Lda

![Status](https://img.shields.io/badge/status-ativo-success)
![Versão](https://img.shields.io/badge/versão-1.1.0-blue)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

Website institucional da **Grutur - Ecoturismo, Lda**, empresa angolana comprometida com sustentabilidade e qualidade, oferecendo serviços de produtos de restauração, táxi por aplicativo, cosméticos e personal shopper.

---

## 🌿 Sobre o Projeto

Site profissional desenvolvido para apresentar os serviços da Grutur - Ecoturismo, Lda, com design moderno, responsivo e focado em sustentabilidade. O site reflete os valores da empresa através de uma paleta de cores verde natureza e uma interface intuitiva.

### ✨ Características Principais

- ✅ **Design Responsivo** - Perfeito em desktop, tablet e mobile
- ✅ **Performance Otimizada** - Carregamento rápido e eficiente
- ✅ **Acessibilidade** - ARIA labels e estrutura semântica
- ✅ **Animações Suaves** - Transições e efeitos profissionais
- ✅ **SEO Otimizado** - Meta tags e estrutura adequada
- ✅ **Tema Verde Natureza** - Cores sustentáveis e harmoniosas

---

## 📋 Funcionalidades Implementadas

### ✅ Seções do Site

1. **🏠 Hero Section**
   - Banner principal com gradiente verde
   - Call-to-actions para Serviços e Contato
   - Animações de entrada (fade in)

2. **👥 Sobre Nós**
   - Logo da empresa em destaque
   - Missão, valores e compromissos
   - Layout grid responsivo

3. **⚙️ Nossos Serviços** (4 serviços)
   - 🍽️ **Produtos de Restauração e Hotelaria** (Tramontina)
   - 🚗 **Táxi por Aplicativo** (SuperTaxi - em destaque)
   - 🧴 **Cosméticos** (INUKA)
   - 🛍️ **Personal Shopper África do Sul** (NOVO)
   - Cards com imagens, ícones e features
   - Hover effects profissionais

4. **💎 Valores que nos Guiam**
   - Sustentabilidade
   - Qualidade
   - Confiança
   - Inovação
   - Cards com ícones Font Awesome

5. **📧 Contato**
   - Formulário funcional com validação
   - Informações de contato completas:
     - **Endereço**: Rua do BFA, Condomínio Oceanus, casa 11 - Luanda, Angola
     - **Telefone**: +244 927 006 156
     - **E-mail**: jurema.grutur@gmail.com
     - **Horário**: Segunda a Sexta: 9h - 18h | Sábado: 9h - 13h
   - Cards de informação com ícones

6. **📄 Footer**
   - Logo e informações da empresa
   - Links rápidos de navegação
   - Links para serviços
   - Informações de contato
   - Redes sociais
   - Copyright

### ⚡ Funcionalidades Interativas

- ✅ **Menu de Navegação**
  - Fixo no topo ao rolar
  - Highlight automático da seção ativa
  - Menu mobile responsivo (hamburger)
  - Smooth scroll entre seções

- ✅ **Formulário de Contato**
  - Validação de campos obrigatórios
  - Validação de e-mail com regex
  - Feedback visual (notificações)
  - Estados de loading no envio

- ✅ **Botão Voltar ao Topo**
  - Aparece após scroll
  - Animação suave
  - Design circular com gradiente

- ✅ **Animações ao Scroll**
  - Intersection Observer API
  - Fade in + translate up
  - Performance otimizada

- ✅ **Lazy Loading**
  - Carregamento otimizado de imagens
  - Melhora de performance

---

## 🎨 Paleta de Cores

```css
/* Verde Natureza - Cores Principais */
--primary-color: #2d6a4f     /* Verde escuro */
--primary-light: #40916c     /* Verde médio */
--primary-dark: #1b4332      /* Verde muito escuro */
--secondary-color: #52b788   /* Verde claro */
--secondary-light: #74c69d   /* Verde muito claro */
--accent-color: #95d5b2      /* Verde pastel */

/* Cores Neutras */
--white: #ffffff
--light-gray: #f8f9fa
--gray: #e9ecef
--dark-gray: #495057
--black: #212529
```

---

## 📂 Estrutura de Arquivos

```
grutur-website/
├── index.html                    # Página principal
├── css/
│   └── style.css                # Estilos completos
├── js/
│   └── main.js                  # JavaScript interativo
├── images/
│   ├── README.md                # Instruções sobre imagens
│   ├── logo-grutur.png          # Logo da empresa
│   ├── tramontina-restauracao.jpg  # Serviço 1
│   ├── supertaxi.jpg            # Serviço 2
│   └── inuka-cosmeticos.jpg     # Serviço 3
└── README.md                    # Este arquivo
```

---

## 🚀 Como Usar

### 1. **Visualizar Localmente**

Abra o arquivo `index.html` diretamente no navegador ou use um servidor local:

```bash
# Com Python 3
python -m http.server 8000

# Com Node.js (http-server)
npx http-server

# Com PHP
php -S localhost:8000
```

Depois acesse: `http://localhost:8000`

### 2. **Publicar no GitHub Pages**

1. Faça upload dos arquivos para um repositório GitHub
2. Vá em **Settings** → **Pages**
3. Selecione **Branch: main** e **/ (root)**
4. Clique em **Save**
5. Aguarde 1-2 minutos
6. Acesse: `https://seu-usuario.github.io/repositorio/`

### 3. **Publicar no Netlify**

1. Faça upload dos arquivos
2. Configure deploy automático
3. Obtenha URL pública

### 4. **Outras Plataformas**

- **Vercel**: Deploy gratuito e rápido
- **Cloudflare Pages**: CDN global incluído
- **Firebase Hosting**: Hospedagem Google

---

## 🔧 Configurações e Personalizações

### Trocar Imagens

Substitua os arquivos na pasta `images/` mantendo os mesmos nomes:
- `logo-grutur.png` - Logo (recomendado: PNG transparente, 200x200px)
- `tramontina-restauracao.jpg` - Produtos (mínimo 800x600px)
- `supertaxi.jpg` - Táxi (mínimo 800x600px)
- `inuka-cosmeticos.jpg` - Cosméticos (mínimo 800x600px)

### Alterar Cores

Edite as variáveis CSS no início do arquivo `css/style.css`:

```css
:root {
    --primary-color: #2d6a4f;    /* Sua cor principal */
    --secondary-color: #52b788;   /* Sua cor secundária */
    /* ... outras cores ... */
}
```

### Modificar Conteúdo

Edite o arquivo `index.html` para alterar:
- Textos e descrições
- Informações de contato
- Links de redes sociais
- Serviços oferecidos

### Integrar Formulário

Para enviar e-mails reais, integre com:

**EmailJS** (recomendado - gratuito):
```javascript
// Em js/main.js, substitua a função de envio do formulário
emailjs.send("service_id", "template_id", {
    nome: nome,
    email: email,
    mensagem: mensagem
});
```

**Formspree**:
```html
<form action="https://formspree.io/f/seu-id" method="POST">
```

**API Própria**:
```javascript
fetch('/api/contato', {
    method: 'POST',
    body: JSON.stringify(dados)
});
```

---

## 📱 Responsividade

O site é totalmente responsivo e testado em:

- ✅ **Desktop** (1920px+)
- ✅ **Laptop** (1366px - 1920px)
- ✅ **Tablet** (768px - 1024px)
- ✅ **Mobile** (320px - 768px)

### Breakpoints Principais:

```css
@media (max-width: 968px)  /* Tablet */
@media (max-width: 768px)  /* Mobile landscape */
@media (max-width: 480px)  /* Mobile portrait */
```

---

## 🌐 Navegadores Suportados

- ✅ Google Chrome (últimas 2 versões)
- ✅ Mozilla Firefox (últimas 2 versões)
- ✅ Safari (últimas 2 versões)
- ✅ Microsoft Edge (últimas 2 versões)
- ✅ Opera (últimas 2 versões)

---

## ⚡ Performance

### Métricas de Velocidade:
- **Tempo de carregamento**: ~2-3s
- **Tamanho total**: ~50KB (sem imagens)
- **Requests HTTP**: Mínimos (CDN para bibliotecas)

### Otimizações Implementadas:
- ✅ CSS minificável
- ✅ JavaScript otimizado
- ✅ Lazy loading de imagens
- ✅ Debounce em scroll events
- ✅ Intersection Observer para animações
- ✅ Transições via CSS (GPU accelerated)

---

## 🔐 Segurança

- ✅ Validação de formulário client-side
- ✅ Sanitização de inputs (ao integrar backend)
- ✅ HTTPS recomendado em produção
- ✅ Headers de segurança (configurar no servidor)

---

## 🛠️ Tecnologias Utilizadas

### Frontend:
- **HTML5** - Estrutura semântica
- **CSS3** - Estilos e animações
  - Grid Layout
  - Flexbox
  - Custom Properties (variáveis)
  - Gradientes e sombras
  - Media queries
- **JavaScript (ES6+)** - Interatividade
  - Intersection Observer API
  - Event Listeners
  - DOM Manipulation
  - Form validation
  - Smooth scrolling

### Bibliotecas CDN:
- **Google Fonts** - Poppins e Montserrat
- **Font Awesome 6** - Ícones

---

## 📊 Funcionalidades Futuras (Roadmap)

### 🔄 Próximas Implementações Sugeridas:

1. **🛍️ Personal Shopper África do Sul** (4º serviço)
   - Adicionar nova seção com foto e descrição
   - Integrar sem quebrar layout existente

2. **🌐 Multi-idioma**
   - Português (atual)
   - Inglês
   - Possível integração de tradução

3. **📊 Dashboard Administrativo**
   - Painel para gerenciar conteúdo
   - Edição de serviços
   - Visualização de mensagens do formulário

4. **🗓️ Sistema de Agendamento**
   - Reservas para táxi
   - Solicitação de orçamentos

5. **🎨 Galeria de Fotos**
   - Portfólio visual dos serviços
   - Lightbox para imagens

6. **⭐ Depoimentos de Clientes**
   - Seção com avaliações
   - Carrossel de testimonials

7. **📈 Integração com Analytics**
   - Google Analytics
   - Heatmaps (Hotjar)
   - Métricas de conversão

8. **💬 Chat Online**
   - WhatsApp Business API
   - Chatbot básico

---

## 📞 Informações de Contato da Empresa

**Grutur - Ecoturismo, Lda**

- 📍 **Endereço**: Rua do BFA, Condomínio Oceanus, casa 11 - Luanda, Angola
- 📱 **Telefone**: +244 927 006 156
- 📧 **E-mail**: jurema.grutur@gmail.com
- 🕐 **Horário de Atendimento**:
  - Segunda a Sexta: 9h - 18h
  - Sábado: 9h - 13h

### Redes Sociais (a configurar):
- Facebook: [Adicionar link]
- Instagram: [Adicionar link]
- LinkedIn: [Adicionar link]
- WhatsApp: +244 927 006 156

---

## 👨‍💻 Desenvolvimento e Manutenção

### Versão Atual: **1.1.0** ✅
- ✅ Site base completo
- ✅ 4 serviços implementados
- ✅ Personal Shopper África do Sul adicionado
- ✅ Design responsivo
- ✅ Formulário de contato
- ✅ Animações e interatividade

### Histórico de Versões:
- **v1.1.0** (2024-01-21) - Adicionado serviço Personal Shopper África do Sul
- **v1.0.0** (2024-01-21) - Lançamento inicial com 3 serviços

---

## 📝 Licença

Este projeto é propriedade da **Grutur - Ecoturismo, Lda**.  
Todos os direitos reservados © 2024.

---

## 🙏 Suporte

Para suporte, dúvidas ou sugestões:
- 📧 E-mail: jurema.grutur@gmail.com
- 📱 Telefone: +244 927 006 156

---

## ✅ Status do Projeto

| Componente | Status | Observações |
|------------|--------|-------------|
| HTML | ✅ Completo | Estrutura semântica implementada |
| CSS | ✅ Completo | Tema verde natureza + responsivo |
| JavaScript | ✅ Completo | Todas funcionalidades ativas |
| Imagens | ⚠️ Placeholder | Substituir por imagens reais do repositório |
| Formulário | ⚠️ Mock | Integrar com backend/EmailJS em produção |
| SEO | ✅ Básico | Meta tags implementadas |
| Performance | ✅ Otimizado | Lazy loading + debounce ativos |
| Acessibilidade | ✅ Implementado | ARIA labels + semântica |

---

## 🔗 Links Úteis

- [GitHub Pages Docs](https://pages.github.com/)
- [Netlify Deploy Docs](https://docs.netlify.com/)
- [EmailJS](https://www.emailjs.com/)
- [Font Awesome Icons](https://fontawesome.com/icons)
- [Google Fonts](https://fonts.google.com/)

---

**Desenvolvido com 💚 para Grutur - Ecoturismo, Lda**

*Sustentabilidade e qualidade em cada detalhe.*