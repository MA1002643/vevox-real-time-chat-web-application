<div id="top"></div>

<!-- HEADER STYLE: CLASSIC -->
<div align="center">

<h1 align="center">💬 VEVOX — Real-Time Chat Web Application</h1>
<p align="center"><em>Transforming Conversations • Igniting Instant Collaboration</em></p>

<!-- BADGES -->
<img src="https://img.shields.io/github/license/MA1002643/vevox-real-time-chat-web-application?style=flat&logo=opensourceinitiative&logoColor=white&color=0080ff" alt="license">
<img src="https://img.shields.io/github/last-commit/MA1002643/vevox-real-time-chat-web-application?style=flat&logo=git&logoColor=white&color=0080ff" alt="last-commit">
<img src="https://img.shields.io/github/languages/top/MA1002643/vevox-real-time-chat-web-application?style=flat&color=0080ff" alt="repo-top-language">
<img src="https://img.shields.io/github/languages/count/MA1002643/vevox-real-time-chat-web-application?style=flat&color=0080ff" alt="repo-language-count">

<em>Built with the tools and technologies:</em>

<img src="https://img.shields.io/badge/Express-000000.svg?style=flat&logo=Express&logoColor=white" alt="Express">
<img src="https://img.shields.io/badge/JSON-000000.svg?style=flat&logo=JSON&logoColor=white" alt="JSON">
<img src="https://img.shields.io/badge/npm-CB3837.svg?style=flat&logo=npm&logoColor=white" alt="npm">
<img src="https://img.shields.io/badge/Mocha-8D6748.svg?style=flat&logo=Mocha&logoColor=white" alt="Mocha">
<img src="https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=flat&logo=JavaScript&logoColor=black" alt="JavaScript">

</div>
<br>

---

## 📄 Table of Contents

