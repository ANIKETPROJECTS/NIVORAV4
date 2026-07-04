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
        API_PORT: 4011,

        // ── MongoDB ────────────────────────────────────────────────────────────
        MONGODB_URI: 'mongodb+srv://raneaniket23_db_user:drOLXHVlBVdJJNHR@nivora.7g9zssp.mongodb.net/?appName=NIVORA',

        // ── Cloudinary ─────────────────────────────────────────────────────────
        CLOUDINARY_CLOUD_NAME: 'bbqq50ma',
        CLOUDINARY_API_KEY: '992368924598959',
        CLOUDINARY_API_SECRET: 'UKBCQudFbom-od2X5SbDyrIsaPw',

        // ── Admin panel ────────────────────────────────────────────────────────
        ADMIN_USERNAME: 'admin',
        ADMIN_PASSWORD: 'admin@123',
      },
    },
  ],
}
