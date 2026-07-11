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
        MONGODB_URI: 'mongodb+srv://nivorainbox_db_user:z4ZvlqcltmGqVkPR@nivora.9kua3dk.mongodb.net/?appName=Nivora',

        CLOUDINARY_CLOUD_NAME: 'tgmyheme',
        CLOUDINARY_API_KEY: '811595815326532',
        CLOUDINARY_API_SECRET: 'frnuzUt0_D4-DNVr4dVEcPHl66k',

        ADMIN_USERNAME: 'admin',
        ADMIN_PASSWORD: 'admin123',
        SESSION_SECRET: 'fNmQZUl14iExPKKoo3SzhUJxPxLHfFAxZKB77YXsLOqIpJYj259rSXcBwkl5XUJOK21aB9q6Uml0950tfWUc/Q==',

        // Gmail address + app password used to send contact-form enquiries,
        // and the inbox that should receive them.
        EMAIL_USER: 'nivora.inbox@gmail.com',
        EMAIL_APP_SECRET: 'nuelfrebcpveiwkz',
        EMAIL_TO: 'nivora.inbox@gmail.com',
      },
    },
  ],
}
