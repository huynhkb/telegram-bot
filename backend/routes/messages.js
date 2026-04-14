const express = require('express')
const router = express.Router()
const axios = require('axios')
const rateLimit = require('express-rate-limit')
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Rate limiter: max 10 requests per minute per IP
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: 'Too many requests, slow down.' }
})

const requireAdmin = require('../middleware/requireAdmin')

// POST /messages/send
router.post('/send', limiter, requireAdmin, async (req, res) => {
  const { content } = req.body

  if (!content || content.trim() === '') {
    return res.status(400).json({ error: 'Message content is required' })
  }

  try {
    // 1. Save to Supabase first — if this fails, nothing is sent
    const { data, error } = await supabase
      .from('messages')
      .insert({
        content: content.trim(),
        sent_by: req.user.id
      })
      .select()
      .single()

    if (error) throw error

    // 2. Send to Telegram
    await axios.post(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: process.env.TELEGRAM_CHANNEL_ID,
        text: content
      }
    )

    res.json({ success: true, message: data })

  } catch (err) {
    console.error('Send error:', err.message)
    res.status(500).json({ error: 'Failed to send message' })
  }
})

// GET /messages
router.get('/', requireAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('sent_at', { ascending: false })
      .limit(50)

    if (error) throw error

    res.json({ messages: data })

  } catch (err) {
    console.error('Fetch error:', err.message)
    res.status(500).json({ error: 'Failed to fetch messages' })
  }
})

module.exports = router

const { postBtcPrice } = require('../services/btcPriceJob')

// POST /messages/btc-test  (admin only)
router.post('/btc-test', requireAdmin, async (req, res) => {
  try {
    await postBtcPrice()
    res.json({ success: true, message: 'BTC price posted to channel' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}