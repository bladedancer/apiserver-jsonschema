import got from 'got';

const CENTRAL_URL = 'https://apicentral.axway.com/apis';
const OAS_URL = `${CENTRAL_URL}/docs`;

async function getOAS() {
    return await got.get(OAS_URL).json();
}

export {
    CENTRAL_URL,
    getOAS
}