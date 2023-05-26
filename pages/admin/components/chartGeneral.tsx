import React, { useState, useEffect } from "react";
import {Bar} from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function ChartGeneral() {
  const [chartData, setChartData] = useState<{
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
    }[];
  }>({
    labels: [],
    datasets: [],
  });

  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    setChartData({
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      datasets: [
        {
          label: "Products",
          data: [89, 78, 878, 789, 77, 88, 99, 232, 44 ,342, 2324, 24],
          borderColor: "#1d4ed8",
          backgroundColor: "#1d4ed8",
        },
        {
          label: "Users",
          data: [90, 78, 67, 65, 23, 45, 765, 234, 343, 364, 464, 643],
          borderColor: "#15803d",
          backgroundColor: "#15803d",
        },
        {
          label: "Purchases",
          data: [45, 75, 566, 77, 87, 67, 89, 345, 453, 463, 363, 86, 869],
          borderColor: "#fde68a",
          backgroundColor: "#fde68a",
        },
      ],
    });

    setChartOptions({
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "STOCK",
        },
      },
      maintainAspectRatio: false,
      reponsive: true,
    });
  }, []);

  return (
    <div className="w-[95%] h-[95%]">
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
}