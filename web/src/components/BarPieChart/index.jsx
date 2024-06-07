import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import axios from "axios";

const BarPieChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = echarts.init(chartRef.current);

    axios.get("http://localhost:5000/books").then((response) => {
      const data = response.data;

      // Process data to get the desired format for the bar and pie chart
      const categories = data.map((item) => item.title);
      const values = data.map((item) => item.rating);

      const option = {
        title: {
          text: "柱饼图",
        },
        tooltip: {
          trigger: "axis",
        },
        xAxis: {
          type: "category",
          data: categories,
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: values,
            type: "bar",
          },
          {
            type: "pie",
            data: values.map((value, index) => ({
              name: categories[index],
              value,
            })),
            center: ["75%", "35%"],
            radius: "28%",
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

export default BarPieChart;
