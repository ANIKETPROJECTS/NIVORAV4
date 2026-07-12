// Local development entry-point.
// Imports the shared Express app and starts a real HTTP server.
// On Netlify the app is imported by netlify/functions/api.js instead.
import app from './app.js'
import { connectDB } from './db.js'

const PORT = process.env.API_PORT || 3001

connectDB()
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`[Server] API running on http://0.0.0.0:${PORT}`)
    })
  })
  .catch(err => {
    console.error('[Server] Failed to start:', err)
    process.exit(1)
  })
