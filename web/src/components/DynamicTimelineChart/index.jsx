import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import axios from "axios";

const DynamicTimelineChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = echarts.init(chartRef.current);

    axios.get("http://localhost:5000/books").then((response) => {
      const data = response.data;

      // Process data to get the desired format for the timeline chart
      const categories = data.map((item) => item.publish_date);
      const values = data.map((item) => item.rating);

      const option = {
        baseOption: {
          timeline: {
            axisType: "category",
            data: categories,
            autoPlay: true,
            playInterval: 1000,
          },
          title: {
            text: "动态时间轴图",
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
              type: "line",
              areaStyle: {},
            },
          ],
        },
        options: categories.map((category, index) => ({
          title: { text: "动态时间轴图" },
          series: [
            {
              data: values.slice(0, index + 1),
            },
          ],
        })),
      };

      chart.setOption(option);
    });

    return () => {
      chart.dispose();
    };
  }, []);

  return <div ref={chartRef} style={{ width: "100%", height: "400px" }}></div>;
};

export default DynamicTimelineChart;
