import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import axios from "axios";

const BooksByYearChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = echarts.init(chartRef.current);

    axios.get("http://localhost:5000/books-by-year").then((response) => {
      const data = response.data;
      const years = data.map((item) => item.year);
      const counts = data.map((item) => item.count);

      const option = {
        title: { text: "按年份图书数量平滑曲线面积图（可拖动）" },
        tooltip: {
          trigger: "axis",
          axisPointer: { type: "shadow" },
        },
        xAxis: {
          type: "category",
          data: years,
          boundaryGap: false,
        },
        yAxis: { type: "value" },
        dataZoom: [
          { type: "slider", start: 0, end: 100 },
          { type: "inside", start: 0, end: 100 },
        ],
        series: [
          {
            name: "图书数量",
            type: "line",
            smooth: true,
            areaStyle: {},
            data: counts,
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

export default BooksByYearChart;
