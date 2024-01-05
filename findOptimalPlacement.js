"use strict";

export const findOptimalPlacement = (container, blocks) => {
  const sorted = blocks.sort((a, b) => b.width * b.height - a.width * a.height);
  const blockCoordinates = [];
  let freeAreas = [
    {
      top: 0,
      left: 0,
      right: container.width,
      bottom: container.height,
    },
  ];

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

  const updateFreeAreas = (areas, block) => {
    const newFreeAreas = [];
    const indexesToRemove = [];

    areas.forEach((area, index) => {
      if (
        area.left < block.right &&
        area.right > block.left &&
        area.top < block.bottom &&
        area.bottom > block.top
      ) {
        const intersection = {
          top: Math.max(area.top, block.top),
          left: Math.max(area.left, block.left),
          right: Math.min(area.right, block.right),
          bottom: Math.min(area.bottom, block.bottom),
        };

        if (area.top < intersection.top) {
          newFreeAreas.push({
            top: area.top,
            left: area.left,
            right: area.right,
            bottom: intersection.top,
          });
        }

        if (area.left < intersection.left) {
          newFreeAreas.push({
            top: intersection.top,
            left: area.left,
            right: intersection.left,
            bottom: intersection.bottom,
          });
        }

        if (area.right > intersection.right) {
          newFreeAreas.push({
            top: intersection.top,
            left: intersection.right,
            right: area.right,
            bottom: intersection.bottom,
          });
        }

        if (area.bottom > intersection.bottom) {
          newFreeAreas.push({
            top: intersection.bottom,
            left: area.left,
            right: area.right,
            bottom: area.bottom,
          });
        }

        indexesToRemove.push(index);
      }
    });

    areas = areas.filter((_, i) => !indexesToRemove.includes(i));
    return areas = [...areas, ...newFreeAreas];
  };

  const findEnclosedAreas = (areas, blocks) => {
    const enclosedAreas = [];

    areas.forEach((area) => {
      let isEnclosed = true;

      blocks.forEach((block) => {
        if (
          area.top >= block.top &&
          area.left >= block.left &&
          area.right <= block.right &&
          area.bottom <= block.bottom
        ) {
          isEnclosed = false;
        }
      });

      if (isEnclosed) {
        enclosedAreas.push(area);
      }
    });

    return enclosedAreas;
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

    freeAreas = updateFreeAreas(freeAreas, bestPosition);

    
  });

  const enclosedAreas = findEnclosedAreas(freeAreas, blockCoordinates)
  console.log(freeAreas);
  console.log(enclosedAreas);

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
