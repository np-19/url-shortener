// List of reserved API endpoints and protected paths that cannot be used as custom aliases
export const RESERVED_ENDPOINTS = [
  // API routes
  'api',
  'auth',
  'login',
  'register',
  'logout',
  'profile',
  'users',

  // App routes
  'dashboard',
  'home',
  'about',
  'contact',
  'settings',
  'admin',

  // Common web paths
  'static',
  'public',
  'assets',
  'images',
  'css',
  'js',
  'fonts',

  // Special paths
  'favicon.ico',
  'robots.txt',
  'sitemap.xml',
  '.well-known',

  // HTTP methods (unlikely but reserved)
  'get',
  'post',
  'put',
  'delete',
  'patch',
];

export const isReservedEndpoint = (alias: string): boolean => {
  const lowerAlias = alias.toLowerCase();
  return RESERVED_ENDPOINTS.some(
    endpoint => lowerAlias === endpoint || lowerAlias.startsWith(endpoint + '-')
  );
};
