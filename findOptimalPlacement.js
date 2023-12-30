"use strict";

export const findOptimalPlacement = (container, blocks) => {
  
  const sorted = blocks.sort((a, b) => b.width * b.height - a.width * a.height);
  const blockCoordinates = [];

  sorted.forEach((rec, index) => {
    let isSuitable = false;

    const rectangle = {
      width: rec.width,
      height: rec.height,
    };

    let x = 0;
    let y = container.height - rectangle.height;

    const changeOrientation = () => {
      if (rectangle.width === rectangle.height) return;

      if (rectangle.width === rec.width) {
        rectangle.width = rec.height;
        rectangle.height = rec.width;
        // newY = container.height - rec.width;
        // newX = x - rec.height;
      } else {
        rectangle.width = rec.width;
        rectangle.height = rec.height;
        // newY = container.height - rec.height;
        // newX = x + rec.width;
      }
    };

    const updateCoordinates = () => {
      x += 1;

      if (x + rectangle.width > container.width) {
        changeOrientation();
      }

      if (x + rectangle.width > container.width) {
        y -= 1;
        x = 0;
      }
    };

    const checkSuitability = (block) => {
      const byTop = block.top >= y + rectangle.height;
      const byLeft = block.left >= x + rectangle.width;
      const byRight = block.right <= x;
      const byBottom = block.bottom <= y;

      const result = byTop || byLeft || byRight || byBottom;
      return result;
    };

    while (!isSuitable) {
      isSuitable = true;

      for (const block of blockCoordinates) {
        if (!checkSuitability(block)) {
          updateCoordinates();
          isSuitable = false;
        }
      }
    }

    blockCoordinates.push({
      top: y,
      left: x,
      right: x + rectangle.width,
      bottom: y + rectangle.height,
      initialOrder: index,
    });
  });

  return {
    fullness: 0,
    blockCoordinates,
  };
};
