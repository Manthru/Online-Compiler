# 🖥️ Online Compiler

An online compiler platform that supports multiple programming languages, eliminating the need to install and configure them locally. Designed for a seamless user experience with real-time code execution across supported languages.

## 🚀 Features

- 💡 Compile and run code in multiple programming languages
- ⚡ Fast, responsive, and user-friendly interface
- 🌐 No need to install languages locally
- 🐳 Containerized execution using Docker for language isolation and security
- 🧠 Syntax highlighting and structured layout
- 🔄 Asynchronous backend processing


## 🛠️ Tech Stack

### Frontend:
- **React.js** – Responsive and dynamic UI

### Backend:
- **Node.js**
- **Express.js** – REST API handling

### Execution Environment:
- **Docker** – Isolated container for safe and scalable code execution

## ⚙️ How It Works

1. User selects a language and writes code in the editor.
2. On submission, the code is sent to the backend.
3. The backend uses Docker to spin up a container for the selected language.
4. Code is compiled/executed in the container.
5. The output is captured and sent back to the frontend.

## 🧪 Supported Languages

- C++
- Python
- Java
- JavaScript

## 🧑‍💻 Setup Instructions

1. **Clone the repo**
   ```bash
   git clone https://github.com/<your-username>/online-compiler.git
   cd online-compiler
2. **Start the frontend
    ```bash
    cd client
    npm install
    npm start
3. **Start the backend
   ```bash
    cd ../server
    npm install
    npm start
4. **Docker Setup

  - Make sure Docker is installed and running.
  
  - Build Docker images for each language container (refer to your Dockerfile setup).

# 🙌 Acknowledgements
Inspired by online platforms like leetcode



