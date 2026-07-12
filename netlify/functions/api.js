// Netlify serverless function — wraps the Express app with serverless-http.
// Handles all /api/* routes that are rewritten here by netlify.toml.
import serverless from 'serverless-http'
import app from '../../server/app.js'
import { connectDB } from '../../server/db.js'

// Connect to MongoDB once; subsequent warm invocations reuse the connection.
// We await it inside the handler so cold starts don't time-out silently.
const serverlessHandler = serverless(app, {
  // Tell serverless-http to treat multipart bodies as binary so
  // multer's memoryStorage can read the raw buffer correctly.
  binary: ['multipart/form-data', 'image/*'],
})

export const handler = async (event, context) => {
  // Prevent Lambda/Netlify from waiting for the event loop to drain —
  // important so MongoDB callbacks don't keep the function alive.
  context.callbackWaitsForEmptyEventLoop = false

  await connectDB()
  return serverlessHandler(event, context)
}
