export const getMessagesWithSentiments = async (apiBasePath, accessToken, conversationId) => {
    const sentimentUrl = `${apiBasePath}/v1/conversations/${conversationId}/messages?sentiment=true`;
    return await fetch(sentimentUrl, {
        method: 'GET',
        cache: 'no-cache',
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        headers: {'Content-Type': 'application/json', 'x-api-key': accessToken}
    })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                throw new Error("Failed to fetch the messages with sentiments")
            }
            return data.messages;
        });
}