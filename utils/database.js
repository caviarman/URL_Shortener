const { Pool } = require('pg');

let db
if (!!process.env.DATABASE_URL) {
    db = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: true
    });
} else {
    db = new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'shorturl',
        password: 'Zydfhm2013',
        port: 5432,
    })
}
module.exports = {
    isCustomExists: async (custom) => {
        try {
            let res = false;
            const client = await db.connect();
            const result = await client.query('SELECT id FROM urls WHERE custom = $1', [custom]);
            client.release();
            if (!!result && result.rows.length > 0) {
                res = true;
            }
            return res;
        } catch (err) {
            console.error(err);
        }
    },

    saveCustom: async (base, custom) => {
        try {
            const client = await db.connect();
            const result = await client.query('INSERT INTO urls (base, custom, shorten, createdAt, updatedAt) VALUES ($1, $2, $2, NOW(), NOW()) RETURNING id', [base, custom]);
            client.release();
            return result;
        } catch (err) {
            console.error(err);
        }

    },

    saveShorten: async (base, shorten) => {
        try {
            const client = await db.connect();
            const result = await client.query('INSERT INTO urls (base, shorten, createdAt, updatedAt) VALUES ($1, $2, NOW(), NOW()) RETURNING id', [base, shorten]);
            client.release();
            return result;
        } catch {
            console.error(err);
        }

    },

    getBaseByShorten: async (shorten) => {
        try {
            const client = await db.connect();
            const result = await client.query('SELECT base FROM urls WHERE shorten = $1', [shorten]);
            client.release();
            if (!!result && result.rows.length > 0) {
                return result.rows[0].base;
            } else {
                return '';
            }
            
        } catch (err) {
            console.error(err);
        }

    },
}



