<div id="top"></div>

<!-- HEADER STYLE: CLASSIC -->
<div align="center">

<h1 align="center">💬 VEVOX — Real-Time Chat Web Application</h1>
<p align="center"><em>Transforming Conversations • Igniting Instant Collaboration</em></p>

<!-- BADGES -->
<a href="https://github.com/MA1002643/vevox-real-time-chat-web-application/LICENSE" alt="license">
   <img src="https://img.shields.io/github/license/MA1002643/vevox-real-time-chat-web-application?style=flat&logo=opensourceinitiative&logoColor=white&color=0080ff" alt="license" />
</a>
<img src="https://img.shields.io/github/last-commit/MA1002643/vevox-real-time-chat-web-application?style=flat&logo=git&logoColor=white&color=0080ff" alt="last-commit">
<a href="https://github.com/MA1002643/vevox-real-time-chat-web-application/discussions" alt="Discussions">
   <img src="https://img.shields.io/github/discussions/MA1002643/vevox-real-time-chat-web-application" alt="Discussions" />
</a>
<a href="https://github.com/MA1002643/vevox-real-time-chat-web-application/actions/workflows/daily-tests.yml">
   <img src="https://img.shields.io/github/actions/workflow/status/MA1002643/vevox-real-time-chat-web-application/daily-tests.yml?label=daily%20tests" alt="Daily Tests Status" />
</a>
<a href="https://coveralls.io/github/MA1002643/vevox-real-time-chat-web-application">
   <img src="https://img.shields.io/coveralls/github/MA1002643/vevox-real-time-chat-web-application" alt="Code Coverage" />
</a>
<br>
</div>

---

## 📄 Table of Contents

