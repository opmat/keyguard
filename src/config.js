function getConfig(host) {
    switch (host) {
        case 'https://secure.nimiq.com':
            return {
                safeOrigin: 'https://safe.nimiq.com',
                walletOrigin: 'https://wallet.nimiq.com',
                minerOrigin: 'https://miner.nimiq.com',
                mode: 'live'
            };

        case 'https://secure.nimiq-testnet.com':
            return {
                safeOrigin: 'https://safe.nimiq-testnet.com',
                walletOrigin: 'https://wallet.nimiq-testnet.com',
                minerOrigin: 'https://miner.nimiq-testnet.com',
                mode: 'test'
            };

        default:
            return {
                safeOrigin: location.origin,
                walletOrigin: location.origin,
                minerOrigin: location.origin,
                mode: 'dev'
            }
    }
}

const host = window.location.origin;

export default getConfig(host);
