import React, { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { connect } from "@/lib/db";
import Product from "@/models/Product";

interface AllProductsProps {
  totalProducts: number;
  maleProducts: number;
  femaleProducts: number;
}

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ChartProducts({
  totalProducts,
  maleProducts,
  femaleProducts,
}: AllProductsProps) {
  const [chartData, setChartData] = useState<{
    labels: string[];
    datasets: {
      data: number[];
      backgroundColor: string[];
      borderColor: string[];
      borderWidth: number;
    }[];
  }>({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
      },
    ],
  });

  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    if (
      totalProducts !== null &&
      maleProducts !== null &&
      femaleProducts !== null
    ) {
      const data = {
        labels: ["Male", "Female"],
        datasets: [
          {
            data: [maleProducts, femaleProducts],
            backgroundColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
            borderColor: ["rgba(255, 99, 132, 0.2)", "rgba(54, 162, 235, 0.2)"],
            borderWidth: 1,
          },
        ],
      };
      setChartData(data);

      setChartOptions({
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: `Total Products: ${totalProducts}`,
            font: {
              size: 16,
              weight: "bold",
              family: "Arial, sans-serif",
            },
          },
        },
        maintainAspectRatio: false,
        reponsive: true,
      });
    }
  }, [totalProducts, maleProducts, femaleProducts]);

  return chartData ? (
    <div className="md:w-[95%] h-[280px] md:h-[100%]">
      <Doughnut data={chartData} options={chartOptions} />
    </div>
  ) : null;
}

export async function getServerSideProps() {
  await connect();

  try {
    const totalProducts = await Product.countDocuments();
    const maleProducts = await Product.countDocuments({ sex: "Men" });
    const femaleProducts = await Product.countDocuments({ sex: "Women" });
    return {
      props: {
        totalProducts,
        maleProducts,
        femaleProducts,
      },
    };
  } catch (error) {
    return {
      props: {
        totalProducts: 0,
        maleProducts: 0,
        femaleProducts: 0,
      },
    };
  }
}
