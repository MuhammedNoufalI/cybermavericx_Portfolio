
export async function sendTelegramNotification(message: string): Promise<void> {
    const botToken = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_CHAT_ID

    if (!botToken || !chatId) {
        console.warn('[Telegram] Missing env vars TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID')
        return
    }

    try {
        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'Markdown'
            })
        })

        if (!response.ok) {
            const errorText = await response.text()
            console.error('[Telegram] API Error:', response.status, errorText)
        }
    } catch (error) {
        console.error('[Telegram] Network Error:', error)
    }
}
