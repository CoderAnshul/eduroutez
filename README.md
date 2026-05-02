# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

Google Login Setup
------------------

Add your Google OAuth Client ID to a Vite env file (do not commit secrets to git).

1. Create a `.env.local` in the project root with the following line:

	VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

	(Replace `your-google-client-id.apps.googleusercontent.com` with your actual client id.)

2. The app already reads `import.meta.env.VITE_GOOGLE_CLIENT_ID` in `src/main.jsx`.

3. For server-side token verification/exchange, add your Google client secret to your server environment (never expose it in frontend files).

4. Restart the dev server after adding environment variables: `npm run dev` or `yarn dev`.

Server-side token verification
-----------------------------

If you run a Node/Express backend, add the following environment variables to your server (do not commit these to git):

- `GOOGLE_CLIENT_ID=...`
- `GOOGLE_CLIENT_SECRET=...` (keep secret on server only)

Example minimal Express route is provided at `server/googleAuth.js` which accepts `idToken` (preferred) or `accessToken` from the frontend, verifies it with Google, looks up/creates the user and returns your app's auth tokens. Install server dependencies with:

```bash
npm install express axios google-auth-library
```

Then mount the router in your server app:

```js
const express = require('express');
const app = express();
app.use(express.json());
const googleAuth = require('./server/googleAuth');
app.use('/auth', googleAuth);
```

Frontend: ensure your client sends `idToken` (preferred) or `accessToken` in the POST to `/auth/google-login` (the frontend currently posts to `/google-login`). Adjust the frontend URL accordingly.

