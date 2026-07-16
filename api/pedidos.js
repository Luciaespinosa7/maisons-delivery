const { createClient } = require('@supabase/supabase-js');

module.exports = async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        const SUPABASE_URL = 'https://maisons-delivery.supabase.co';
        const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

        if (!SUPABASE_KEY) {
            console.error('SUPABASE_SERVICE_KEY no configurada');
            return res.status(500).json({ error: 'SUPABASE_SERVICE_KEY no configurada' });
        }

        const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

        if (req.method === 'GET') {
            const { data, error } = await supabase
                .from('pedidos')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error SELECT:', error);
                return res.status(400).json({ error: error.message });
            }
            return res.status(200).json(data);
        }

        if (req.method === 'POST') {
            if (!req.body) {
                return res.status(400).json({ error: 'Body requerido' });
            }

            const { data, error } = await supabase
                .from('pedidos')
                .insert([req.body]);

            if (error) {
                console.error('Error INSERT:', error);
                return res.status(400).json({ error: error.message });
            }
            return res.status(201).json(data);
        }

        if (req.method === 'PUT') {
            if (!req.body) {
                return res.status(400).json({ error: 'Body requerido' });
            }

            const { id, ...updateData } = req.body;

            if (!id) {
                return res.status(400).json({ error: 'ID requerido' });
            }

            const { data, error } = await supabase
                .from('pedidos')
                .update(updateData)
                .eq('id', id);

            if (error) {
                console.error('Error UPDATE:', error);
                return res.status(400).json({ error: error.message });
            }
            return res.status(200).json(data);
        }

        return res.status(405).json({ error: 'Método no permitido' });
    } catch (error) {
        console.error('Error catch:', error);
        return res.status(500).json({ error: error.message || 'Error desconocido' });
    }
};
