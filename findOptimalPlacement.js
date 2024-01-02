"use strict";

export const findOptimalPlacement = (container, blocks) => {
  const sorted = blocks.sort((a, b) => b.width * b.height - a.width * a.height);
  const blockCoordinates = [];

  const freeSpace = {
    left: 0,
    down: 0,
    right: container.width,
    up: container.height,
  };

  const updateFreeSpace = () => {};

  sorted.forEach((rec, index) => {
    const findBestPosition = ({isRotated}) => {
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

    const normalBlock = findBestPosition({isRotated: false});

    const rotatedBlock = findBestPosition({isRotated: true});

    blockCoordinates.push(rotatedBlock);
  });

  return {
    fullness: 0,
    blockCoordinates,
  };
};
