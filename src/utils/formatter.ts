function formatLatency(latency: number): string {
  let absLatency = Math.abs(latency);
  const units = ["ms", "s", "min"];
  let unitIndex = 0;
  while (absLatency >= 1000 && unitIndex < units.length - 1) {
    absLatency /= 1000;
    unitIndex++;
  }
  const formattedLatency = absLatency.toFixed(2);
  const formattedUnit = units[unitIndex];
  return `${formattedLatency}${formattedUnit}`;
}

export { formatLatency };
