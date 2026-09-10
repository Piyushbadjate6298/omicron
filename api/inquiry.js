export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      ok: false,
      message: 'Method not allowed',
    })
  }

  try {
    const {
      name,
      phone,
      email,
      service,
      vehicle,
      date,
      persons,
      message,
    } = req.body || {}

    if (!name || !phone) {
      return res.status(400).json({
        ok: false,
        message: 'Name and contact number are required.',
      })
    }

    // Brevo configuration
    const apiKey = process.env.BREVO_API_KEY
    const to = process.env.INQUIRY_TO_EMAIL
    const fromEmail = process.env.BREVO_FROM_EMAIL
    const fromName =
      process.env.BREVO_FROM_NAME || 'Omicron Journeys'

    if (!apiKey || !to || !fromEmail) {
      return res.status(500).json({
        ok: false,
        message:
          'Brevo email service is not configured. Check Vercel environment variables.',
      })
    }

    const subject = `New Omicron Journeys inquiry — ${
      vehicle || service || 'General'
    }`

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:700px;margin:auto;padding:24px;background:#f5f7fa;color:#10202f">

        <div style="background:#07141f;color:#fff;padding:24px;border-radius:18px 18px 0 0">
          <h1 style="margin:0;color:#f4c542">
            Omicron Journeys
          </h1>

          <p style="margin:8px 0 0;opacity:.8">
            New website inquiry
          </p>
        </div>

        <div style="background:#fff;padding:24px;border-radius:0 0 18px 18px">

          <p>
            <strong>Name:</strong>
            ${escapeHtml(name)}
          </p>

          <p>
            <strong>Phone:</strong>
            ${escapeHtml(phone)}
          </p>

          <p>
            <strong>Email:</strong>
            ${escapeHtml(email || 'Not provided')}
          </p>

          <p>
            <strong>Service:</strong>
            ${escapeHtml(service || 'Not specified')}
          </p>

          <p>
            <strong>Vehicle:</strong>
            ${escapeHtml(vehicle || 'Not specified')}
          </p>

          <p>
            <strong>Date:</strong>
            ${escapeHtml(date || 'Not specified')}
          </p>

          <p>
            <strong>Persons:</strong>
            ${escapeHtml(persons || 'Not specified')}
          </p>

          <p>
            <strong>Message:</strong>
            ${escapeHtml(message || '—')}
          </p>

        </div>
      </div>
    `

    const response = await fetch(
      'https://api.brevo.com/v3/smtp/email',
      {
        method: 'POST',

        headers: {
          accept: 'application/json',
          'api-key': apiKey,
          'content-type': 'application/json',
        },

        body: JSON.stringify({
          sender: {
            name: fromName,
            email: fromEmail,
          },

          to: [
            {
              email: to,
              name: 'Mohit',
            },
          ],

          ...(email
            ? {
                replyTo: {
                  email: email,
                },
              }
            : {}),

          subject,
          htmlContent: html,
        }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return res.status(response.status).json({
        ok: false,
        message:
          data?.message || 'Brevo email send failed.',
      })
    }

    return res.status(200).json({
      ok: true,
      messageId: data.messageId,
    })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message:
        error.message || 'Unexpected error.',
    })
  }
}

function escapeHtml(value) {
  return String(value).replace(
    /[&<>'"]/g,
    (char) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;',
      })[char]
  )
}