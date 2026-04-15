import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import authMiddleware from '../middleware/authMiddleware.js'
import supabase from '../supabaseClient.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const uploadDir = path.join(__dirname, '../uploads')

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const timestamp = Date.now()
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')
    cb(null, `${timestamp}-${safeName}`)
  }
})

const upload = multer({ storage })
const router = express.Router()

router.post('/', authMiddleware, upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Nenhum arquivo enviado' })
  }

  try {
      const fileUrlBase = process.env.UPLOADS_BASE_URL || 'http://localhost:12345/uploads'
    const timestamp = new Date().toISOString()

    const { data, error } = await supabase.from('uploads').insert([{
      user_id: req.user.id,
      build_id: req.body.buildId || null,
      file_name: req.file.originalname,
      file_path: req.file.path,
      file_url: fileUrl,
      mime_type: req.file.mimetype,
      size_bytes: req.file.size,
      description: req.body.description || '',
      created_at: timestamp
    }]).single()

    if (error) {
      console.error('Erro ao salvar upload no Supabase:', error)
      return res.status(500).json({ error: error.message })
    }

    res.json({ upload: data })
  } catch (error) {
    console.error('Erro ao salvar upload:', error)
    res.status(500).json({ error: 'Erro ao salvar upload' })
  }
})

export default router
