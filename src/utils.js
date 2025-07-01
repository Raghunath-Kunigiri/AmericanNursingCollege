export function createPageUrl(pageName) {
  // For now, just return a hash-based URL
  // In a real app with routing, this would create proper routes
  return `#${pageName.toLowerCase()}`;
} 