interface LineDiagramProps {
  height: number;
  separation: number;
}

export function LineDiagram({ height, separation }: LineDiagramProps) {
  const scale = Math.min(1, 180 / (2 * separation + 40));
  const scaledSep = separation * scale * 4;
  const centerX = 140;
  const groundY = 180;
  const conductorY = 60;

  return (
    <div className="bg-card border rounded-xl p-4">
      <h3 className="text-sm font-semibold text-foreground mb-3">Line Configuration</h3>
      <svg viewBox="0 0 280 200" className="w-full h-48">
        {/* Ground line */}
        <line
          x1="20"
          y1={groundY}
          x2="260"
          y2={groundY}
          stroke="hsl(var(--border))"
          strokeWidth="2"
        />
        <text x="265" y={groundY + 5} className="text-xs fill-muted-foreground">Ground</text>

        {/* Ground hatching */}
        {Array.from({ length: 12 }).map((_, i) => (
          <line
            key={i}
            x1={30 + i * 20}
            y1={groundY}
            x2={20 + i * 20}
            y2={groundY + 10}
            stroke="hsl(var(--muted-foreground))"
            strokeWidth="1"
          />
        ))}

        {/* Conductors */}
        {[-1, 0, 1].map((pos, i) => {
          const x = centerX + pos * scaledSep;
          return (
            <g key={i}>
              {/* Conductor */}
              <circle
                cx={x}
                cy={conductorY}
                r="12"
                fill="hsl(var(--primary))"
                stroke="hsl(var(--primary-foreground))"
                strokeWidth="2"
              />
              <text
                x={x}
                y={conductorY + 4}
                textAnchor="middle"
                className="text-xs font-bold fill-primary-foreground"
              >
                {i + 1}
              </text>

              {/* Image conductor (dashed) */}
              <circle
                cx={x}
                cy={groundY + (groundY - conductorY)}
                r="10"
                fill="none"
                stroke="hsl(var(--muted-foreground))"
                strokeWidth="1"
                strokeDasharray="4 2"
              />
              <text
                x={x}
                y={groundY + (groundY - conductorY) + 4}
                textAnchor="middle"
                className="text-xs fill-muted-foreground"
              >
                {i + 1}'
              </text>

              {/* Height line for center conductor */}
              {i === 1 && (
                <>
                  <line
                    x1={x + 25}
                    y1={conductorY}
                    x2={x + 25}
                    y2={groundY}
                    stroke="hsl(var(--engineering-orange))"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                  <text
                    x={x + 35}
                    y={(conductorY + groundY) / 2}
                    className="text-xs fill-engineering-orange font-mono"
                  >
                    H={height}m
                  </text>
                </>
              )}
            </g>
          );
        })}

        {/* Phase separation dimension */}
        <line
          x1={centerX - scaledSep}
          y1={conductorY - 25}
          x2={centerX}
          y2={conductorY - 25}
          stroke="hsl(var(--engineering-green))"
          strokeWidth="1"
        />
        <line
          x1={centerX - scaledSep}
          y1={conductorY - 30}
          x2={centerX - scaledSep}
          y2={conductorY - 20}
          stroke="hsl(var(--engineering-green))"
          strokeWidth="1"
        />
        <line
          x1={centerX}
          y1={conductorY - 30}
          x2={centerX}
          y2={conductorY - 20}
          stroke="hsl(var(--engineering-green))"
          strokeWidth="1"
        />
        <text
          x={centerX - scaledSep / 2}
          y={conductorY - 32}
          textAnchor="middle"
          className="text-xs fill-engineering-green font-mono"
        >
          S={separation}m
        </text>
      </svg>
    </div>
  );
}
