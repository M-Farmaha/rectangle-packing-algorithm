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

  const findFilledSquare = (right, top) => {
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
    return (areas = [...areas, ...newFreeAreas]);
  };

  const findTouchingAreas = (areas) => {
    const graph = {};

    areas.forEach((area, index) => {
      graph[index] = [];
      areas.forEach((otherArea, otherIndex) => {
        if (
          index !== otherIndex &&
          ((area.top >= otherArea.top && area.top <= otherArea.bottom) ||
            (area.bottom >= otherArea.top &&
              area.bottom <= otherArea.bottom)) &&
          ((area.left >= otherArea.left && area.left <= otherArea.right) ||
            (area.right >= otherArea.left && area.right <= otherArea.right))
        ) {
          graph[index].push(otherIndex);
        }
      });
    });

    const visited = new Set();
    const result = [];

    const dfs = (start, currentSet) => {
      visited.add(start);
      currentSet.add(start);

      graph[start].forEach((neighbor) => {
        if (!visited.has(neighbor)) {
          dfs(neighbor, currentSet);
        }
      });
    };

    areas.forEach((area, index) => {
      if (!visited.has(index)) {
        const currentSet = new Set();
        dfs(index, currentSet);
        result.push(Array.from(currentSet));
      }
    });

    return result.map((indices) => indices.map((index) => areas[index]));
  };

  const findOpenSpace = (touchingAreas) => {
    if (touchingAreas.length === 0) {
      return null;
    }

    let openSpace = touchingAreas[0];

    touchingAreas.forEach((areaArray) => {
      const areaTop = Math.min(...areaArray.map((a) => a.top));
      const areaRight = Math.max(...areaArray.map((a) => a.right));

      const openSpaceTop = Math.min(...openSpace.map((a) => a.top));
      const openSpaceRight = Math.max(...openSpace.map((a) => a.right));

      if (
        areaTop < openSpaceTop ||
        (areaTop === openSpaceTop && areaRight < openSpaceRight)
      ) {
        openSpace = areaArray;
      }
    });

    return openSpace;
  };

  const findAreaSquare = (area) => {
    const width = area.right - area.left;
    const height = area.bottom - area.top;

    return width * height;
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

    const normalSquare = findFilledSquare(normal.right, normal.top);
    const rotatedSquare = findFilledSquare(rotated.right, rotated.top);

    const bestPosition = normalSquare < rotatedSquare ? normal : rotated;

    blockCoordinates.push(bestPosition);

    updateFreeSpace(bestPosition.right, bestPosition.top);

    freeAreas = updateFreeAreas(freeAreas, bestPosition);
  });

  const touchingAreas = findTouchingAreas(freeAreas);
  const openSpace = findOpenSpace(touchingAreas);
  const openSpaceSquare = openSpace.reduce(
    (acc, area) => acc + findAreaSquare(area),
    0
  );

  const blocksSquare = blockCoordinates.reduce(
    (acc, block) => acc + findAreaSquare(block),
    0
  );

  const containerAreaSquare = container.width * container.height;

  const closedSpaceSquare =
    containerAreaSquare - openSpaceSquare - blocksSquare;

  console.log(closedSpaceSquare);

  const fullness = (
    1 -
    closedSpaceSquare / (closedSpaceSquare + blocksSquare)
  ).toFixed(4);

  return {
    fullness,
    blockCoordinates,
  };
};
