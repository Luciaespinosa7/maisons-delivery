const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://hxjlxvfsbtoaz8haulk.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          invoice_number,
          customer_name,
          status,
          shipping_cost,
          assembly_cost,
          created_at,
          population_id,
          populations(name, zone)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      res.status(200).json(data);
    } catch (err) {
      console.error('Orders GET error:', err);
      res.status(500).json({ error: err.message });
    }
  } else if (req.method === 'POST') {
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([req.body])
        .select();

      if (error) throw error;

      res.status(200).json(data[0]);
    } catch (err) {
      console.error('Orders POST error:', err);
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
