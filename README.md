<div id="top"></div>

<!-- HEADER STYLE: CLASSIC -->
<div align="center">

<h1 align="center">💬 PLENARY — Real-Time Chat Web Application</h1>
<p align="center"><em>Transforming Conversations • Igniting Instant Collaboration</em></p>

<!-- BADGES -->

<a href="https://github.com/MA1002643/plenary/blob/main/LICENSE" alt="license">
   <img src="https://img.shields.io/badge/license-MIT-green?style=flat&logo=opensourceinitiative&logoColor=white" alt="MIT License" />
</a>
<img src="https://img.shields.io/github/last-commit/MA1002643/plenary?style=flat&logo=git&logoColor=white&color=0080ff" alt="last-commit">
<a href="https://github.com/MA1002643/plenary/discussions" alt="Discussions">
   <img src="https://img.shields.io/github/discussions/MA1002643/plenary" alt="Discussions" />
</a>
<a href="https://github.com/MA1002643/plenary/stargazers">
   <img src="https://custom-icon-badges.demolab.com/github/stars/MA1002643/plenary?logo=star&style=flat" alt="stars" />
</a>
<a href="https://github.com/MA1002643/plenary/issues">
   <img src="https://custom-icon-badges.demolab.com/github/issues-raw/MA1002643/plenary?logo=issue" alt="issues" />
</a>
<br>
<br>
<em>Built with the tools and technologies:</em>
<br>
<br>
<!-- TECH-STACK:START -->

<div align="center" style="display:flex;flex-wrap:wrap;gap:6px;align-items:center;justify-content:center;margin:0 auto;">
<img src="https://img.shields.io/badge/env-cmd-444444.svg?style=flat&logo=env-cmd&logoColor=white" alt="env-cmd">
<img src="https://img.shields.io/badge/Express-000000.svg?style=flat&logo=express&logoColor=white" alt="Express">
<img src="https://img.shields.io/badge/MySQL-4479A1.svg?style=flat&logo=mysql&logoColor=white" alt="MySQL">
<img src="https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=flat&logo=javascript&logoColor=white" alt="JavaScript">
<img src="https://img.shields.io/badge/SQL-444444.svg?style=flat&logo=sql&logoColor=white" alt="SQL">
<img src="https://img.shields.io/badge/HTML5-E34F26.svg?style=flat&logo=html5&logoColor=white" alt="HTML5">
<img src="https://img.shields.io/badge/CSS3-1572B6.svg?style=flat&logo=css3&logoColor=white" alt="CSS3">
</div>

<!-- TECH-STACK:END -->
</div>
<br>

---

## Table of Contents

