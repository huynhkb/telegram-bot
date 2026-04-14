module.exports = async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1]
  const { data: { user } } = await supabase.auth.getUser(token)
  if (!user) return res.status(401).json({ error: 'Unauthorized' })

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) return res.status(403).json({ error: 'Forbidden' })
  
  req.user = user
  next()
}