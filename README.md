# 🥁 Landing Page — Aulas de Bateria com Prof. Márcio Machado

Landing page de alta conversão para aulas particulares de bateria (infantil e adulto) com o **Prof. Márcio Machado** em **Teófilo Otoni — MG**.

---

## 🚀 Tecnologias Utilizadas

- **HTML5 Semântico**: Otimizado para SEO, acessibilidade e carregamento ultrarrápido.
- **CSS3 Vanilla**: Design system temático Dark Stage com efeitos de iluminação âmbar/dourada (`#ff9800`, `#f59e0b`), glassmorphism e responsividade completa.
- **JavaScript Vanilla**:
  - FAQ com accordions dinâmicos.
  - Carrossel com navegação e suporte a touch.
  - Sintetizador sonoro em tempo real via **Web Audio API** com equalizador animado.
  - Botão flutuante de WhatsApp e gerador de mensagens pré-formatadas.

---

## 📁 Estrutura de Arquivos

```
Site Bateria/
├── index.html                   # Página principal
├── .gitignore                   # Arquivos ignorados pelo Git
├── README.md                    # Documentação do projeto
└── assets/
    ├── css/
    │   └── style.css            # Folha de estilos e animações
    ├── js/
    │   └── main.js              # Lógica interativa e Web Audio
    └── images/
        ├── aula-adulto.jpg       # Foto da aula com aluno adulto
        ├── aula-criancas.jpg     # Foto da aula com crianças
        ├── professor-palco.jpg   # Foto do professor tocando no palco
        ├── professor-perfil.jpg  # Foto de perfil com baqueta
        └── mockup-referencia.png # Imagem do layout de referência
```

---

## ⚙️ Configuração do WhatsApp

Para alterar o número do WhatsApp de atendimento, abra o arquivo `assets/js/main.js` e atualize a constante `CONFIG`:

```javascript
const CONFIG = {
  whatsappNumber: '5533999999999', // Insira o DDI + DDD + Telefone (ex: 5533998765432)
  whatsappDefaultMessage: 'Olá, professor! Vi o anúncio das aulas particulares de bateria e gostaria de saber como funciona e quais horários estão disponíveis.',
  whatsappExperimentalMessage: 'Olá, professor! Gostaria de agendar uma aula experimental de bateria e conhecer o método!'
};
```

---

## 💻 Como Visualizar Localmente

Abra diretamente o arquivo `index.html` em qualquer navegador ou inicie um servidor estático local:

```bash
# Com Python
python -m http.server 8088

# Ou com Node.js
npx serve
```
