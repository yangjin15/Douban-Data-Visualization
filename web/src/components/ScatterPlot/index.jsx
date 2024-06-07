import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import axios from "axios";

const ScatterPlot = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = echarts.init(chartRef.current);

    axios.get("http://localhost:5000/books").then((response) => {
      const data = response.data;

      // Process data to get the desired format for the scatter plot
      const scatterData = data.map((item) => [item.rating, item.rating_count]);

      const option = {
        title: {
          text: "评分散点图",
        },
        xAxis: {
          type: "value",
          name: "评分",
        },
        yAxis: {
          type: "value",
          name: "评分人数",
        },
        series: [
          {
            symbolSize: 10,
            data: scatterData,
            type: "scatter",
          },
        ],
      };

      chart.setOption(option);
    });

    return () => {
      chart.dispose();
    };
  }, []);

  return <div ref={chartRef} style={{ width: "100%", height: "400px" }}></div>;
};

export default ScatterPlot;
