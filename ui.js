export default class UI {
    static async requestAuthorize(policy, origin) {
        return new Promise(resolve => {
            resolve(confirm(`An app from origin ${origin} is requesting access. Do you want to grant it?`));
        })
    }

    static async getAddresses(origin) {
        return new Promise(resolve =>
            resolve(confirm(`${origin} wants to access your addresses.`)));
    }
}