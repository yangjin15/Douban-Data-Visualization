import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import axios from "axios";

const BooksByPublisherChart = () => {
  const barChartRef = useRef(null);
  const pieChartRef = useRef(null);

  useEffect(() => {
    const barChart = echarts.init(barChartRef.current);
    const pieChart = echarts.init(pieChartRef.current);

    axios.get("http://localhost:5000/books-by-publisher").then((response) => {
      const data = response.data;
      const publishers = data.map((item) => item.publisher);
      const counts = data.map((item) => item.count);

      const barOption = {
        title: { text: "按出版社图书数量柱状图" },
        xAxis: {
          type: "category",
          data: publishers,
          //axisLabel: { rotate: 40 },
        },
        yAxis: { type: "value" },
        series: [{ data: counts, type: "bar" }],
      };

      const pieOption = {
        title: { text: "按出版社图书数量饼状图" },
        series: [
          {
            type: "pie",
            data: data.map((item) => ({
              name: item.publisher,
              value: item.count,
            })),
          },
        ],
      };

      barChart.setOption(barOption);
      pieChart.setOption(pieOption);
    });

    return () => {
      barChart.dispose();
      pieChart.dispose();
    };
  }, []);

  return (
    <div>
      <div ref={barChartRef} style={{ width: "100%", height: "400px" }}></div>
      <div ref={pieChartRef} style={{ width: "100%", height: "400px" }}></div>
    </div>
  );
};

export default BooksByPublisherChart;