- [Overview](#-overview)
- [Getting Started](#-getting-started)
  - [Prerequisites](#-prerequisites)
  - [Installation](#-installation)
  - [Usage](#-usage)
  - [Testing](#-testing)
- [Features](#-features)
- [Project Structure](#-project-structure)
  - [Project Index](#-project-index)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Acknowledgment](#-acknowledgment)

---

## ✨ Overview

**Vevox – Real-Time Chat Web Application** is a full-stack chat platform enabling instant communication through **WebSocket technology**.  
It offers **real-time messaging**, **persistent data storage**, and **dynamic chatroom management**.  
Built with a modular architecture, Vevox demonstrates **scalable, event-driven communication** — perfect for classrooms, team collaborations, or Q&A sessions.

---

## 🎨 UI Preview

|                     Chatroom Interface                     |                  Real-Time Messaging                  |
| :--------------------------------------------------------: | :---------------------------------------------------: |
| ![Chatroom interface screenshot](screenshots/chatroom.png) | ![Live chat in action GIF](screenshots/live-chat.gif) |

---

## 🚀 Key Features

| Feature                             | Description                                                                                         |
| :---------------------------------- | :-------------------------------------------------------------------------------------------------- |
| 💬 **Real-Time Messaging**          | Enables instant bi-directional communication between clients and the server using WebSocket (`ws`). |
| 🧑‍🤝‍🧑 **Room Management**              | Allows users to create, join, and manage chat rooms dynamically for group conversations.            |
| 🗄️ **Persistent Storage**           | Uses **MySQL** to store chat history, user data, and Q&A interactions for long-term access.         |
| 🧩 **Modular Design**               | Separates concerns into client, server, and database modules for scalability and maintainability.   |
| 🧪 **Automated Testing**            | Implements unit testing with **Mocha** to ensure reliable server and database functionality.        |
| ⚡ **Low Latency**                  | Optimized socket communication ensures real-time responsiveness with minimal delay.                 |
| 🔒 **Secure Configuration**         | Environment variables managed via **env-cmd** to protect sensitive configuration data.              |
| 🎨 **User-Friendly Interface**      | Intuitive HTML/CSS frontend with interactive message display and input areas.                       |
| 🧰 **Developer Tools Integration**  | Uses **npm** scripts and configuration files for streamlined development and testing.               |
| 🌐 **Cross-Platform Compatibility** | Runs seamlessly in any modern browser and Node.js environment.                                      |

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
    └── Vevox Chatroom
        ├── Migrations
        ├── example chatroom html & styling
        ├── html
        ├── htmlServer.js
        ├── index.js
        ├── package-lock.json
        ├── package.json
        ├── test
        └── webSocketServer.js
```

---

### 📑 Project Index

<details open>
	<summary><b><code>VEVOX-REAL-TIME-CHAT-WEB-APPLICATION/</code></b></summary>
	<!-- __root__ Submodule -->
	<details>
		<summary><b>__root__</b></summary>
		<blockquote>
			<div class='directory-path' style='padding: 8px 0; color: #666;'>
				<code><b>⦿ __root__</b></code>
			<table style='width: 100%; border-collapse: collapse;'>
			<thead>
				<tr style='background-color: #f8f9fa;'>
					<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
					<th style='text-align: left; padding: 8px;'>Summary</th>
				</tr>
			</thead>
			</table>
		</blockquote>
	</details>
	<!-- Vevox Chatroom Submodule -->
	<details>
		<summary><b>Vevox Chatroom</b></summary>
		<blockquote>
			<div class='directory-path' style='padding: 8px 0; color: #666;'>
				<code><b>⦿ Vevox Chatroom</b></code>
			<table style='width: 100%; border-collapse: collapse;'>
			<thead>
				<tr style='background-color: #f8f9fa;'>
					<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
					<th style='text-align: left; padding: 8px;'>Summary</th>
				</tr>
			</thead>
				<tr style='border-bottom: 1px solid #eee;'>
					<td style='padding: 8px;'><b><a href='https://github.com/MA1002643/vevox-real-time-chat-web-application/blob/master/Vevox Chatroom/webSocketServer.js'>webSocketServer.js</a></b></td>
					<td style='padding: 8px;'>- Establishes and manages a WebSocket server facilitating real-time chat communication within the application<br>- Handles client connections, message broadcasting, and interaction with the database for message storage, retrieval, and question management<br>- Integrates seamlessly with the overall architecture to enable live messaging, question handling, and room management, ensuring synchronized communication across clients in the chat environment.</td>
				</tr>
				<tr style='border-bottom: 1px solid #eee;'>
					<td style='padding: 8px;'><b><a href='https://github.com/MA1002643/vevox-real-time-chat-web-application/blob/master/Vevox Chatroom/htmlServer.js'>htmlServer.js</a></b></td>
					<td style='padding: 8px;'>- Serves as the static content server for the project, delivering HTML and related assets to clients<br>- It facilitates the frontend interface by hosting web resources on a designated port, enabling seamless access to the user interface within the overall architecture<br>- This component ensures that the client-side experience is reliably served alongside backend functionalities.</td>
				</tr>
				<tr style='border-bottom: 1px solid #eee;'>
					<td style='padding: 8px;'><b><a href='https://github.com/MA1002643/vevox-real-time-chat-web-application/blob/master/Vevox Chatroom/package.json'>package.json</a></b></td>
					<td style='padding: 8px;'>- Defines the backend server setup and core runtime environment for the chat application, orchestrating essential services such as WebSocket communication, database interactions, and environment configurations<br>- It serves as the central entry point that enables real-time chat functionality and data management, integrating various dependencies to support the overall architecture of the chatroom system.</td>
				</tr>
				<tr style='border-bottom: 1px solid #eee;'>
					<td style='padding: 8px;'><b><a href='https://github.com/MA1002643/vevox-real-time-chat-web-application/blob/master/Vevox Chatroom/index.js'>index.js</a></b></td>
					<td style='padding: 8px;'>- Establishes the core server infrastructure for the Vevox Chatroom application, enabling client connections and managing user login requests<br>- Integrates HTML and WebSocket servers to facilitate real-time communication and user interactions within chat rooms<br>- Serves as the central entry point for handling HTTP requests and orchestrating the overall chatroom architecture.</td>
				</tr>
			</table>
			<!-- test Submodule -->
			<details>
				<summary><b>test</b></summary>
				<blockquote>
					<div class='directory-path' style='padding: 8px 0; color: #666;'>
						<code><b>⦿ Vevox Chatroom.test</b></code>
					<table style='width: 100%; border-collapse: collapse;'>
					<thead>
						<tr style='background-color: #f8f9fa;'>
							<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
							<th style='text-align: left; padding: 8px;'>Summary</th>
						</tr>
					</thead>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='https://github.com/MA1002643/vevox-real-time-chat-web-application/blob/master/Vevox Chatroom/test/database.sql'>database.sql</a></b></td>
							<td style='padding: 8px;'>- Defines the database schema for managing chat rooms, messages, and questions within the application<br>- Facilitates storage and retrieval of room details, user messages, and question-answer interactions, supporting real-time chat functionality and structured Q&A sessions in the platforms architecture<br>- Ensures data integrity and relationships among chat components for seamless user experience.</td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='https://github.com/MA1002643/vevox-real-time-chat-web-application/blob/master/Vevox Chatroom/test/serverSide.js'>serverSide.js</a></b></td>
							<td style='padding: 8px;'>- Facilitates comprehensive server-side WebSocket testing for chatroom functionalities, including message handling, database storage, room retrieval, question management, and event responses<br>- Ensures robust communication protocols and data integrity within the overall architecture, validating real-time interactions and persistent data updates essential for the chat applications reliability and user experience.</td>
						</tr>
					</table>
				</blockquote>
			</details>
			<!-- example chatroom html & styling Submodule -->
			<details>
				<summary><b>example chatroom html & styling</b></summary>
				<blockquote>
					<div class='directory-path' style='padding: 8px 0; color: #666;'>
						<code><b>⦿ Vevox Chatroom.example chatroom html & styling</b></code>
					<table style='width: 100%; border-collapse: collapse;'>
					<thead>
						<tr style='background-color: #f8f9fa;'>
							<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
							<th style='text-align: left; padding: 8px;'>Summary</th>
						</tr>
					</thead>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='https://github.com/MA1002643/vevox-real-time-chat-web-application/blob/master/Vevox Chatroom/example chatroom html & styling/newChatroom.html'>newChatroom.html</a></b></td>
							<td style='padding: 8px;'>- Defines the user interface for a chatroom within the Vevox platform, enabling real-time messaging during lectures<br>- It structures the layout, including message display and input areas, and integrates styling and client-side scripting to facilitate seamless communication<br>- This HTML file serves as the core frontend component for user interaction in the chatroom architecture.</td>
						</tr>
					</table>
				</blockquote>
			</details>
			<!-- html Submodule -->
			<details>
				<summary><b>html</b></summary>
				<blockquote>
					<div class='directory-path' style='padding: 8px 0; color: #666;'>
						<code><b>⦿ Vevox Chatroom.html</b></code>
					<table style='width: 100%; border-collapse: collapse;'>
					<thead>
						<tr style='background-color: #f8f9fa;'>
							<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
							<th style='text-align: left; padding: 8px;'>Summary</th>
						</tr>
					</thead>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='https://github.com/MA1002643/vevox-real-time-chat-web-application/blob/master/Vevox Chatroom/html/clientSide.js'>clientSide.js</a></b></td>
							<td style='padding: 8px;'>- Facilitates real-time chat interactions within the platform by managing WebSocket communication, handling message exchange, and dynamically updating the user interface<br>- Supports features like room selection, message sending, question-answer workflows, and reply threading, ensuring seamless and interactive communication across chat rooms<br>- Integrates client-side event handling to maintain synchronized chat states and user engagement.</td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='https://github.com/MA1002643/vevox-real-time-chat-web-application/blob/master/Vevox Chatroom/html/Chatroom.html'>Chatroom.html</a></b></td>
							<td style='padding: 8px;'>- Provides the main user interface for the chat application, enabling users to select chat rooms, send messages, and toggle themes<br>- It orchestrates layout, navigation, and interaction elements, serving as the central entry point for user engagement within the overall chat system architecture.</td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='https://github.com/MA1002643/vevox-real-time-chat-web-application/blob/master/Vevox Chatroom/html/MessageEvents.js'>MessageEvents.js</a></b></td>
							<td style='padding: 8px;'>- Defines a comprehensive set of websocket event classes for managing real-time chat interactions, including messaging, question handling, acknowledgements, and room management<br>- Facilitates structured communication between clients and server, enabling seamless message exchange, question marking, and room data synchronisation within the chat application architecture.</td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='https://github.com/MA1002643/vevox-real-time-chat-web-application/blob/master/Vevox Chatroom/html/Index.html'>Index.html</a></b></td>
							<td style='padding: 8px;'>- Facilitates user authentication and access to the chatroom interface within the web application<br>- It provides a login form for users to enter their credentials and transitions them to the main chat environment upon validation<br>- Serves as the entry point, orchestrating user flow and theme toggling, thereby integrating user identity with real-time communication features of the overall chat system.</td>
						</tr>
					</table>
				</blockquote>
			</details>
		</blockquote>
	</details>
</details>

---

## 🚀 Getting Started

### 📋 Prerequisites

This project requires the following dependencies:

- **Programming Language:** JavaScript
- **Package Manager:** Npm

### ⚙️ Installation

Build vevox-real-time-chat-web-application from the source and install dependencies:

1. **Clone the repository:**

   ```sh
   ❯ git clone https://github.com/MA1002643/vevox-real-time-chat-web-application
   ```

2. **Navigate to the project directory:**

   ```sh
   ❯ cd vevox-real-time-chat-web-application
   ```

3. **Install the dependencies:**

   **Using [npm](https://www.npmjs.com/):**

   ```sh
   ❯ npm install
   ```

### 💻 Usage

Run the project with:

**Using [npm](https://www.npmjs.com/):**

```sh
npm start
```

### 🧪 Testing

Vevox-real-time-chat-web-application uses the {**test_framework**} test framework. Run the test suite with:

**Using [npm](https://www.npmjs.com/):**

```sh
npm test
```

---

## 🎓 Learning Outcomes

- Implemented real-time WebSocket communication from scratch.
- Gained practical experience in server–client synchronization using `ws`.
- Strengthened understanding of asynchronous programming and event-driven architecture.
- Built and tested full-stack Node.js systems with MySQL integration.
- Applied modular software design principles for maintainability and scalability.

---

## 📈 Roadmap

- [ ] **`Task 1`**: Implement WebSocket message broadcasting
- [ ] **`Task 2`**: Integrate MySQL persistence
- [ ] **`Task 3`**: Add Mocha testing suite
- [ ] **`Task 4`**: Implement authentication layer
- [ ] **`Task 5`**: Develop admin moderation features
- [ ] **`Task 6`**: Add Mocha testing suite.
- [ ] **`Task 7`**: Deploy cloud-hosted version (Render + MySQL Atlas)

---

## 🤝 Contributing

- **💬 [Join the Discussions](https://github.com/MA1002643/vevox-real-time-chat-web-application/discussions)**: Share your insights, provide feedback, or ask questions.
- **🐛 [Report Issues](https://github.com/MA1002643/vevox-real-time-chat-web-application/issues)**: Submit bugs found or log feature requests for the `vevox-real-time-chat-web-application` project.
- **💡 [Submit Pull Requests](https://github.com/MA1002643/vevox-real-time-chat-web-application/blob/main/CONTRIBUTING.md)**: Review open PRs, and submit your own PRs.

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

This project is licensed under the **[MIT License](https://github.com/MA1002643/vevox-real-time-chat-web-application/blob/main/LICENSE)**. See the [LICENSE](https://choosealicense.com/licenses/) file for full details.

---

<p align="center">
  <strong>© 2025 Muhammad Abdullah</strong><br>
  Developed with 💙 using Node.js & Express<br>
  <a href="#top"><img alt="Back to Top" src="https://img.shields.io/badge/Back_to_Top-0A0A0A?style=for-the-badge">
</a>
</p>
