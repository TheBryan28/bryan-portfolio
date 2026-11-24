// Small inline flags for the language switch. Emoji flags don't render on
// Windows, so they are drawn as SVG.
export function Flag({ country, size = 18 }: { country: 'co' | 'us'; size?: number }) {
  const h = Math.round((size * 2) / 3);
  if (country === 'co') {
    return (
      <svg className="flag" width={size} height={h} viewBox="0 0 3 2" aria-hidden="true">
        <rect width="3" height="1" fill="#FCD116" />
        <rect y="1" width="3" height="0.5" fill="#003893" />
        <rect y="1.5" width="3" height="0.5" fill="#CE1126" />
      </svg>
    );
  }
  return (
    <svg className="flag" width={size} height={h} viewBox="0 0 19 13" aria-hidden="true">
      <rect width="19" height="13" fill="#B22234" />
      {[1, 3, 5, 7, 9, 11].map((y) => (
        <rect key={y} y={y} width="19" height="1" fill="#fff" />
      ))}
      <rect width="8" height="7" fill="#3C3B6E" />
      {[1.3, 3.5, 5.7].map((cy) =>
        [1.4, 4, 6.6].map((cx) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="0.45" fill="#fff" />),
      )}
    </svg>
  );
}
