const axios = require('axios')

async function getBtcPrice() {
  const { data } = await axios.get(
    'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'
  )
  return parseFloat(data.bitcoin.usd)
}

async function postToTelegram(message) {
  await axios.post(
    `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      chat_id: process.env.TELEGRAM_CHANNEL_ID,
      text: message,
      parse_mode: 'HTML'
    }
  )
}

async function postBtcPrice() {
  try {
    const price = await getBtcPrice()

    const formatted = price.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    })

    const now = new Date().toUTCString()
    const message = `📊 <b>BTC/USDT</b>\n💰 ${formatted}\n🕐 ${now}`

    await postToTelegram(message)
    console.log(`[BTC Job] Posted price: ${formatted}`)

  } catch (err) {
    // Log the error but don't crash the server
    console.error('[BTC Job] Failed to post price:', err.message)
  }
}

module.exports = () => {
  console.log('[BTC Job] Starting hourly BTC price job...')

  // Align to the next top-of-hour boundary so restarts don't cause double-posts
  const now = new Date()
  const msUntilNextHour =
    (60 - now.getMinutes()) * 60 * 1000 -
    now.getSeconds() * 1000 -
    now.getMilliseconds()

  console.log(`[BTC Job] First post in ${Math.round(msUntilNextHour / 60000)} min`)

  setTimeout(() => {
    postBtcPrice()
    setInterval(postBtcPrice, 60 * 60 * 1000)
  }, msUntilNextHour)
}

// Also export the function itself for manual triggering
module.exports.postBtcPrice = postBtcPrice