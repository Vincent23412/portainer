# 1. 使用 Node.js 官方映像
FROM node:18

# 2. 設定工作目錄
WORKDIR /app

# 3. 複製依賴並安裝
COPY package.json yarn.lock ./
RUN yarn install

# 4. 複製原始碼
COPY . .

# 5. 編譯 TypeScript（這裡會用 yarn script，例如 yarn build -> tsc）
RUN yarn build

# 6. 暴露 port
EXPOSE 8000

# 7. 使用 node 啟動（正式環境不應該用 nodemon）
CMD ["node", "dist/index.js"]
