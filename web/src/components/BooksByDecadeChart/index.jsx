import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import axios from "axios";

const BooksByDecadeChart = () => {
  const areaChartRef = useRef(null);

  useEffect(() => {
    const areaChart = echarts.init(areaChartRef.current);

    axios.get("http://localhost:5000/books-by-decade").then((response) => {
      const data = response.data;
      const decades = data.map((item) => `${item.decade}-${item.decade + 9}`);
      const counts = data.map((item) => item.count);

      const option = {
        title: { text: "按年份段图书数量面积图" },
        tooltip: {
          trigger: "axis",
          axisPointer: { type: "shadow" },
        },
        legend: {
          data: decades,
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: decades,
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "图书数量",
            type: "line",
            stack: "总量",
            areaStyle: {},
            data: counts,
          },
        ],
      };

      areaChart.setOption(option);
    });

    return () => {
      areaChart.dispose();
    };
  }, []);

  return (
    <div ref={areaChartRef} style={{ width: "100%", height: "400px" }}></div>
  );
};

export default BooksByDecadeChart;
