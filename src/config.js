function getConfig(host) {
    switch (host) {
        case 'https://secure.nimiq.com':
            return {
                safeOrigin: 'https://safe.nimiq.com',
                walletOrigin: 'https://wallet.nimiq.com',
                mode: 'live'
            };

        case 'https://secure.nimiq-testnet.com':
            return {
                safeOrigin: 'https://safe.nimiq-testnet.com',
                walletOrigin: 'https://wallet.nimiq-testnet.com',
                mode: 'test'
            };

        default:
            return {
                safeOrigin: location.origin,
                walletOrigin: location.origin,
                mode: 'test'
            }
    }
}

const host = window.location.hostname;

export default getConfig(host);