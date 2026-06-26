const GAME_LABELS = {
  PUBGM:          { label: 'PUBG Mobile',        cat: 'MOBILE' },
  CODM:           { label: 'Call of Duty Mobile', cat: 'MOBILE' },
  MORTAL_KOMBAT:  { label: 'Mortal Kombat',       cat: 'CONSOLE' },
  FIFA:           { label: 'FIFA',                cat: 'CONSOLE' },
  VALORANT:       { label: 'Valorant',            cat: 'PC' },
}

const CAT_CLASS = {
  MOBILE:  'badge-mobile',
  CONSOLE: 'badge-console',
  PC:      'badge-pc',
}

export default function GameBadge({ gameType, category }) {
  const info = GAME_LABELS[gameType] ?? { label: gameType, cat: category }
  const cat = info.cat ?? category
  return (
    <span className={CAT_CLASS[cat] ?? 'badge bg-gray-800 text-gray-300'}>
      {info.label}
    </span>
  )
}
