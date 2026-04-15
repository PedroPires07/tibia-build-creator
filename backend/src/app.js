import 'dotenv/config'

import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import authRoutes from './routes/auth.js'
import userRoutes from './routes/user.js'
import buildRoutes from './routes/builds.js'
import uploadRoutes from './routes/uploads.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const PORT = process.env.PORT || 12345

const app = express()

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }))
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/builds', buildRoutes)
app.use('/api/uploads', uploadRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'Backend Tibia Build Creator funcionando' })
})

app.listen(PORT, () => {
  console.log(`Backend iniciado em http://localhost:${PORT}`)
})
