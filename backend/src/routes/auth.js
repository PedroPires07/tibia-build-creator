import express from 'express'
import supabase from '../supabaseClient.js'

const router = express.Router()

async function getProfileByUserId(userId) {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()
  if (error) throw error
  return data
}

router.post('/register', async (req, res) => {
  const { username, email, password, mainClass } = req.body

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'username, email e password são obrigatórios' })
  }

  try {
    const { data: existing, error: existingError } = await supabase.from('profiles').select('id').or(`username.eq.${username},email.eq.${email}`).limit(1)
    if (existingError) {
      console.error('Erro ao verificar usuário existente no Supabase:', existingError)
      return res.status(500).json({ error: existingError.message })
    }

    if (existing?.length > 0) {
      return res.status(409).json({ error: 'Usuário ou email já cadastrado' })
    }

    const { data: createData, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { username, mainClass },
      email_confirm: true
    })

    if (createError) {
      console.error('Erro ao criar usuário no Supabase Auth:', createError)
      return res.status(409).json({ error: createError.message })
    }

    const user = createData.user
    const timestamp = new Date().toISOString()
    const profilePayload = {
      id: user.id,
      username,
      email,
      main_class: mainClass || '',
      level: 1,
      join_date: timestamp.slice(0, 10),
      created_at: timestamp,
      updated_at: timestamp
    }

    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .upsert(profilePayload, { onConflict: 'id' })
      .select()

    // Se houver erro, tenta buscar o perfil que pode ter sido criado por trigger
    let profile
    if (profileError) {
      console.warn('Aviso ao upsert perfil:', profileError.message)
      profile = await getProfileByUserId(user.id)
    } else {
      profile = profileData?.[0]
    }

    if (!profile) {
      console.error('Perfil não encontrado após registro')
      return res.status(500).json({ error: 'Perfil não pôde ser criado' })
    }

    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (loginError || !loginData.session) {
      console.error('Erro ao autenticar após registro:', loginError)
      return res.status(500).json({ error: loginError?.message || 'Não foi possível autenticar o usuário' })
    }

    res.json({ token: loginData.session.access_token, user: profile })
  } catch (error) {
    console.error('Erro no registro:', error)
    res.status(500).json({ error: 'Erro ao registrar usuário' })
  }
})

router.post('/login', async (req, res) => {
  const { emailOrUsername, password } = req.body

  if (!emailOrUsername || !password) {
    return res.status(400).json({ error: 'emailOrUsername e password são obrigatórios' })
  }

  try {
    let email = emailOrUsername

    if (!emailOrUsername.includes('@')) {
      const { data: profile, error: profileError } = await supabase.from('profiles').select('email').eq('username', emailOrUsername).single()
      if (profileError || !profile?.email) {
        return res.status(401).json({ error: 'Credenciais inválidas' })
      }
      email = profile.email
    }

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (authError || !authData.session) {
      console.error('Erro no login Supabase:', authError)
      return res.status(401).json({ error: 'Credenciais inválidas' })
    }

    const userId = authData.user?.id
    const profile = await getProfileByUserId(userId)
    res.json({ token: authData.session.access_token, user: profile })
  } catch (error) {
    console.error('Erro no login:', error)
    res.status(500).json({ error: 'Erro ao autenticar usuário' })
  }
})

export default router
