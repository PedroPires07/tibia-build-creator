import supabase from '../supabaseClient.js'

export default async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' })
  }

  try {
    const { data, error } = await supabase.auth.getUser(token)
    if (error || !data?.user) {
      return res.status(401).json({ error: 'Token inválido ou expirado' })
    }

    req.user = { id: data.user.id }
    next()
  } catch (error) {
    console.error('Erro na validação de token Supabase:', error)
    return res.status(401).json({ error: 'Token inválido ou expirado' })
  }
}
