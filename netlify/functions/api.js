// Netlify serverless function — wraps the Express app with serverless-http.
// Handles all /api/* routes that are rewritten here by netlify.toml.
import serverless from 'serverless-http'
import app from '../../server/app.js'
import { connectDB } from '../../server/db.js'

const serverlessHandler = serverless(app, {
  // Tell serverless-http to treat multipart bodies as binary so
  // multer's memoryStorage can read the raw buffer correctly.
  binary: ['multipart/form-data', 'image/*'],
})

export const handler = async (event, context) => {
  // Prevent Lambda from waiting for the event loop to drain so MongoDB
  // callbacks don't keep the function alive past the response.
  context.callbackWaitsForEmptyEventLoop = false

  try {
    await connectDB()
  } catch (err) {
    console.error('[Function] MongoDB connection failed:', err.message)
    return {
      statusCode: 503,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Database unavailable. Please try again later.' }),
    }
  }

  try {
    return await serverlessHandler(event, context)
  } catch (err) {
    console.error('[Function] Unhandled error:', err.message)
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal server error.' }),
    }
  }
}
