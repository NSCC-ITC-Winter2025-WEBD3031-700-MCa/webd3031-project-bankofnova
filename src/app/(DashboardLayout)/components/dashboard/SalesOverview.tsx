import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts"; // ✅ Import correct type
import { MenuItem, Select, Typography } from "@mui/material";

interface RegistrationData {
  period: string;
  count: number;
}

const UserRegistrationsChart = () => {
  const [filter, setFilter] = useState<"day" | "month" | "year">("day"); 
  const [chartData, setChartData] = useState<{ categories: string[]; series: number[] }>({
    categories: [],
    series: [],
  });

  useEffect(() => {
    fetch(`/api/user/registration-stats?filter=${filter}`)
      .then((res) => res.json())
      .then((data: RegistrationData[]) => {
        console.log(`Fetched Data (${filter}):`, data);

        if (data.length > 0) {
          setChartData({
            categories: data.map((item) => formatPeriod(item.period, filter)),
            series: data.map((item) => item.count),
          });
        } else {
          console.warn("No data available for the selected filter");
          setChartData({ categories: [], series: [] });
        }
      })
      .catch((err) => console.error("Error fetching chart data:", err));
  }, [filter]);

  const formatPeriod = (period: string, filter: "day" | "month" | "year") => {
    if (!period) return "Unknown";
    if (filter === "year") return period;

    const date = new Date(period);
    if (isNaN(date.getTime())) return "Invalid Date";

    return filter === "day"
      ? period.split("T")[0] 
      : `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
  };

  // ✅ Explicitly define type as ApexOptions
  const chartOptions: ApexOptions = {
    chart: {
      type: "bar", // ✅ Use a valid type instead of a generic string
      toolbar: { show: false },
    },
    xaxis: {
      categories: chartData.categories,
    },
    colors: ["#008FFB"],
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h6">User Registrations</Typography>

      <Select
        value={filter}
        onChange={(e) => setFilter(e.target.value as "day" | "month" | "year")}
        style={{ marginBottom: "10px" }}
      >
        <MenuItem value="day">Day</MenuItem>
        <MenuItem value="month">Month</MenuItem>
        <MenuItem value="year">Year</MenuItem>
      </Select>

      {chartData.series.length > 0 ? (
        <ReactApexChart
          options={chartOptions}
          series={[{ name: "Users", data: chartData.series }]}
          type="bar" // ✅ Make sure this matches a valid type
          width={600}
          height={400}
        />
      ) : (
        <Typography>No data available</Typography>
      )}
    </div>
  );
};

export default UserRegistrationsChart;
