interface TeamAvatarProps {
  teamNumber: number
  className?: string
}

export default function TeamAvatar({ teamNumber, className = "" }: TeamAvatarProps) {
  const getAvatarData = (num: number) => {
    const avatars = [
      { name: "Steve", color: "#8B4513", accent: "#228B22" },
      { name: "Alex", color: "#FF8C00", accent: "#32CD32" },
      { name: "Creeper", color: "#228B22", accent: "#006400" },
      { name: "Warrior", color: "#FFD700", accent: "#DC143C" },
      { name: "Miner", color: "#4169E1", accent: "#FF4500" },
      { name: "Builder", color: "#32CD32", accent: "#8B4513" },
    ]
    return avatars[num % avatars.length]
  }

  const avatar = getAvatarData(teamNumber)

  return (
    <div className={`relative ${className}`}>
      <svg width="80" height="80" viewBox="0 0 80 80" className="pixelated drop-shadow-lg">
        {/* Head */}
        <rect x="20" y="10" width="40" height="40" fill="#DEB887" />
        <rect x="16" y="14" width="48" height="32" fill="#DEB887" />

        {/* Hair */}
        <rect x="16" y="10" width="48" height="8" fill={avatar.color} />
        <rect x="12" y="14" width="8" height="24" fill={avatar.color} />
        <rect x="60" y="14" width="8" height="24" fill={avatar.color} />

        {/* Eyes */}
        <rect x="28" y="22" width="6" height="6" fill="#000" />
        <rect x="46" y="22" width="6" height="6" fill="#000" />
        <rect x="30" y="24" width="2" height="2" fill="#FFF" />
        <rect x="48" y="24" width="2" height="2" fill="#FFF" />

        {/* Nose */}
        <rect x="38" y="30" width="4" height="4" fill="#CD853F" />

        {/* Mouth */}
        <rect x="34" y="38" width="12" height="2" fill="#8B4513" />

        {/* Body */}
        <rect x="24" y="50" width="32" height="30" fill={avatar.accent} />
        <rect x="20" y="54" width="40" height="22" fill={avatar.accent} />

        {/* Arms */}
        <rect x="8" y="54" width="12" height="20" fill="#DEB887" />
        <rect x="60" y="54" width="12" height="20" fill="#DEB887" />
        <rect x="8" y="50" width="12" height="8" fill={avatar.accent} />
        <rect x="60" y="50" width="12" height="8" fill={avatar.accent} />
      </svg>

    </div>
  )
}
