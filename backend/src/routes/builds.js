import express from 'express'
import supabase from '../supabaseClient.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase.from('builds').select('*').eq('is_public', true).order('created_at', { ascending: false })
    if (error) {
      console.error('Erro ao listar builds públicas:', error)
      return res.status(500).json({ error: error.message })
    }

    res.json({ builds: data })
  } catch (error) {
    console.error('Erro ao listar builds públicas:', error)
    res.status(500).json({ error: 'Erro ao listar builds públicas' })
  }
})

router.get('/me/my-public', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase.from('builds').select('*').eq('user_id', req.user.id).eq('is_public', true).order('created_at', { ascending: false })
    if (error) {
      console.error('Erro ao buscar builds públicas do usuário:', error)
      return res.status(500).json({ error: error.message })
    }

    res.json({ builds: data })
  } catch (error) {
    console.error('Erro ao buscar builds públicas do usuário:', error)
    res.status(500).json({ error: 'Erro ao buscar builds públicas do usuário' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const { data: build, error } = await supabase.from('builds').select('*').eq('id', req.params.id).single()
    if (error || !build) return res.status(404).json({ error: 'Build não encontrada' })

    if (!build.is_public) {
      const authHeader = req.headers.authorization || ''
      const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null

      if (!token) {
        return res.status(403).json({ error: 'Build privada' })
      }

      const { data, error: authError } = await supabase.auth.getUser(token)
      if (authError || !data?.user || data.user.id !== build.user_id) {
        return res.status(403).json({ error: 'Build privada' })
      }
    }

    res.json({ build })
  } catch (error) {
    console.error('Erro ao buscar build:', error)
    res.status(500).json({ error: 'Erro ao buscar build' })
  }
})

export default router
