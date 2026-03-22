# Build and Run Instructions for Server Code

1. **Build the server code:**
   ```sh
   npm run build:server
   ```
   This compiles server.ts and src/services/chatbotService.ts to the build/ directory.

2. **Build the frontend (if needed):**
   ```sh
   npm run build
   ```
   This compiles the frontend assets to dist/.

3. **Run in production:**
   ```sh
   NODE_ENV=production node build/server.js
   ```
   (Or use your deployment platform's process.)

4. **Development mode:**
   Use your existing scripts (e.g., `npm run dev:all` or `npm run server:watch`).

---

- The server will dynamically import the correct chatbotService file depending on the environment.
- Make sure to deploy the build/ directory (with server.js and compiled services) to production.
