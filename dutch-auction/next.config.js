/** @type {import('next').NextConfig} */

const { parsed: localEnv } = require('dotenv').config();

const nextConfig = {
    env: {
        GANACHE_URL: localEnv.GANACHE_URL,
      }
}

module.exports = nextConfig
