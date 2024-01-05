"use strict";

import { findOptimalPlacement } from "./findOptimalPlacement.js";
import { getRandomColor } from "./getRandomColor.js";

const CONTAINER = { width: "100vw", height: "100vh" };

const response = await fetch("./rectangles-1.json");
const blocks = await response.json();

const bodyElement = document.body;
const containerElement = document.createElement("div");

containerElement.classList.add("container");
containerElement.style.width = CONTAINER.width;
containerElement.style.height = CONTAINER.height;

bodyElement.appendChild(containerElement);

const updateContainerSize = () => {
  const { clientWidth, clientHeight } = containerElement;
  const container = { width: clientWidth, height: clientHeight };

  const { fullness, blockCoordinates } = findOptimalPlacement(
    container,
    blocks
  );

  containerElement.innerHTML = "";

  blockCoordinates.forEach((block) => {
    const blockElement = document.createElement("div");
    blockElement.classList.add("block");
    blockElement.style.top = `${block.top}px`;
    blockElement.style.left = `${block.left}px`;
    blockElement.style.width = `${block.right - block.left}px`;
    blockElement.style.height = `${block.bottom - block.top}px`;
    blockElement.style.backgroundColor = getRandomColor(
      blockElement.style.width,
      blockElement.style.height
    );

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

  const fullnessElement = document.createElement("p");
  fullnessElement.classList.add("fullness");
  fullnessElement.textContent = `Useful space coefficient: ${fullness}`;
  containerElement.appendChild(fullnessElement);
};

updateContainerSize();

window.addEventListener("resize", updateContainerSize);
