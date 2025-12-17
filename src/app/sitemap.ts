import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://fastkartcargo.in'

    const routes = [
        '',
        '/login',
        '/about',
        '/services',
        '/contact',
        '/privacy-policy',
        '/terms',
        '/refund-policy',
        // Service pages
        '/services/express-delivery',
        '/services/heavy-cargo',
        '/services/ecommerce-logistics',
        '/services/international-shipping',
        '/services/warehousing',
        '/services/b2b-distribution',
    ]

    return routes.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' : 'monthly',
        priority: route === '' ? 1 : 0.8,
    }))
}
