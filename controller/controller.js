const db = require('../utils/database');
const request = require('request');
const cryptoRandomString = require('crypto-random-string');

module.exports = {
    useShortenCtrl: async (req, res) => {
        const base = await db.getBaseByShorten(req.params['shorten']);
        if (base.length > 0) {
            res.redirect(301, base);
        }
    },
    checkURLCtrl: async (req, res) => {
        const { base } = req.body;
        request.head(base, (error, response) => {
            if (!!response && response.statusCode === 200) {
                res.send({ data: true });
            } else {
                res.send({ data: false });
            }
        });
    },
    makeShortenCtrl: async (req, res) => {
        const { baseURL, customURL } = req.body;
        if (!!customURL) {
            custom = encodeURI(customURL);
            if (await db.isCustomExists(custom)) {
                res.send({
                    status: false,
                    shortenURL: '',
                    error: 'Custom url is already exists. Choose another one',
                });
            } else {
                await db.saveCustom(baseURL, custom);
                res.send({
                    status: true,
                    shortenURL: custom,
                    error: null,
                });
            }
        } else {
            shortStr = cryptoRandomString({ length: 10, type: 'url-safe' });
            await db.saveShorten(baseURL, shortStr);
            res.send({
                status: true,
                shortenURL: shortStr,
                error: null,
            });
        }
    },
}