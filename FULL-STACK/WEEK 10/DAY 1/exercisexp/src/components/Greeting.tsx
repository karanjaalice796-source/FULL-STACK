interface GreetingProps {
  name: string
  messageCount: number
}

export default function Greeting({ name, messageCount }: GreetingProps) {
  return (
    <div className="greeting-preview">
      <span className="avatar avatar-lilac" aria-hidden="true">A</span>
      <div>
        <p className="greeting-title">Hey, {name} <span aria-hidden="true">✦</span></p>
        <p className="greeting-subtitle">
          You have <strong>{messageCount} new messages</strong> waiting.
        </p>
      </div>
      <span className="message-badge" aria-label={`${messageCount} new messages`}>{messageCount}</span>
    </div>
  )
}
