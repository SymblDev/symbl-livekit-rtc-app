export const generateAccessToken = async (appId, appSecret, generateTokenEndpoint) => {
    return await fetch(generateTokenEndpoint, {
        method: 'POST',
        cache: 'no-cache',
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({type: "application", appId: appId, appSecret: appSecret})
    })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                throw new Error(`Error in fetching oauth2 token:  ${data.message}`);
            }
            return data.accessToken;
        });
}