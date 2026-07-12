import mongoose from 'mongoose'

// Cache the connection promise so that warm serverless invocations
// reuse the same MongoDB connection instead of opening a new one.
let connectionPromise = null

export function connectDB() {
  if (connectionPromise) return connectionPromise

  let uri = process.env.MONGODB_URI
  if (!uri) throw new Error('MONGODB_URI environment variable is not set')
  // Strip any accidental label prefix (e.g. "uri:mongodb+srv://...")
  if (uri.startsWith('uri:')) uri = uri.slice(4)

  connectionPromise = mongoose
    .connect(uri, { serverSelectionTimeoutMS: 10000 })
    .then(() => { console.log('[MongoDB] Connected') })
    .catch(err => {
      // Reset so the next invocation can retry
      connectionPromise = null
      throw err
    })

  return connectionPromise
}
