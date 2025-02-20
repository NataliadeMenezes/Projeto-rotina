self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('app-cache').then(cache => {
            return cache.addAll([
                '/',
                '/index.html',
                '/manifest.json',
                '/styles.css',  // Se houver
                '/script.js',   // Se houver
                'caminho-para-imagem-1.jpg',
                'caminho-para-imagem-2.jpg',
                // Adicione mais arquivos se necessário
            ]);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});
