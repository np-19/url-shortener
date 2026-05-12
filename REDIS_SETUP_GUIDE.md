# 🚀 Redis Implementation Guide

## Overview

This document explains how to set up and use the Redis implementation for URL caching and rate limiting in the URL Shortener project.

## Installation & Setup

### Step 1: Install Redis

#### On Windows
**Option A: Using WSL2**
```bash
# Inside WSL terminal
sudo apt-get update
sudo apt-get install redis-server
```

**Option B: Using Chocolatey**
```powershell
choco install redis-64
```

**Option C: Docker**
```bash
docker run -d -p 6379:6379 redis:latest
```

#### On macOS
```bash
brew install redis
```

#### On Linux (Ubuntu/Debian)
```bash
sudo apt-get update
sudo apt-get install redis-server
redis-server  # Start Redis
```

### Step 2: Configure Environment Variables

Create a `.env` file in the `backend/` directory with:

```env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=  # Leave empty if Redis doesn't have a password
```

### Step 3: Start Redis

**Local Redis:**
```bash
redis-server  # macOS/Linux
redis-cli    # Windows (if installed via Chocolatey)
```

**Docker:**
```bash
docker run -d -p 6379:6379 --name my-redis redis:latest
```

Verify Redis is running:
```bash
redis-cli ping
# Should respond: PONG
```

### Step 4: Start the Backend Server

```bash
cd backend
npm install  # If not already done
npm run dev
```

You should see in consolcd e:
```
Redis connected successfully
Server is running on http://localhost:3000
```

---

## Features Implemented

### 1. URL Caching (Cache-Aside Pattern)

When a user accesses a short URL:

1. **Cache Hit (~1ms)**: URL found in Redis → Instant redirect
2. **Cache Miss (~50ms)**: 
   - Query MongoDB
   - Store in Redis with 24-hour TTL
   - Redirect to original URL

**Memory efficient**: Old/unpopular URLs automatically evicted by Redis

### 2. Rate Limiting (Fixed Window)

- **Limit**: 100 requests per minute per IP address
- **Response Headers**:
  - `X-RateLimit-Limit`: Maximum allowed requests
  - `X-RateLimit-Remaining`: Requests remaining in window
  - `X-RateLimit-Reset`: When limit resets
  - `Retry-After`: Seconds to wait before retry (on 429)

**Example**:
```bash
# 101st request in the same minute from same IP
HTTP/1.1 429 Too Many Requests
Retry-After: 45
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
```

---

## Testing

### Test 1: Verify Caching

```bash
# Terminal 1: Monitor Redis
redis-cli MONITOR

# Terminal 2: Make requests to same short URL
curl http://localhost:3000/abc123

# Terminal 3: Check cache directly
redis-cli GET url:abc123
# Should return the original URL
```

### Test 2: Verify Rate Limiting

```bash
# Make 101 rapid requests
for i in {1..101}; do
  curl -i http://localhost:3000/api/urls
done

# Request 101 should get 429 Too Many Requests
# Check headers on any request
curl -i http://localhost:3000/api/urls
```

### Test 3: Monitor Redis Metrics

```bash
# In redis-cli
INFO stats
INFO memory

# Get all cache keys
KEYS url:*

# Get all rate limit keys
KEYS rate:*

# Check TTL of a key
TTL url:abc123
```

---

## Troubleshooting

### Redis Connection Error
```
Error: Redis connection error: ECONNREFUSED
```
**Solution**: Make sure Redis server is running (`redis-server`)

### Rate Limiter Not Working
- Ensure Redis is connected (check server logs)
- If Redis unavailable, rate limiting gracefully fails (won't block requests)
- Check rate limit keys exist: `redis-cli KEYS rate:*`

### Cache Not Working
- Verify Redis has the key: `redis-cli GET url:{shortId}`
- Check TTL: `redis-cli TTL url:{shortId}` (should be ~86400 for 24h)
- If not caching, check controller logs for cache errors

### High Memory Usage
- Redis uses LRU eviction (configurable)
- Check memory: `redis-cli INFO memory`
- Adjust cache TTL in `src/services/cache_service.ts` if needed

---

## Production Considerations

### Security
- Use Redis password: `REDIS_PASSWORD=your-secure-password`
- Use Redis in a private network (don't expose to internet)
- Consider Redis ACL in Redis 6+

### Performance
- Use Redis cluster for horizontal scaling
- Consider using Redis Sentinel for high availability
- Monitor `ops/sec` and memory usage

### Rate Limiting Improvements
- Current: Fixed Window (simple, susceptible to boundary issues)
- Future: Implement Token Bucket or Sliding Window for production
- Consider per-endpoint rate limits vs global

### Caching Strategy
- Current: 24-hour TTL for all URLs
- Future: Implement adaptive TTL based on access patterns
- Consider cache warming for popular URLs

---

## File Structure

```
backend/src/
├── config/
│   └── redis.ts              # Redis connection & client management
├── services/
│   └── cache_service.ts      # Cache operations (cache-aside pattern)
├── middlewares/
│   └── rateLimiter.ts        # Fixed window rate limiter
└── controllers/
    └── url_controller.ts     # Updated with caching logic
```

---

## API Changes

No breaking changes to existing API endpoints.

**New Response Headers** (on all requests):
- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`
- `X-RateLimit-Reset`
- `Retry-After` (only if rate limited)

---

## Next Steps (Phase 3)

- Implement Bloom Filters for URL existence checks
- Add Trie data structure for efficient URL prefix searches
- Implement Priority Heap for finding most-used URLs
- Add Redis Lua scripts for atomic operations
- Implement Sliding Window rate limiting with Lua scripts

