# Performance Best Practices

**Critical: Always follow project standards (standards.md) before generating any code.**

This document contains **universal performance optimization standards** for modern web development.
All rules are framework-agnostic and should be adapted to your project's `standards.md` configuration.

---

## ⚡ Frontend Performance

1. **JavaScript Optimization**:
    - Use dynamic imports for code splitting
    - Implement lazy loading for non-critical components
    - Minimize bundle size with tree shaking
    - Use Web Workers for CPU-intensive tasks

2. **CSS Performance**:
    - Use utility-first CSS with purging for minimal CSS
    - Avoid unused CSS rules
    - Use CSS custom properties for theming
    - Implement critical CSS inlining

3. **Image Optimization**:
    - Use modern image formats (WebP, AVIF)
    - Implement responsive images with `srcset`
    - Lazy load images below the fold
    - Compress images before upload

---

## 🚀 Loading Performance

4. **Resource Loading**:
    - Use `preload` for critical resources
    - Implement `prefetch` for likely future navigation
    - Use `preconnect` for external domains
    - Minimize render-blocking resources

5. **Caching Strategy**:
    - Implement proper browser caching headers
    - Use service workers for offline functionality
    - Cache API responses appropriately
    - Implement cache invalidation strategies

6. **Bundle Optimization**:
    - Use modern bundlers (esbuild, Vite, Turbopack)
    - Implement code splitting by route
    - Use dynamic imports for heavy libraries
    - Minimize vendor bundle size

---

## 🗄️ Database & API Performance

7. **Query Optimization**:
    - Use backend caching where possible
    - Optimize database queries with proper indexing
    - Use pagination for large result sets
    - Implement query result caching

8. **Database Best Practices**:
    - Avoid N+1 query problems
    - Use efficient JOIN operations
    - Implement proper database indexing
    - Monitor slow query logs

---

## 🌐 Network Performance

9. **API Optimization**:
    - Implement proper HTTP caching headers
    - Use compression (gzip/brotli) for responses
    - Minimize API response sizes
    - Implement request batching where appropriate

10. **CDN Usage**:
    - Use CDN for static assets
    - Implement proper cache headers
    - Use edge caching for dynamic content
    - Optimize asset delivery paths

---

## 📱 Mobile Performance

11. **Mobile Optimization**:
    - Design mobile-first
    - Ensure touch targets are 44px minimum
    - Implement proper viewport configuration
    - Use mobile-specific optimizations

12. **Touch Performance**:
    - Optimize touch event handling
    - Use passive event listeners where possible
    - Minimize scroll jank
    - Optimize for 60fps animations

---

## 🔧 Build Performance

13. **Build Optimization**:
    - Use incremental builds where possible
    - Implement proper build caching
    - Use parallel processing for builds
    - Optimize build pipeline efficiency

14. **Asset Optimization**:
    - Minify JavaScript and CSS
    - Optimize images during build process
    - Use asset versioning for cache busting
    - Implement asset compression

---

## 📊 Performance Monitoring

15. **Performance Metrics**:
    - Monitor Core Web Vitals (LCP, FID, CLS)
    - Track First Contentful Paint (FCP)
    - Monitor Time to Interactive (TTI)
    - Use performance budgets

16. **Real User Monitoring**:
    - Implement performance monitoring tools
    - Track user experience metrics
    - Monitor performance regressions
    - Use performance analytics

---

## 🎯 Optimization Techniques

17. **Code Optimization**:
    - Use efficient algorithms and data structures
    - Implement proper memoization
    - Use debouncing and throttling for events
    - Optimize DOM manipulation

18. **Memory Management**:
    - Avoid memory leaks in JavaScript
    - Implement proper cleanup for event listeners
    - Use weak references where appropriate
    - Monitor memory usage

---

## 🔄 Caching Strategies

19. **Browser Caching**:
    - Use appropriate cache headers
    - Implement cache-first strategies
    - Use stale-while-revalidate patterns
    - Implement proper cache invalidation

20. **Application Caching**:
    - Cache expensive computations
    - Use in-memory caching for frequently accessed data
    - Implement distributed caching where needed
    - Use cache warming strategies

---

## 📈 Performance Testing

21. **Testing Practices**:
    - Implement automated performance tests
    - Use performance testing tools (Lighthouse, WebPageTest)
    - Test on various devices and networks
    - Monitor performance regressions

22. **Load Testing**:
    - Test application under load
    - Identify performance bottlenecks
    - Test database performance under load
    - Implement proper scaling strategies

---

## 🛠️ Performance Tools

23. **Development Tools**:
    - Use browser dev tools for profiling
    - Implement performance monitoring
    - Use build tools for optimization
    - Monitor performance metrics

24. **Production Monitoring**:
    - Use APM tools for monitoring
    - Implement performance alerts
    - Monitor server performance
    - Track user experience metrics

---

## 🎯 Performance Targets

**Core Web Vitals Goals**:

- First Contentful Paint < 1.5s
- Largest Contentful Paint < 2.5s
- First Input Delay < 100ms
- Cumulative Layout Shift < 0.1
- Time to Interactive < 3.5s

---

## Quick Reference Checklist

- [ ] Bundle size optimized (tree shaking, code splitting)
- [ ] Images compressed and optimized
- [ ] CSS purged and minified
- [ ] JavaScript minified
- [ ] Caching headers configured
- [ ] Performance budgets defined
- [ ] Core Web Vitals optimized
- [ ] Mobile performance tested
- [ ] Performance monitoring enabled
- [ ] Lazy loading implemented
