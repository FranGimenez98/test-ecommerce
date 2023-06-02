import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
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

export default function ChartGeneral({
  ordersByMonth,
}: {
  ordersByMonth: any;
}) {
  const [chartData, setChartData] = useState<{
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
    }[];
  }>({
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [],
  });

  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
  
    const sortedOrders = Object.keys(ordersByMonth).sort((a, b) => {
      const [yearA, monthA] = a.split('-').map((value) => parseInt(value));
      const [yearB, monthB] = b.split('-').map((value) => parseInt(value));
      return yearB - yearA || monthB - monthA;
    });
  
    const labels = sortedOrders.map((key) => ordersByMonth[key].month).reverse();
    const pendingData = sortedOrders.map((key) => ordersByMonth[key].pending).reverse();
    const approvedData = sortedOrders.map((key) => ordersByMonth[key].approved).reverse();
  

    const allMonths = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    console.log(sortedOrders);
    console.log(ordersByMonth);

    setChartData({
      labels,
      datasets: [
        {
          label: "Pending",
          data: pendingData,
          borderColor: "#1d4ed8",
          backgroundColor: "#1d4ed8",
        },
        {
          label: "Approved",
          data: approvedData,
          borderColor: "#15803d",
          backgroundColor: "#15803d",
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
          text: "Orders by Month",
          font: {
            size: 16,
            weight: "bold",
            family: "Arial, sans-serif",
          },
        },
      },
      maintainAspectRatio: false,
      responsive: true,
    });
  }, [ordersByMonth]);

  return (
    <div className="md:w-[95%] h-[200px] md:h-[100%]">
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
}
