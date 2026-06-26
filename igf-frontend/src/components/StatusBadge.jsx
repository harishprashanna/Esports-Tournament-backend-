const MAP = {
  UPCOMING:          'badge-upcoming',
  REGISTRATION_OPEN: 'badge-open',
  ONGOING:           'badge-ongoing',
  COMPLETED:         'badge-completed',
}

const LABELS = {
  UPCOMING:          'Upcoming',
  REGISTRATION_OPEN: 'Open',
  ONGOING:           'Ongoing',
  COMPLETED:         'Completed',
}

export default function StatusBadge({ status }) {
  return (
    <span className={MAP[status] ?? 'badge bg-gray-800 text-gray-300'}>
      {LABELS[status] ?? status}
    </span>
  )
}
