"use strict";

import { findOptimalPlacement } from "./findOptimalPlacement.js";
import { getRandomColor } from "./getRandomColor.js";

const CONTAINER = { width: "100vw", height: "100vh" };

const BLOCKS = [
  { width: 129, height: 121 },
  { width: 78, height: 69 },
  { width: 21, height: 207 },
  { width: 18, height: 172 },
  { width: 52, height: 52 },
  { width: 15, height: 145 },
  { width: 26, height: 26 },
  { width: 26, height: 26 },
  { width: 23, height: 23 },
  { width: 23, height: 23 },
];

const bodyElement = document.body;
const containerElement = document.createElement("div");

containerElement.classList.add("container");
containerElement.style.width = CONTAINER.width;
containerElement.style.height = CONTAINER.height;

bodyElement.appendChild(containerElement);

const updateContainerSize = () => {
  const { clientWidth, clientHeight } = containerElement;
  const container = { width: clientWidth, height: clientHeight };

  const { fullness, blockCoordinates } = findOptimalPlacement(container, BLOCKS);

  containerElement.innerHTML = '';

  blockCoordinates.forEach((block) => {
    const blockElement = document.createElement("div");
    blockElement.classList.add("block");
    blockElement.style.top = `${block.top}px`;
    blockElement.style.left = `${block.left}px`;
    blockElement.style.width = `${block.right - block.left}px`;
    blockElement.style.height = `${block.bottom - block.top}px`;
    blockElement.style.backgroundColor = getRandomColor();

    const textElement = document.createElement("p");
    textElement.classList.add("text");
    const smallerDimension = Math.min(
      block.right - block.left,
      block.bottom - block.top
    );
    textElement.style.fontSize = `${smallerDimension * 0.5}px`;

    textElement.textContent = block.initialOrder;
    blockElement.appendChild(textElement);
    containerElement.appendChild(blockElement);
  });
};

updateContainerSize();


window.addEventListener("resize", updateContainerSize);