- [Overview](#overview)
- [UI Preview](#ui-preview)
- [Key Features](#key-features)
- [Project Structure](#project-structure)
  - [Project Index](#project-index)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Testing](#testing)
- [Learning Outcomes](#learning-outcomes)
- [Roadmap](#roadmap)
- [Contributors](#contributors)
- [Acknowledgments](#acknowledgments)
- [License](#license)

---

<a id="overview"></a>

## ✨ Overview

**Plenary – Real-Time Chat Web Application** is a full-stack chat platform built on WebSockets for low-latency, bi-directional messaging. It provides real-time messaging, persistent MySQL-backed storage, and dynamic chatroom management for Q&A and group collaboration.

---

<a id="ui-preview"></a>

## 🎨 UI Preview

|                     Chatroom Interface                     |                  Real-Time Messaging                  |
| :--------------------------------------------------------: | :---------------------------------------------------: |
| ![Chatroom interface screenshot](screenshots/chatroom.png) | ![Live chat in action GIF](screenshots/live-chat.gif) |

---

<a id="key-features"></a>

## 🚀 Key Features

| Feature                                | Description                                                                                              |
| :------------------------------------- | :------------------------------------------------------------------------------------------------------- |
| 💬 **Real-Time Messaging (WebSocket)** | webSocketServer.js provides low-latency, bi-directional messaging between clients and the server.        |
| 🧑‍🤝‍🧑 **Room & Session Management**       | Dynamic room creation and joining, managed in server logic and persisted to the database.                |
| 🗄️ **Persistent MySQL Storage**        | SQL migrations and `test/database.sql` define schemas for rooms, messages, and questions.                |
| 🧩 **Separation of Concerns**          | `htmlServer.js`, `webSocketServer.js` and `index.js` keep frontend serving, sockets and routing modular. |
| 🧪 **Testing & Dev Utilities**         | `test/serverSide.js` and Mocha-based tests support server behaviour validation and CI checks.            |
| ⚡ **Low Latency & Broadcast**         | Message broadcasting and efficient event routing for responsive chat UX.                                 |
| 🔒 **Optional TLS / Secure Config**    | `ca.pem` and env-managed configs support local TLS testing and secure credentials handling.              |
| 🎨 **Client Interface & Examples**     | `html/` and `example chatroom html & styling/` provide sample UI, scripts and styles for integration.    |
| 🧰 **npm Scripts & Tooling**           | `package.json` exposes scripts for running servers, installing deps and running tests.                   |
| 🌐 **Cross-Platform**                  | Works across macOS, Windows and Linux; README includes quick install snippets for each platform.         |

---

<a id="project-structure"></a>

## 📁 Project Structure

```sh
└── plenary/
├── Plenary Chatroom/
│   ├── example chatroom html & styling/
│   │   ├── newChatroom.html
│   │   └── newStyle.css
│   ├── html/
│   │   ├── Chatroom.html
│   │   ├── clientSide.js
│   │   ├── Index.html
│   │   ├── MessageEvents.js
│   │   ├── Send.png
│   │   └── style.css
│   ├── Migrations/
│   │   ├── 1-AddRoomName.sql
│   │   └── 2-AddQuestions.sql
│   ├── test/
│   │   ├── database.sql
│   │   └── serverSide.js
│   ├── htmlServer.js
│   ├── index.js
│   ├── package-lock.json
│   ├── package.json
│   └── webSocketServer.js
├── .gitignore
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── LICENSE
├── README.md
└── SECURITY.md
```

---

<a id="project-index"></a>

### 📑 Project Index

<details open>
   <summary><b>PLENARY/</b></summary>
   <details>
      <summary><b>__root__</b></summary>
      <ul>
         <li><b><a href="./.gitignore">.gitignore</a></b> — File.</li>
         <li><b><a href="./CODE_OF_CONDUCT.md">CODE_OF_CONDUCT.md</a></b> — File.</li>
         <li><b><a href="./CONTRIBUTING.md">CONTRIBUTING.md</a></b> — File.</li>
         <li><b><a href="./LICENSE">LICENSE</a></b> — File.</li>
         <li><b><a href="./README.md">README.md</a></b> — Project documentation, overview and setup instructions.</li>
         <li><b><a href="./SECURITY.md">SECURITY.md</a></b> — File.</li>
      </ul>
   </details>
   <details>
      <summary><b>.github</b></summary>
      <ul>
         <li><b><a href=".github/CODEOWNERS">CODEOWNERS</a></b> — File.</li>
      </ul>
      <details>
         <summary><b>ISSUE_TEMPLATE</b></summary>
      <ul>
         <li><b><a href=".github/ISSUE_TEMPLATE/bug_report.yml">bug_report.yml</a></b> — File.</li>
         <li><b><a href=".github/ISSUE_TEMPLATE/config.yml">config.yml</a></b> — File.</li>
         <li><b><a href=".github/ISSUE_TEMPLATE/feature_request.yml">feature_request.yml</a></b> — File.</li>
      </ul>
      </details>
      <details>
         <summary><b>PULL_REQUEST_TEMPLATE</b></summary>
      <ul>
         <li><b><a href=".github/PULL_REQUEST_TEMPLATE/pull_request_template.yml">pull_request_template.yml</a></b> — File.</li>
      </ul>
      </details>
      <details>
         <summary><b>scripts</b></summary>
      <ul>
         <li><b><a href=".github/scripts/update-contributors.js">update-contributors.js</a></b> — JavaScript file.</li>
      </ul>
      </details>
      <details>
         <summary><b>workflows</b></summary>
      <ul>
         <li><b><a href=".github/workflows/ci.yml">ci.yml</a></b> — File.</li>
         <li><b><a href=".github/workflows/update-contributors.yml">update-contributors.yml</a></b> — File.</li>
         <li><b><a href=".github/workflows/update-project-index.yml">update-project-index.yml</a></b> — File.</li>
         <li><b><a href=".github/workflows/update-project-structure.yml">update-project-structure.yml</a></b> — File.</li>
         <li><b><a href=".github/workflows/update-tech-badges-single-repo.yml">update-tech-badges-single-repo.yml</a></b> — File.</li>
      </ul>
      </details>
   </details>

   <details>
      <summary><b>Plenary Chatroom</b></summary>
      <ul>
         <li><b><a href="Plenary Chatroom/htmlServer.js">htmlServer.js</a></b> — Serves static frontend assets for the chat UI.</li>
         <li><b><a href="Plenary Chatroom/index.js">index.js</a></b> — Main server entrypoint that wires HTTP and WebSocket servers.</li>
         <li><b><a href="Plenary Chatroom/package-lock.json">package-lock.json</a></b> — Lockfile with exact dependency versions.</li>
         <li><b><a href="Plenary Chatroom/package.json">package.json</a></b> — Npm manifest (dependencies & scripts).</li>
         <li><b><a href="Plenary Chatroom/webSocketServer.js">webSocketServer.js</a></b> — WebSocket server that manages connections, broadcasts and hooks.</li>
      </ul>
      <details>
         <summary><b>example chatroom html & styling</b></summary>
      <ul>
         <li><b><a href="Plenary Chatroom/example chatroom html & styling/newChatroom.html">newChatroom.html</a></b> — Example chatroom page demonstrating layout and client-side integration.</li>
         <li><b><a href="Plenary Chatroom/example chatroom html & styling/newStyle.css">newStyle.css</a></b> — Example stylesheet for the sample chatroom.</li>
      </ul>
      </details>
      <details>
         <summary><b>html</b></summary>
      <ul>
         <li><b><a href="Plenary Chatroom/html/Chatroom.html">Chatroom.html</a></b> — Main chatroom UI page.</li>
         <li><b><a href="Plenary Chatroom/html/clientSide.js">clientSide.js</a></b> — Client-side JS handling WebSocket events and UI updates.</li>
         <li><b><a href="Plenary Chatroom/html/Index.html">Index.html</a></b> — Login/landing page for users.</li>
         <li><b><a href="Plenary Chatroom/html/MessageEvents.js">MessageEvents.js</a></b> — Structured WebSocket message/event types.</li>
         <li><b><a href="Plenary Chatroom/html/Send.png">Send.png</a></b> — File.</li>
         <li><b><a href="Plenary Chatroom/html/style.css">style.css</a></b> — Stylesheet for the HTML UI.</li>
      </ul>
      </details>
      <details>
         <summary><b>Migrations</b></summary>
      <ul>
         <li><b><a href="Plenary Chatroom/Migrations/1-AddRoomName.sql">1-AddRoomName.sql</a></b> — Adds room name column/table changes.</li>
         <li><b><a href="Plenary Chatroom/Migrations/2-AddQuestions.sql">2-AddQuestions.sql</a></b> — Adds question support schema.</li>
      </ul>
      </details>
      <details>
         <summary><b>test</b></summary>
      <ul>
         <li><b><a href="Plenary Chatroom/test/database.sql">database.sql</a></b> — SQL for testing DB schemas and sample data.</li>
         <li><b><a href="Plenary Chatroom/test/serverSide.js">serverSide.js</a></b> — Test helpers and scripts.</li>
      </ul>
      </details>
   </details>


</details>

---

<a id="getting-started"></a>

## 🚀 Getting Started

<a id="prerequisites"></a>

### 📋 Prerequisites

This project requires the following dependencies:

- **Programming Language:** JavaScript
- **Package Manager:** Npm

Recommended local prerequisites:

- **Node.js (v14+ or v16+)** — Runtime for the server and build tools.
- **npm** — Package manager used for installing dependencies and running scripts.
- **MySQL (or compatible)** — Database used for persistent storage of rooms, messages and questions.
- **Git** — Recommended for version control when cloning and contributing to the project.
- **OpenSSL (optional)** — Useful for generating local certs (e.g., `ca.pem`) if you test TLS locally.

Recommended versions & download links:

- Node.js (recommended v16+ LTS): https://nodejs.org/
- npm (bundled with Node.js): https://docs.npmjs.com/
- MySQL (recommended v8+): https://dev.mysql.com/downloads/mysql/
- Git: https://git-scm.com/
- OpenSSL (optional): https://www.openssl.org/

Quick install (examples)

macOS (Homebrew)

```bash
brew update
brew install node mysql git openssl
# Start MySQL (optional)
brew services start mysql
```

Windows (Chocolatey)

```powershell
choco install nodejs-lts mysql git openssl -y
# After installing MySQL, run the MySQL installer or init steps as required
```

Debian / Ubuntu (apt — Node via NodeSource recommended)

```bash
sudo apt update
sudo apt install -y curl git mysql-server
# Install Node.js (example uses NodeSource for a modern Node LTS)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
# Secure MySQL (optional interactive step)
sudo mysql_secure_installation
```

<a id="installation"></a>

### ⚙️ Installation

Clone the repository, install dependencies and configure the database connection.

```bash
git clone https://github.com/MA1002643/plenary.git
cd plenary/Plenary\ Chatroom
npm install
# Configure your MySQL connection (see README Prerequisites) before starting the servers.
```

<a id="usage"></a>

### 💻 Usage

Start the application using the npm script. This will run the server(s) defined in `package.json`.

```bash
npm start
```

If the project uses separate scripts for the HTML server and WebSocket server, run the specific scripts (e.g. `npm run start:html` / `npm run start:ws`).

<a id="testing"></a>

### 🧪 Testing

Automated tests use Mocha. Run the test suite with:

```bash
npm test
```

For a focused run, you can run individual test files with Mocha directly, e.g.: `npx mocha test/serverSide.js`.

---

<a id="learning-outcomes"></a>

## 🎓 Learning Outcomes

- Implemented real-time WebSocket communication from scratch.
- Gained practical experience in server–client synchronisation using `ws`.
- Strengthened understanding of asynchronous programming and event-driven architecture.
- Built and tested full-stack Node.js systems with MySQL integration.
- Applied modular software design principles for maintainability and scalability.

---

<a id="roadmap"></a>

## 📈 Roadmap

- [ ] **`Task 1`**: Implement secure **authentication system** with JWT and user roles (`user`, `moderator`, `admin`).
- [ ] **`Task 2`**: Add **real-time user presence**, typing indicators, and message read receipts.
- [ ] **`Task 3`**: Integrate **file and media uploads** (images, documents) with cloud storage (e.g., AWS S3).
- [ ] **`Task 4`**: Implement **message search**, threaded replies, and emoji reactions for advanced chat interaction.
- [ ] **`Task 5`**: Add **Redis Pub/Sub** for scalable WebSocket message distribution across multiple instances.
- [ ] **`Task 6`**: Introduce **database migrations** and schema optimisation with Prisma or Knex.
- [ ] **`Task 7`**: Strengthen **security and rate limiting** using Helmet, CORS, and payload validation.
- [ ] **`Task 8`**: Expand **testing coverage** with integration, end-to-end (E2E), and performance tests.
- [ ] **`Task 9`**: Implement **PWA features** (offline mode, message queue, push notifications) for modern UX.
- [ ] **`Task 10`**: Add **DevOps enhancements** including Docker setup, CI/CD pipeline, and observability tools.

---

<a id="contributors"></a>

## 🤝 Contributors

<p align="left">
<!-- CONTRIBUTORS:START -->
<a href="https://github.com/MA1002643" title="MA1002643"><img src="https://images.weserv.nl/?url=avatars.githubusercontent.com%2Fu%2F87866666%3Fv%3D4%26s%3D96&w=48&h=48&fit=cover&mask=circle&border=white&borderwidth=2" alt="MA1002643" width="48" height="48" style="border-radius: 50%;"/></a>
<!-- CONTRIBUTORS:END -->
</p>

---

<a id="acknowledgments"></a>

## ✨ Acknowledgments

- Inspired by collaborative tools such as **Vevox** and **Slack**.
- Special thanks to **contributors** and **Node.js open-source maintainers**.
- Created as part of an **academic exploration of real-time systems architecture**.

---

<a id="license"></a>

## 📜 License

This project is licensed under the **[MIT License](https://github.com/MA1002643/plenary/blob/main/LICENSE)**. See the **[LICENSE](https://choosealicense.com/licenses/)** file for full details.

#

<p align="center">
  <strong>© 2025 Muhammad Abdullah</strong><br>
  Developed with 💙 using Node.js & Express<br>
  <a href="#top"><img alt="Back to Top" src="https://img.shields.io/badge/Back_to_Top-0A0A0A?style=for-the-badge">
</a>
</p>
