const colors = {};

export const getRandomColor = (width, height) => {
  const block = `${width}+${height}`;

  if (!colors[block]) {
    colors[block] = `#${((Math.random() * 0xffffff) | 0)
      .toString(16)
      .padStart(6, "0")}`;
  }

  return colors[block];
};
