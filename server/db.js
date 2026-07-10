import mongoose from 'mongoose'

let isConnected = false

export async function connectDB() {
  if (isConnected) return
  let uri = process.env.MONGODB_URI
  if (!uri) throw new Error('MONGODB_URI environment variable is not set')
  // Strip any accidental label prefix (e.g. "uri:mongodb+srv://...")
  if (uri.startsWith('uri:')) uri = uri.slice(4)
  await mongoose.connect(uri)
  isConnected = true
  console.log('[MongoDB] Connected')
}
