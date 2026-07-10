/** @type {import('pm2').StartOptions} */
module.exports = {
  apps: [
    {
      name: 'nivora-api',
      script: 'server/index.js',
      interpreter: 'node',
      watch: false,
      env: {
        NODE_ENV: 'production',
        API_PORT: 3001,

        // ── Fill these in with your real values before deploying on your VPS ──
        // This lets pm2 supply all config, so you don't need a .env file there.
        // (These are placeholders — Replit's own Secrets values are never
        // exposed to this file automatically, so you must copy them in by hand.)
        MONGODB_URI: '',

        CLOUDINARY_CLOUD_NAME: '',
        CLOUDINARY_API_KEY: '',
        CLOUDINARY_API_SECRET: '',

        ADMIN_USERNAME: '',
        ADMIN_PASSWORD: '',
        SESSION_SECRET: '',

        // Gmail address + app password used to send contact-form enquiries,
        // and the inbox that should receive them.
        EMAIL_USER: '',
        EMAIL_APP_SECRET: '',
        EMAIL_TO: '',
      },
    },
  ],
}
