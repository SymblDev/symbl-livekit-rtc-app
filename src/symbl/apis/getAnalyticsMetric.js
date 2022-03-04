export const getAnalyticsMetric = async (apiBasePath, accessToken, conversationId) => {
    const analyticsUrl = `${apiBasePath}/v1/conversations/${conversationId}/analytics`;
    return await fetch(analyticsUrl, {
        method: 'GET',
        cache: 'no-cache',
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        headers: {'Content-Type': 'application/json', 'x-api-key': accessToken}
    })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                throw new Error("Failed to fetch the analytics")
            }
            return data;
        });
}