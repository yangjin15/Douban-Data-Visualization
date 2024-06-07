import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import axios from "axios";

const AreaChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = echarts.init(chartRef.current);

    axios.get("http://localhost:5000/books").then((response) => {
      const data = response.data;

      // Process data to get the desired format for the area chart
      const categories = data.map((item) => item.title);
      const values = data.map((item) => item.rating);

      const option = {
        title: {
          text: "面积图",
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
            type: "line",
            areaStyle: {},
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

export default AreaChart;
