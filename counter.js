const fs = require('fs');
const path = require('path');

const COUNTER_FILE = path.join(__dirname, 'views.json');
const IP_CACHE_FILE = path.join(__dirname, 'ip_cache.json');
const COOLDOWN_MS = 5 * 60 * 1000;

function loadJSON(file, fallback) {
    try {
        return JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch {
        return fallback;
    }
}

function saveJSON(file, data) {
    fs.writeFileSync(file, JSON.stringify(data));
}

function getClientIP(req) {
    return req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.connection.remoteAddress;
}

function incrementView(req) {
    let views = loadJSON(COUNTER_FILE, { count: 0 });
    let ipCache = loadJSON(IP_CACHE_FILE, {});

    const ip = getClientIP(req);
    const now = Date.now();

    if (!ipCache[ip] || now - ipCache[ip] > COOLDOWN_MS) {
        views.count += 1;
        ipCache[ip] = now;
        saveJSON(COUNTER_FILE, views);
        saveJSON(IP_CACHE_FILE, ipCache);
    }

    return views.count;
}

function getViewCount() {
    let views = loadJSON(COUNTER_FILE, { count: 0 });
    return views.count;
}

module.exports = { incrementView, getViewCount };
