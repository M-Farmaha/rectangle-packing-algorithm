"use strict";

export const findOptimalPlacement = (container, blocks) => {
  const sorted = blocks.sort((a, b) => b.width * b.height - a.width * a.height);
  const blockCoordinates = [];

  let freeSpaceX = 0;
  let freeSpaceY = container.height;

  const updateFreeSpace = (right, top) => {
    if (right > freeSpaceX) freeSpaceX = right;
    if (top < freeSpaceY) freeSpaceY = top;
  };

  const findSquare = (right, top) => {
    let x = freeSpaceX;
    let y = freeSpaceY;

    if (right > x) x = right;
    if (top < y) y = top;

    const square = (container.height - y) * x;
    return square;
  };

  sorted.forEach((rec, index) => {
    const findBestPosition = ({ isRotated }) => {
      let isSuitable = false;

      const width = isRotated ? rec.height : rec.width;
      const height = isRotated ? rec.width : rec.height;

      let x = 0;
      let y = container.height - height;

      const updateCoordinates = () => {
        x += 1;

        if (x + width > container.width) {
          y -= 1;
          x = 0;
        }

        // if (y + height > container.height) {
        //   y = container.height - height;
        // }
      };

      const checkSuitability = (block) => {
        const byTop = block.top >= y + height;
        const byLeft = block.left >= x + width;
        const byRight = block.right <= x;
        const byBottom = block.bottom <= y;

        const result = byTop || byLeft || byRight || byBottom;
        return result;
      };

      const findPlace = () => {
        while (!isSuitable) {
          isSuitable = true;

          for (const block of blockCoordinates) {
            if (!checkSuitability(block)) {
              updateCoordinates();
              isSuitable = false;
            }
          }
        }

        return {
          top: y,
          left: x,
          right: x + width,
          bottom: y + height,
          initialOrder: index,
        };
      };

      const result = findPlace();

      return result;
    };

    const normal = findBestPosition({ isRotated: false });
    const rotated = findBestPosition({ isRotated: true });

    const normalSquare = findSquare(normal.right, normal.top);
    const rotatedSquare = findSquare(rotated.right, rotated.top);

    const bestPosition = normalSquare < rotatedSquare ? normal : rotated;

    blockCoordinates.push(bestPosition);

    updateFreeSpace(bestPosition.right, bestPosition.top);
  });

  const filledSquare = findSquare(freeSpaceX, freeSpaceY);
  const blocksSquare = blockCoordinates.reduce(
    (acc, block) =>
      acc + (block.right - block.left) * (block.bottom - block.top),
    0
  );
  const voids = filledSquare - blocksSquare;
  const fullness = (1 - voids / (voids + blocksSquare)).toFixed(2);

  return {
    fullness,
    blockCoordinates,
  };
};
