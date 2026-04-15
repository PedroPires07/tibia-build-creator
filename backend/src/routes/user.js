import express from 'express'
import supabase from '../supabaseClient.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()
router.use(authMiddleware)

async function getProfileByUserId(userId) {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()
  if (error) throw error
  return data
}

router.get('/profile', async (req, res) => {
  try {
    const user = await getProfileByUserId(req.user.id)
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' })
    res.json({ user })
  } catch (error) {
    console.error('Erro ao buscar perfil:', error)
    res.status(500).json({ error: 'Erro ao buscar perfil' })
  }
})

router.put('/profile', async (req, res) => {
  const { username, email, mainClass, level, avatar_url, bio } = req.body

  try {
    const { data: existing, error: existingError } = await supabase.from('profiles')
      .select('id')
      .or(`username.eq.${username},email.eq.${email}`)
      .neq('id', req.user.id)
      .limit(1)

    if (existingError) {
      console.error('Erro ao verificar duplicidade de perfil:', existingError)
      return res.status(500).json({ error: existingError.message })
    }

    if (existing?.length > 0) {
      return res.status(409).json({ error: 'Username ou email já existente' })
    }

    const { error: updateAuthError } = await supabase.auth.admin.updateUserById(req.user.id, {
      email
    })

    if (updateAuthError) {
      console.error('Erro ao atualizar email no Supabase Auth:', updateAuthError)
      return res.status(500).json({ error: updateAuthError.message })
    }

    const timestamp = new Date().toISOString()
    const { data: profile, error: profileError } = await supabase.from('profiles').update({
      username: username || '',
      email: email || '',
      main_class: mainClass || '',
      level: level || 1,
      avatar_url: avatar_url || '',
      bio: bio || '',
      updated_at: timestamp
    }).eq('id', req.user.id).single()

    if (profileError) {
      console.error('Erro ao atualizar perfil no Supabase:', profileError)
      return res.status(500).json({ error: profileError.message })
    }

    res.json({ user: profile })
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error)
    res.status(500).json({ error: 'Erro ao atualizar perfil' })
  }
})

router.get('/builds', async (req, res) => {
  try {
    const { data, error } = await supabase.from('builds').select('*').eq('user_id', req.user.id).order('created_at', { ascending: false })
    if (error) {
      console.error('Erro ao buscar builds no Supabase:', error)
      return res.status(500).json({ error: error.message })
    }

    res.json({ builds: data })
  } catch (error) {
    console.error('Erro ao buscar builds do usuário:', error)
    res.status(500).json({ error: 'Erro ao buscar builds do usuário' })
  }
})

router.post('/builds', async (req, res) => {
  const { name, class: buildClass, level, description, equipment, stats, is_public } = req.body

  if (!name || !buildClass || !level) {
    return res.status(400).json({ error: 'name, class e level são obrigatórios' })
  }

  try {
    const timestamp = new Date().toISOString()
    const { data, error } = await supabase.from('builds').insert([{ 
      user_id: req.user.id,
      name,
      class: buildClass,
      level,
      description: description || '',
      equipment: equipment || {},
      stats: stats || {},
      is_public: Boolean(is_public),
      created_at: timestamp,
      updated_at: timestamp
    }]).single()

    if (error) {
      console.error('Erro ao criar build no Supabase:', error)
      return res.status(500).json({ error: error.message })
    }

    res.json({ build: data })
  } catch (error) {
    console.error('Erro ao criar build:', error)
    res.status(500).json({ error: 'Erro ao criar build' })
  }
})

router.put('/builds/:id', async (req, res) => {
  const buildId = req.params.id
  const { name, class: buildClass, level, description, equipment, stats, is_public } = req.body

  try {
    const { data: existing, error: existingError } = await supabase.from('builds').select('*').eq('id', buildId).eq('user_id', req.user.id).single()
    if (existingError || !existing) {
      return res.status(404).json({ error: 'Build não encontrada' })
    }

    const timestamp = new Date().toISOString()
    const { data, error } = await supabase.from('builds').update({
      name: name || existing.name,
      class: buildClass || existing.class,
      level: level || existing.level,
      description: description || existing.description,
      equipment: equipment || existing.equipment,
      stats: stats || existing.stats,
      is_public: typeof is_public === 'boolean' ? is_public : existing.is_public,
      updated_at: timestamp
    }).eq('id', buildId).single()

    if (error) {
      console.error('Erro ao atualizar build no Supabase:', error)
      return res.status(500).json({ error: error.message })
    }

    res.json({ build: data })
  } catch (error) {
    console.error('Erro ao atualizar build:', error)
    res.status(500).json({ error: 'Erro ao atualizar build' })
  }
})

router.delete('/builds/:id', async (req, res) => {
  const buildId = req.params.id

  try {
    const { data: existing, error: existingError } = await supabase.from('builds').select('id').eq('id', buildId).eq('user_id', req.user.id).single()
    if (existingError || !existing) {
      return res.status(404).json({ error: 'Build não encontrada' })
    }

    const { error } = await supabase.from('builds').delete().eq('id', buildId)
    if (error) {
      console.error('Erro ao excluir build no Supabase:', error)
      return res.status(500).json({ error: error.message })
    }

    res.json({ message: 'Build removida com sucesso' })
  } catch (error) {
    console.error('Erro ao excluir build:', error)
    res.status(500).json({ error: 'Erro ao excluir build' })
  }
})

export default router
