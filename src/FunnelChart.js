import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import Papa from "papaparse";
import "chart.js/auto";

const FunnelChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Male",
        data: [],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
      {
        label: "Female",
        data: [],
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  });

  useEffect(() => {
    const fetchCSVData = async () => {
      const response = await fetch("data.csv");
      //   console.log(response);
      const reader = response.body.getReader();
      const result = await reader.read(); // raw array
      //   console.log(result);
      const decoder = new TextDecoder("utf-8");
      const csv = decoder.decode(result.value); // the CSV text
      // console.log(csv);
      const parseNumber = (str) => {
        return parseInt(str.replace(/,/g, ""), 10);
      };

      Papa.parse(csv, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const data = results.data;
          //   console.log(data);
          // Calculate percentages and set chart data
          const totalPopulation = data.reduce(
            (acc, row) => acc + parseNumber(row.Male) + parseNumber(row.Female),
            0
          );
          console.log("totalPopulation: ", totalPopulation);
          const malePercentages = data.map((row) => parseFloat(row.Male));

          console.log("malePercentages: ", malePercentages);
          const femalePercentages = data.map((row) => parseFloat(row.Female));

          setChartData({
            labels: data.map((row) => row["Age"]),
            datasets: [
              {
                label: "Male",
                data: malePercentages.map((value) => -value), // Negative for left side
                backgroundColor: "rgba(54, 22, 135, 0.6)",
              },
              {
                label: "Female",
                data: femalePercentages,
                backgroundColor: "rgba(255, 99, 32, 0.6)",
              },
            ],
          });
        },
      });
    };

    fetchCSVData();
  }, []);

  const options = {
    indexAxis: "y",
    responsive: true,
    scales: {
      x: {
        stacked: true,
        ticks: {
          callback: function (value) {
            return Math.abs(value); // Show absolute value
          },

          stepSize: 0.5, // want steps of 1%
        },
        grid: {
          drawOnChartArea: true, // grid where there are ticks
        },
        beginAtZero: true,
        title: {
          display: true,
          text: "Percentage of Population (%)", // Title for the x-axis
          color: "#666",
          font: {
            family: "Tahoma",
            size: 13,
            weight: "bold",
            lineHeight: 1,
          },
          padding: { top: 20, bottom: 30 },
        },
      },
      y: {
        stacked: true,
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: "Population Funnel Chart",
        font: {
          family: "Tahoma",
          size: 16,
          weight: "bold",
          lineHeight: 1,
        },
      },
    },
  };

  return (
    <div>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default FunnelChart;
