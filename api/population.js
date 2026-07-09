const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://hxjlxvfsbtoaz8haulk.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { data, error } = await supabase
      .from('populations')
      .select('*')
      .order('name');

    if (error) throw error;

    res.status(200).json(data);
  } catch (err) {
    console.error('Populations error:', err);
    res.status(500).json({ error: err.message });
  }
};
