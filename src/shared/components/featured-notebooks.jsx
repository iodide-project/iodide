import React from "react";
import PropTypes from "prop-types";
import NotebookDisplay from "./three-set/three-elements";
import NotebookDisplayItem from "./featured-notebook-item";

const FeaturedNotebooks = ({ width }) => (
  <NotebookDisplay width={width}>
    <NotebookDisplayItem
      title="A Brief Tour through Iodide"
      description="
                   A tutorial that walks through all the important parts of Iodide."
      href="https://iodide.io/notebooks/154/"
      imageSource="https://media.giphy.com/media/5qF68SjjIT6khDkS5T/giphy.gif"
    />
    <NotebookDisplayItem
      title="The Lorenz Attractor Up-Close"
      description="
                   A concise example demonstrating how powerful
                   a web tech-focused notebook environment is for computational presentations."
      href="https://iodide.io/notebooks/34/?viewMode=report"
      imageSource="https://media.giphy.com/media/ftdkB78fuQ1Eb3J2o1/giphy.gif"
    />
    <NotebookDisplayItem
      title="Pyodide: Scientific Python in your Browser"
      description="
                A tutorial demonstrating how
                to use Python, Numpy, Pandas, and Matplotlib entirely within your browser."
      href="https://iodide.io/notebooks/300/"
      imageSource="https://media.giphy.com/media/65NKOOH1IQrsLx5aZb/giphy.gif"
    />
    <NotebookDisplayItem
      title="World Happiness Report"
      description="A neat data exploration using the World Happiness Report."
      href="https://iodide.io/notebooks/193/?viewMode=report"
      imageSource="https://media.giphy.com/media/i4rRuA3cksj8a9R58g/giphy.gif"
    />
    <NotebookDisplayItem
      title="Peering into the Unknown"
      description="One man's cartoon / WebGL journey into his own brain."
      href="https://iodide.io/notebooks/194/?viewMode=report"
      imageSource="https://media.giphy.com/media/9G6RGV7z6k4uzygzOQ/giphy.gif"
    />
    <NotebookDisplayItem
      title="Eviction Notices By SF Neighborhood, 1999-present"
      description="
                A small data presentation about one aspect of the SF Housing crisis."
      href="https://iodide.io/notebooks/144/?viewMode=report"
      imageSource="https://media.giphy.com/media/MohSU55IoyGmAXgEkY/giphy.gif"
    />
  </NotebookDisplay>
);

FeaturedNotebooks.propTypes = {
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};

export default FeaturedNotebooks;
