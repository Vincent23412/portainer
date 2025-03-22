# 🐳 Portainer-like Backend Service

This project is a lightweight backend written in **TypeScript** and **Node.js (ESM)** for managing Docker containers (similar to Portainer). It provides APIs to list, create, execute commands inside, and delete containers.

---

## 📦 Prerequisites

- Node.js v18 or higher
- Docker Engine
- Yarn (optional but recommended)

---

## 🚀 Development

To start the project in development mode (with auto-reload if using `nodemon`):

```bash
yarn dev
```

> Make sure your `dev` script uses tools like `ts-node`, `ts-node-esm`, or `nodemon`.

---

## 🧪 Testing (manual)

You can test endpoints using tools like:

- [Postman](https://www.postman.com/)
- [cURL](https://curl.se/)
- or directly through the provided HTML frontend (if applicable)

---

## 🔧 Build for Production

To compile TypeScript into JavaScript:

```bash
yarn build
```

This will generate a `dist/` folder with compiled `.js` files.

---

## 🚀 Start in Production

After building:

```bash
yarn start
```

This will execute the compiled file (e.g. `dist/index.js`) using Node.js.

---

## 🗂️ Scripts (from `package.json`)

```json
{
  "scripts": {
    "dev": "ts-node-esm src/index.ts",
    "build": "tsc && tsc-esm-fix dist",
    "start": "node dist/index.js"
  }
}
```

---

## 📁 Project Structure

```
├── src/
│   ├── index.ts
│   ├── routers/
│   └── controllers/
├── dist/                 # Compiled output after `yarn build`
├── package.json
├── tsconfig.json
```

---

## 🐳 Docker 部署（管理宿主機 Docker）

你可以將這個專案打包成一個 Docker container，但因為它需要**存取本機的 Docker Daemon**，所以你必須掛載 Docker 的 Unix socket 才能正常運作。

### 🛠️ 建立 image

```bash
docker build -t my-portainer .
```

### 🚀 執行 container（含 Docker 控制權限）

```bash
docker run -p 8000:8000 \
  -v /var/run/docker.sock:/var/run/docker.sock \
  my-portainer
```

### 🔐 安全注意事項

> 掛載 `/var/run/docker.sock` 等於給容器「完整的 Docker 控制權限（幾乎等同 root）」⚠️  
> 請務必注意以下事項：

- 建議只在內部環境或開發環境使用
- 不要對外公開這個介面，或請加上認證/防火牆
- 建議搭配 JWT/Auth 機制保護 API
- 不要讓不可信任的使用者存取這個容器

---

✅ 執行完成後，你可以透過瀏覽器訪問：

```
http://localhost:8000/
```

來操作你的容器管理 UI。

---



![image](https://github.com/user-attachments/assets/cd34a2c6-9765-4610-b8ab-368978be92f5)
![image](https://github.com/user-attachments/assets/8b3a7374-72b9-4585-88e6-8281ca769c6c)
