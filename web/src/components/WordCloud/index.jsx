import React, { useEffect, useState } from "react";
import axios from "axios";
import WordCloud from "react-wordcloud";

const WordCloudComponent = () => {
  const [words, setWords] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/book-summaries")
      .then((response) => {
        const summaries = response.data.join(" ");
        const wordArray = summaries.split(" ");
        const wordCount = {};

        wordArray.forEach((word) => {
          wordCount[word] = (wordCount[word] || 0) + 1;
        });

        const wordList = Object.keys(wordCount).map((key) => ({
          text: key,
          value: wordCount[key],
        }));

        setWords(wordList);
      })
      .catch((error) => {
        console.error("There was an error fetching the summaries!", error);
      });
  }, []);

  const options = {
    rotations: 2,
    rotationAngles: [-90, 0],
    fontSizes: [10, 60],
  };

  return (
    <div style={{ height: 400, width: "100%" }}>
      <WordCloud words={words} options={options} />
    </div>
  );
};

export default WordCloudComponent;
