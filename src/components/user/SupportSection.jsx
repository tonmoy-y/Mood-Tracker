import Card from '../common/Card'
import EmptyState from '../common/EmptyState'

const SupportSection = ({ messages }) => {
  return (
    <Card title="Support" subtitle="Grounding thoughts for hard moments.">
      {messages.length === 0 ? (
        <EmptyState
          title="No support messages yet"
          message="Your care team can add gentle reminders here anytime."
        />
      ) : (
        <div className="space-y-3">
          {messages.map((message) => (
            <blockquote
              key={message.id}
              className="rounded-2xl border border-cyan-100 bg-gradient-to-br from-cyan-50/80 to-sky-50/70 p-4 text-sm leading-relaxed text-slate-700"
            >
              “{message.text}”
            </blockquote>
          ))}
        </div>
      )}
    </Card>
  )
}

export default SupportSection