- [Overview](#-overview)
- [UI Preview](#-ui-preview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
  - [Project Index](#-project-index)
- [Getting Started](#-getting-started)
  - [Prerequisites](#-prerequisites)
  - [Installation](#-installation)
  - [Usage](#-usage)
  - [Testing](#-testing)
- [Learning Outcomes](#-learning-outcomes)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [Acknowledgments](#-acknowledgments)
- [License](#-license)

---

## ✨ Overview

**Vevox – Real-Time Chat Web Application** is a full-stack chat platform built on WebSockets for low-latency, bi-directional messaging. It provides real-time messaging, persistent MySQL-backed storage, and dynamic chatroom management for Q&A and group collaboration.

---

## 🎨 UI Preview

|                     Chatroom Interface                     |                  Real-Time Messaging                  |
| :--------------------------------------------------------: | :---------------------------------------------------: |
| ![Chatroom interface screenshot](screenshots/chatroom.png) | ![Live chat in action GIF](screenshots/live-chat.gif) |

---

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

## 🧰 Tech Stack

<details>

<summary><b>👨‍💻 Programming and Markup Languages</b></summary>
<br/>

</details>

<details>

<summary><b>🧰 Frameworks and Libraries</b></summary>
<br/>

</details>

<details>

<summary><b>🗄️ Databases and Cloud Hosting</b></summary>
<br/>

</details>

<details>

<summary><b>💻 Software and Tools</b></summary>
<br/>

</details>

---

## 📁 Project Structure

```sh
└── vevox-real-time-chat-web-application/
	├── README.md
	└── Vevox Chatroom/
		├── Migrations/
		│   ├── 1-AddRoomName.sql
		│   └── 2-AddQuestions.sql
		├── example chatroom html & styling/
		│   ├── newChatroom.html
		│   └── newStyle.css
		├── html/
		│   ├── Chatroom.html
		│   ├── Index.html
		│   ├── MessageEvents.js
		│   ├── clientSide.js
		│   └── style.css
		├── test/
		│   ├── database.sql
		│   └── serverSide.js
		├── ca.pem
		├── htmlServer.js
		├── index.js
		├── package.json
		├── package-lock.json
		└── webSocketServer.js
```

---

### 📑 Project Index

<details open>
   <summary><b>VEVOX-REAL-TIME-CHAT-WEB-APPLICATION/</b></summary>

   <details>
      <summary><b>__root__</b></summary>
      <ul>
         <li><b><a href="./README.md">README.md</a></b> — Project documentation, overview and setup instructions.</li>
      </ul>
   </details>

   <details>
      <summary><b>Vevox Chatroom</b></summary>
      <ul>
         <li><b><a href="Vevox Chatroom/webSocketServer.js">webSocketServer.js</a></b> — WebSocket server that manages connections, broadcasts and persistence hooks.</li>
         <li><b><a href="Vevox Chatroom/htmlServer.js">htmlServer.js</a></b> — Serves static frontend assets for the chat UI.</li>
         <li><b><a href="Vevox Chatroom/index.js">index.js</a></b> — Main server entrypoint that wires HTTP and WebSocket servers.</li>
         <li><b><a href="Vevox Chatroom/package.json">package.json</a></b> — Npm manifest (dependencies & scripts).</li>
         <li><b><a href="Vevox Chatroom/package-lock.json">package-lock.json</a></b> — Lockfile with exact dependency versions.</li>
         <li><b><a href="Vevox Chatroom/ca.pem">ca.pem</a></b> — Certificate used for local TLS testing.</li>
      </ul>

      <details>
         <summary><b>Migrations</b></summary>
         <ul>
            <li><b><a href="Vevox Chatroom/Migrations/1-AddRoomName.sql">1-AddRoomName.sql</a></b> — Adds room name column/table changes.</li>
            <li><b><a href="Vevox Chatroom/Migrations/2-AddQuestions.sql">2-AddQuestions.sql</a></b> — Adds question support schema.</li>
         </ul>
      </details>

      <details>
         <summary><b>example chatroom html & styling</b></summary>
         <ul>
            <li><b><a href="Vevox Chatroom/example chatroom html & styling/newChatroom.html">newChatroom.html</a></b> — Example chatroom page demonstrating layout and client-side integration.</li>
            <li><b><a href="Vevox Chatroom/example chatroom html & styling/newStyle.css">newStyle.css</a></b> — Example stylesheet for the sample chatroom.</li>
         </ul>
      </details>

      <details>
         <summary><b>html</b></summary>
         <ul>
            <li><b><a href="Vevox Chatroom/html/clientSide.js">clientSide.js</a></b> — Client-side JS handling WebSocket events and UI updates.</li>
            <li><b><a href="Vevox Chatroom/html/Chatroom.html">Chatroom.html</a></b> — Main chatroom UI page.</li>
            <li><b><a href="Vevox Chatroom/html/MessageEvents.js">MessageEvents.js</a></b> — Structured websocket message/event types.</li>
            <li><b><a href="Vevox Chatroom/html/Index.html">Index.html</a></b> — Login/landing page for users.</li>
            <li><b><a href="Vevox Chatroom/html/style.css">style.css</a></b> — Styles used by the HTML UI.</li>
         </ul>
      </details>

      <details>
         <summary><b>test</b></summary>
         <ul>
            <li><b><a href="Vevox Chatroom/test/database.sql">database.sql</a></b> — SQL for testing DB schemas and sample data.</li>
            <li><b><a href="Vevox Chatroom/test/serverSide.js">serverSide.js</a></b> — Test helpers and scripts for server-side WebSocket behavior.</li>
         </ul>
      </details>

   </details>

</details>

---

## 🚀 Getting Started

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

### ⚙️ Installation

Clone the repository, install dependencies and configure the database connection.

```bash
git clone https://github.com/MA1002643/vevox-real-time-chat-web-application.git
cd vevox-real-time-chat-web-application/Vevox\ Chatroom
npm install
# Configure your MySQL connection (see README Prerequisites) before starting the servers.
```

### 💻 Usage

Start the application using the npm script. This will run the server(s) defined in `package.json`.

```bash
npm start
```

If the project uses separate scripts for the HTML server and WebSocket server, run the specific scripts (e.g. `npm run start:html` / `npm run start:ws`).

### 🧪 Testing

Automated tests use Mocha. Run the test suite with:

```bash
npm test
```

For a focused run, you can run individual test files with Mocha directly, e.g.: `npx mocha test/serverSide.js`.

---

## 🎓 Learning Outcomes

- Implemented real-time WebSocket communication from scratch.
- Gained practical experience in server–client synchronization using `ws`.
- Strengthened understanding of asynchronous programming and event-driven architecture.
- Built and tested full-stack Node.js systems with MySQL integration.
- Applied modular software design principles for maintainability and scalability.

---

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

## 🤝 Contributing

- **💬 [Join the Discussions](https://github.com/MA1002643/vevox-real-time-chat-web-application/discussions)**: Share your insights, provide feedback, or ask questions.
- **🐛 [Report Issues](https://github.com/MA1002643/vevox-real-time-chat-web-application/issues)**: Submit bugs found or log feature requests for the `vevox-real-time-chat-web-application` project.
- **💡 [Submit Pull Requests](https://github.com/MA1002643/vevox-real-time-chat-web-application/pulls)**: Review open PRs, and submit your own PRs.

<details closed>
<summary>Contributing Guidelines</summary>

1. **Fork the Repository**: Start by forking the project repository to your github account.
2. **Clone Locally**: Clone the forked repository to your local machine using a git client.
   ```sh
   git clone https://github.com/MA1002643/vevox-real-time-chat-web-application
   ```
3. **Create a New Branch**: Always work on a new branch, giving it a descriptive name.
   ```sh
   git checkout -b new-feature-x
   ```
4. **Make Your Changes**: Develop and test your changes locally.
5. **Commit Your Changes**: Commit with a clear message describing your updates.
   ```sh
   git commit -m 'Implemented new feature x.'
   ```
6. **Push to github**: Push the changes to your forked repository.
   ```sh
   git push origin new-feature-x
   ```
7. **Submit a Pull Request**: Create a PR against the original project repository. Clearly describe the changes and their motivations.
8. **Review**: Once your PR is reviewed and approved, it will be merged into the main branch. Congratulations on your contribution!
</details>

<details closed>
<summary>Contributor Graph</summary>
<br>
<p align="left">
   <a href="https://github.com{/MA1002643/vevox-real-time-chat-web-application/}graphs/contributors">
      <img src="https://contrib.rocks/image?repo=MA1002643/vevox-real-time-chat-web-application">
   </a>
</p>
</details>

---

## ✨ Acknowledgments

- Inspired by collaborative tools such as **Vevox** and **Slack**.
- Special thanks to **contributors** and **Node.js open-source maintainers**.
- Created as part of an **academic exploration of real-time systems architecture**.

---

## 📜 License

This project is licensed under the **[MIT License](https://github.com/MA1002643/vevox-real-time-chat-web-application/blob/main/LICENSE)**. See the **[LICENSE](https://choosealicense.com/licenses/)** file for full details.

---

<p align="center">
  <strong>© 2025 Muhammad Abdullah</strong><br>
  Developed with 💙 using Node.js & Express<br>
  <a href="#top"><img alt="Back to Top" src="https://img.shields.io/badge/Back_to_Top-0A0A0A?style=for-the-badge">
</a>
</p>
