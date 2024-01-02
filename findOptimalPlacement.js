"use strict";

export const findOptimalPlacement = (container, blocks) => {
  const sorted = blocks.sort((a, b) => b.width * b.height - a.width * a.height);
  const blockCoordinates = [];

  const freeSpace = {
    x: 0,
    y: container.height,
  };

  const updateFreeSpace = (newX, newY) => {
    if (newX > freeSpace.x) freeSpace.x = newX;
    if (newY < freeSpace.y) freeSpace.y = newY;
  };

  const findSquare = (x, y) => {
    const tempFreeSpace = {
      x: freeSpace.x,
      y: freeSpace.y,
    };

    if (x > tempFreeSpace.x) tempFreeSpace.x = x;
    if (y < tempFreeSpace.y) tempFreeSpace.y = y;

    const square = (container.height - tempFreeSpace.y) * tempFreeSpace.x;
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

  return {
    fullness: 0,
    blockCoordinates,
  };
};
