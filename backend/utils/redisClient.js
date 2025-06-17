const redis = require('redis');

// Create Redis client with retry strategy
const client = redis.createClient({
  url: process.env.REDIS_URL || 'redis://redis:6379',
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        console.error('Redis connection failed after 10 retries');
        return new Error('Redis connection failed');
      }
      return Math.min(retries * 100, 3000);
    }
  }
});

// Handle connection events
client.on('connect', () => {
  console.log('✅ Redis client connected');
});

client.on('error', (err) => {
  console.error('Redis client error:', err);
});

client.on('reconnecting', () => {
  console.log('Redis client reconnecting...');
});

// Connect to Redis
client.connect().catch(err => {
  console.error('Failed to connect to Redis:', err);
});

module.exports = client;