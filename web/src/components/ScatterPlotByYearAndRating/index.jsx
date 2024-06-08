import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import axios from "axios";

const ScatterPlotByYearAndRating = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = echarts.init(chartRef.current);

    axios
      .get("http://localhost:5000/books")
      .then((response) => {
        const data = response.data;
        const scatterData = data.map((item) => [
          item.publish_date,
          item.rating,
        ]);

        const option = {
          title: { text: "年份与评分散点图" },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "cross",
            },
          },
          xAxis: {
            type: "category",
            name: "年份",
            data: data.map((item) => item.publish_date),
            boundaryGap: false,
          },
          yAxis: {
            type: "value",
            name: "评分",
            min: 8,
            max: 10,
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
      })
      .catch((error) => {
        console.error("There was an error fetching the books data!", error);
      });

    return () => {
      chart.dispose();
    };
  }, []);

  return <div ref={chartRef} style={{ width: "100%", height: "400px" }}></div>;
};

export default ScatterPlotByYearAndRating;
