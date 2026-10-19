// Vite fingerprints each figure so updated icons cannot reuse a cached image.
const figures = import.meta.glob('../../assets/sentinel/*.png', {
  eager: true,
  query: '?url',
  import: 'default',
});

export function sentinelFigureUrl(screen) {
  return figures[`../../assets/sentinel/${screen}.png`];
}
