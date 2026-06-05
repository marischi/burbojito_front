# Burbojito - FrontEnd

Projeto FrontEnd desenvolvido para a disciplina de Projeto em Engenharia da Computação do Mestrado em Inovação Tecnológica da UNIFESP.

O sistema faz parte do projeto Burbojito, uma aplicação em desenvolvimento voltada para gerenciamento e acompanhamento de usuários/pacientes.

O projeto foi desenvolvido utilizando HTML, CSS e JavaScript Vanilla, com arquitetura modular no frontend e dados simulados através de mock local, enquanto o backend encontra-se em desenvolvimento.

---

## Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript Vanilla

---

## Estrutura do Projeto

O sistema possui as seguintes telas:

- Login
- Dashboard/Painel
- Notificações
- Pacientes
- Configurações de Perfil

---

## Arquitetura FrontEnd

O projeto foi organizado utilizando separação por responsabilidades, visando melhor manutenção e escalabilidade do código.

### Estrutura de Pastas

```bash
📁 assets
 ┣ 📁 icons
 ┣ 📁 images
 ┃ ┣ 📄 exemplo-relatorio.jpeg
 ┃ ┣ 📄 logo.png
 ┃ ┗ 📄 mapa-brasil.jpeg
 ┣ 📁 css
 ┃ ┣ 📄 base.css
 ┃ ┣ 📄 components.css
 ┃ ┣ 📄 layout.css
 ┃ ┣ 📄 pages.css
 ┃ ┣ 📄 reset.css
 ┃ ┗ 📄 variables.css
 ┗ 📁 js
   ┣ 📁 features
   ┃ ┣ 📁 dashboard
   ┃ ┃ ┗ 📄 dashboard.js
   ┃ ┣ 📁 login
   ┃ ┃ ┗ 📄 login.js
   ┃ ┣ 📁 notifications
   ┃ ┃ ┗ 📄 notifications.js
   ┃ ┣ 📁 patients
   ┃ ┃ ┗ 📄 patients.js
   ┃ ┗ 📁 profile
   ┃   ┗ 📄 profile.js
   ┣ 📁 services
   ┃ ┣ 📄 auth.service.js
   ┃ ┣ 📄 evaluations.service.js
   ┃ ┣ 📄 notifications.service.js
   ┃ ┣ 📄 patients.service.js
   ┃ ┗ 📄 user.service.js
   ┣ 📁 shared
   ┃ ┣ 📄 auth-guard.js
   ┃ ┗ 📄 sidebar.js
   ┣ 📁 utils
   ┃ ┗ 📄 dom-helpers.js
   ┗ 📁 mock
     ┗ 📄 mock-data.js

📄 index.html
📄 pacientes.html
📄 notificacoes.html
📄 ajustes.html
📄 tablero.html
📄 LICENSE
📄 .gitignore
📄 README.md
```

---

## Objetivo do Projeto

O objetivo deste projeto é desenvolver a interface visual e estrutural da aplicação, permitindo:

- validação de fluxos de navegação;
- testes iniciais de usabilidade;
- organização da arquitetura frontend;
- preparação para futura integração com APIs e backend.

---

## Funcionalidades Implementadas

- Sistema de login
- Dashboard administrativo
- Listagem de pacientes
- Sistema de notificações
- Configuração de perfil
- Simulação de autenticação
- Mock de dados locais
- Separação modular de responsabilidades
- Estrutura preparada para integração backend

---

## Backend

O backend da aplicação encontra-se em desenvolvimento.

Atualmente, os dados são simulados localmente através de arquivos mockados em JavaScript para permitir testes de navegação e comportamento da interface.

---

## Responsividade

O projeto não possui implementação responsiva neste estágio de desenvolvimento.

O foco atual está na construção da arquitetura frontend, organização estrutural do código e validação funcional das telas.

---

## Como Executar o Projeto

1. Clone o repositório:

```bash
git clone URL_DO_REPOSITORIO
```

2. Acesse a pasta do projeto:

```bash
cd nome-do-projeto
```

3. Abra o arquivo `index.html` no navegador.

---

## Status do Projeto

🚧 Projeto em desenvolvimento

---

## Autor

Projeto acadêmico desenvolvido para a disciplina de Projeto em Engenharia da Computação do Mestrado em Inovação Tecnológica da UNIFESP.

FrontEnd desenvolvido para fins de prototipação e validação estrutural do sistema Burbojito.
