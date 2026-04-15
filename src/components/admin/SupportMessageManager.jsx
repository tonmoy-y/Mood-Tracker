import { useState } from 'react'
import Button from '../common/Button'
import Card from '../common/Card'
import EmptyState from '../common/EmptyState'

const SupportMessageManager = ({ messages, onCreate, onUpdate, saving }) => {
  const [newText, setNewText] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editingText, setEditingText] = useState('')

  const submitNew = async (event) => {
    event.preventDefault()
    if (!newText.trim()) return
    await onCreate(newText.trim())
    setNewText('')
  }

  const startEdit = (message) => {
    setEditingId(message.id)
    setEditingText(message.text)
  }

  const submitEdit = async (event) => {
    event.preventDefault()
    if (!editingText.trim() || !editingId) return
    await onUpdate(editingId, editingText.trim())
    setEditingId(null)
    setEditingText('')
  }

  return (
    <Card title="Support content" subtitle="Create and curate supportive messages." className="surface-card-admin">
      <form onSubmit={submitNew} className="mb-4 space-y-2">
        <label className="block text-sm font-medium text-slate-700">
          New message
          <textarea
            rows={3}
            value={newText}
            onChange={(event) => setNewText(event.target.value)}
            placeholder="Add a calm and emotionally safe message..."
            className="soft-input mt-1 w-full"
          />
        </label>
        <Button type="submit" disabled={saving || !newText.trim()}>
          {saving ? 'Saving...' : 'Add message'}
        </Button>
      </form>

      <div className="space-y-3">
        {messages.length === 0 ? (
          <EmptyState
            title="No support messages"
            message="Create your first support text to help users during difficult moments."
          />
        ) : (
          messages.map((message) => (
            <article key={message.id} className="rounded-xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-3">
              {editingId === message.id ? (
                <form onSubmit={submitEdit} className="space-y-2">
                  <textarea
                    rows={3}
                    value={editingText}
                    onChange={(event) => setEditingText(event.target.value)}
                    className="soft-input w-full"
                  />
                  <div className="flex gap-2">
                    <Button type="submit" disabled={saving || !editingText.trim()}>
                      Save
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setEditingId(null)
                        setEditingText('')
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <>
                  <p className="text-sm text-slate-700">{message.text}</p>
                  <Button type="button" variant="ghost" className="mt-2" onClick={() => startEdit(message)}>
                    Edit
                  </Button>
                </>
              )}
            </article>
          ))
        )}
      </div>
    </Card>
  )
}

export default SupportMessageManager
