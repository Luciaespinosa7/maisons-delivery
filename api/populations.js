import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://hxjlxvfsbtoaz8haulk.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { data, error } = await supabase
      .from('populations')
      .select('*')
      .order('name')

    if (error) throw error

    res.status(200).json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
