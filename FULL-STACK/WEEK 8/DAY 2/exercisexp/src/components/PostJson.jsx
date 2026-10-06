import { useState } from 'react'

const payload = {
  key1: 'myusername',
  email: 'mymail@gmail.com',
  name: 'Isaac',
  lastname: 'Doe',
  age: 27,
}

export default function PostJson() {
  const [webhookUrl, setWebhookUrl] = useState('')
  const [requestState, setRequestState] = useState('idle')
  const [response, setResponse] = useState(null)

  async function handleSubmit(event) {
    event.preventDefault()
    setRequestState('sending')
    setResponse(null)

    try {
      const result = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const responseBody = await result.text()
      const resultDetails = {
        status: result.status,
        statusText: result.statusText,
        body: responseBody || '(empty response body)',
      }

      console.log('Webhook response:', resultDetails)
      setResponse(resultDetails)
      setRequestState(result.ok ? 'success' : 'error')
    } catch (error) {
      console.error('Webhook request failed:', error)
      setResponse({ error: error.message })
      setRequestState('error')
    }
  }

  return (
    <section className="request-lab" aria-label="Send a JSON webhook request">
      <div className="request-form-panel">
        <div className="section-toolbar">
          <span className="section-label">REQUEST COMPOSER</span>
          <span className="method-pill">POST</span>
        </div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="webhook-url">YOUR WEBHOOK.SITE URL</label>
          <div className="url-input-row">
            <span className="url-prefix" aria-hidden="true">↗</span>
            <input
              id="webhook-url"
              type="url"
              placeholder="https://webhook.site/your-unique-id"
              value={webhookUrl}
              onChange={(event) => setWebhookUrl(event.target.value)}
              required
              aria-describedby="webhook-help"
            />
          </div>
          <p className="input-help" id="webhook-help">Create a unique URL at webhook.site and enable CORS before sending.</p>
          <div className="payload-heading"><span>REQUEST BODY</span><span>APPLICATION / JSON</span></div>
          <pre className="payload-code"><code>{JSON.stringify(payload, null, 2)}</code></pre>
          <button className="send-button" type="submit" disabled={requestState === 'sending'}>
            {requestState === 'sending' ? 'Sending request…' : 'Send JSON payload'}
            <span aria-hidden="true">{requestState === 'sending' ? '↻' : '↗'}</span>
          </button>
        </form>
      </div>
      <aside className={`response-panel response-${requestState}`}>
        <div className="section-toolbar">
          <span className="section-label">RESPONSE</span>
          <span className="response-status"><i />{requestState === 'success' ? `HTTP ${response?.status}` : requestState === 'sending' ? 'SENDING' : requestState === 'error' ? 'REQUEST FAILED' : 'AWAITING REQUEST'}</span>
        </div>
        <div className="response-content" aria-live="polite">
          {requestState === 'idle' && (
            <div className="response-empty"><span className="empty-icon" aria-hidden="true">↙</span><p>Your response will appear here after the request completes.</p></div>
          )}
          {requestState === 'sending' && <p className="response-message">Opening a connection to your webhook<span className="loading-dots">…</span></p>}
          {requestState === 'success' && (
            <div className="response-result">
              <p className="response-message">Request received. Check webhook.site to inspect the captured payload.</p>
              <pre>{response?.body}</pre>
            </div>
          )}
          {requestState === 'error' && (
            <div className="response-result response-error">
              <p className="response-message">{response?.error || `The server returned HTTP ${response?.status} ${response?.statusText}.`}</p>
              {response?.body && <pre>{response.body}</pre>}
              {response?.error && <p className="cors-tip">Check the URL and confirm CORS is enabled in webhook.site.</p>}
            </div>
          )}
        </div>
        <p className="console-hint"><span>↳</span> The response is also logged in your browser console.</p>
      </aside>
    </section>
  )
}
