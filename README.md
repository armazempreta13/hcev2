# HCE - Website Corporativo

Website corporativo da HCE Esquadrias construído com React + TypeScript + Vite.

## 🚀 Como rodar localmente

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/armazempreta13/hcev2.git
cd hcev2
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env.local
```

Edite o arquivo `.env.local` e adicione suas chaves de API:
```
VITE_GEMINI_API_KEY=sua_chave_aqui
```

4. Rode o servidor de desenvolvimento:
```bash
npm run dev
```

Acesse http://localhost:3000 no seu navegador.

## 📦 Build para produção

```bash
npm run build
```

Os arquivos otimizados serão gerados em `dist/`.

## 🌐 Deploy no Render

1. Faça push do código para o repositório no GitHub
2. Conecte o repositório ao Render.com
3. Configure as variáveis de ambiente no Render:
   - `VITE_GEMINI_API_KEY`: Sua chave de API do Gemini
4. O Render automaticamente fará build e deployment a cada push na branch main

## 📁 Estrutura do Projeto

```
├── components/          # Componentes React
│   ├── ui/             # Componentes UI reutilizáveis
│   └── utils/          # Funções utilitárias
├── dist/               # Build otimizado (gerado após npm run build)
├── index.html          # Arquivo HTML principal
├── index.tsx           # Ponto de entrada da aplicação
├── App.tsx             # Componente raiz
├── vite.config.ts      # Configuração do Vite
└── tsconfig.json       # Configuração do TypeScript
```

## 🛠️ Tecnologias utilizadas

- **React 19** - Biblioteca JavaScript para UI
- **TypeScript** - Tipagem estática para JavaScript
- **Vite** - Build tool e dev server
- **React Router** - Navegação entre páginas
- **React Icons** - Ícones SVG

## 📝 Scripts disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Faz build para produção
- `npm run preview` - Visualiza o build de produção localmente

## 📄 Licença

Este projeto é proprietário da HCE Esquadrias.
