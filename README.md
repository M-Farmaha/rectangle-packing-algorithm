# Algorithm for efficient placement of rectangular blocks"

This Algorithm is developed using JavaScript.

When changing the viewport, the algorithm automatically calculates the location of the blocks and displays the updated result on the page

## Review

![Review](/Presentation.jpg)

## How to Use

1. Follow the link or open the `index.html` file in your web browser.

2. Change viewport

## Technical Details

**Algorithm Description:** The algorithm efficiently arranges rectangular blocks within a 2D container, aiming for the densest placement to optimize space utilization. The algorithm calculates the most optimal order for placing rectangular blocks in a 2D container, ensuring the densest arrangement while minimizing the space occupied. The algorithm accommodates block rotation by 90°, and blocks do not overlap. It calculates the useful space utilization coefficient for the occupied container space.

**Block Representation:** Each block is uniquely colored, except for blocks of the same size, which share a common color. The color scheme ensures visual distinction between blocks, enhancing clarity in the layout.

**Block Indexing:** Each block inside the container has its original sequential number (index in the array), providing a clear reference to its initial order.

**Viewport Responsiveness:** The algorithm dynamically recalculates block positions and updates the display when the container size (viewport) changes. This ensures adaptability to varying viewport dimensions, providing a responsive and visually consistent user experience.

**Space Utilization Coefficient:** The algorithm calculates the useful space utilization coefficient, representing the ratio of the space occupied by blocks to the total container space. This coefficient is prominently displayed, offering insights into the efficiency of space utilization.

**Color Consistency:** Blocks of the same size share a common color, fostering a cohesive and visually organized design. This consistent color scheme enhances the user's ability to identify blocks with similar dimensions.

**Rotation Capability:** Blocks can be rotated by 90°, allowing for flexibility in their orientation within the container. This feature adds versatility to the algorithm, accommodating different block orientations for optimal placement.

**Real-time Updates:** The algorithm provides real-time updates to the block layout and space utilization coefficient, ensuring a dynamic and interactive user experience.

## How to Contribute

If you wish to make your own fixes or improvements to the game, you should:

1. Clone the repository to your computer.
2. Make changes and additions to the source code.
3. Test the algorithm to ensure everything works correctly.
4. Submit a pull request with your changes.

## Author

The "Algorithm for efficient placement of rectangular blocks" is developed by M-Farmaha in 2024.

## License

This project is distributed under the MIT License.

## Recommended Browser

We recommend using Google Chrome for the best experience when using our app.
