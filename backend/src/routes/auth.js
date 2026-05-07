import express from 'express'
import { createClient } from '@supabase/supabase-js'
import supabase from '../supabaseClient.js'

const router = express.Router()

// Cria cliente Supabase usando o access token do usuário autenticado.
// Com esse cliente, as operações respeitam RLS como "dono do registro".
function makeUserClient(accessToken) {
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      global: { headers: { Authorization: `Bearer ${accessToken}` } },
      auth: { persistSession: false, autoRefreshToken: false }
    }
  )
}

async function getProfileByUserId(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data
}

// Busca o perfil ou cria um mínimo a partir dos metadados do auth.
async function ensureProfile(userId, authUser, accessToken) {
  // Tenta buscar com service role
  let profile = await getProfileByUserId(userId)
  if (profile) return profile

  const meta = authUser?.user_metadata || {}
  const timestamp = new Date().toISOString()
  const payload = {
    id: userId,
    username: meta.username || authUser?.email?.split('@')[0],
    email: authUser?.email,
    main_class: meta.mainClass || '',
    level: 1,
    join_date: timestamp.slice(0, 10),
    created_at: timestamp,
    updated_at: timestamp
  }

  // Usa o cliente do usuário (respeita RLS de "inserir próprio perfil")
  const userClient = makeUserClient(accessToken)
  const { data: created, error: createError } = await userClient
    .from('profiles')
    .insert(payload)
    .select()
    .single()

  if (!createError && created) return created

  // Último recurso: retorna objeto baseado nos metadados do auth
  console.warn('Não foi possível criar perfil na tabela, usando dados do auth:', createError?.message)
  return payload
}

router.post('/register', async (req, res) => {
  const { username, email, password, mainClass } = req.body

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'username, email e password são obrigatórios' })
  }

  try {
    // Verifica duplicidade
    const { data: existing, error: existingError } = await supabase
      .from('profiles')
      .select('id')
      .or(`username.eq.${username},email.eq.${email}`)
      .limit(1)

    if (existingError) {
      console.error('Erro ao verificar duplicidade:', existingError)
      // Ignora erro de RLS na verificação; prossegue
    } else if (existing?.length > 0) {
      return res.status(409).json({ error: 'Usuário ou email já cadastrado' })
    }

    // Cria usuário no Supabase Auth (admin)
    const { data: createData, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { username, mainClass },
      email_confirm: true
    })

    if (createError) {
      console.error('Erro ao criar usuário:', createError)
      if (createError.code === 'email_exists') {
        return res.status(409).json({ error: 'Email já cadastrado' })
      }
      return res.status(409).json({ error: createError.message })
    }

    const user = createData.user

    // Autentica imediatamente para obter o access token
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (loginError || !loginData.session) {
      console.error('Erro ao autenticar após registro:', loginError)
      return res.status(500).json({
        error: 'Conta criada! Faça login manualmente.'
      })
    }

    const accessToken = loginData.session.access_token
    const userClient = makeUserClient(accessToken)
    const timestamp = new Date().toISOString()

    // Tenta upsert usando o token do usuário (contorna RLS)
    const { error: upsertError } = await userClient
      .from('profiles')
      .upsert(
        {
          id: user.id,
          username,
          email,
          main_class: mainClass || '',
          level: 1,
          join_date: timestamp.slice(0, 10),
          created_at: timestamp,
          updated_at: timestamp
        },
        { onConflict: 'id' }
      )

    if (upsertError) {
      console.warn('Upsert de perfil falhou, tentando update:', upsertError.message)
      await userClient
        .from('profiles')
        .update({ username, email, main_class: mainClass || '', level: 1, updated_at: timestamp })
        .eq('id', user.id)
    }

    const profile = await ensureProfile(user.id, loginData.user, accessToken)
    res.json({ token: accessToken, user: profile })
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
      const { data: profileRow, error: profileError } = await supabase
        .from('profiles')
        .select('email')
        .eq('username', emailOrUsername)
        .single()

      if (profileError || !profileRow?.email) {
        return res.status(401).json({ error: 'Credenciais inválidas' })
      }
      email = profileRow.email
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
    const accessToken = authData.session.access_token
    const profile = await ensureProfile(userId, authData.user, accessToken)
    res.json({ token: accessToken, user: profile })
  } catch (error) {
    console.error('Erro no login:', error)
    res.status(500).json({ error: 'Erro ao autenticar usuário' })
  }
})

export default router
