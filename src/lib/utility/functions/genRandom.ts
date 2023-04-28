export function genRandomFloat(min: number, max: number) {
  return Math.random() * (max - min + 1) + min;
}

export function genRandomInt(min: number, max: number) {
  // min and max included
  return Math.floor(genRandomFloat(min, max));
}
