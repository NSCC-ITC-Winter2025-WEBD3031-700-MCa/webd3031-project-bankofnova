import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { MenuItem, Select, Typography, Box } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import DashboardCard from '../shared/DashboardCard';

interface RegistrationData {
  period: string;
  user_count: number;
  admin_count: number;
}

const UserRegistrationsChart = () => {
  const [filter, setFilter] = useState<"day" | "month" | "year">("day");
  const [roleFilter, setRoleFilter] = useState<"all" | "users" | "admin">("all");
  const [chartData, setChartData] = useState<{ categories: string[]; series: number[][] }>({
    categories: [],
    series: [],
  });

  const theme = useTheme();
  const userColor = theme.palette.primary.main;
  const adminColor = "#FF4560";

  useEffect(() => {
    fetch(`/api/user/registration-stats?filter=${filter}`)
      .then((res) => res.json())
      .then((data: RegistrationData[]) => {
        if (data.length > 0) {
          const filteredData = data.map((item) => ({
            period: formatPeriod(item.period, filter),
            user_count: roleFilter === "admin" ? 0 : item.user_count,
            admin_count: roleFilter === "users" ? 0 : item.admin_count,
          }));

          setChartData({
            categories: filteredData.map((item) => item.period),
            series: [
              filteredData.map((item) => item.user_count),
              filteredData.map((item) => item.admin_count),
            ],
          });
        } else {
          setChartData({ categories: [], series: [] });
        }
      })
      .catch((err) => console.error("Error fetching chart data:", err));
  }, [filter, roleFilter]);

  const formatPeriod = (period: string, filter: "day" | "month" | "year"): string => {
    console.log("Raw period:", period);  // Log the raw period value here
  
    const date = new Date(period);
  
    if (isNaN(date.getTime())) {
      console.warn(`Invalid date format: ${period}`);
      return period;
    }
  
    switch (filter) {
      case "day":
        return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
      case "month":
        return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
      case "year":
        return date.getUTCFullYear().toString();
      default:
        return period;
    }
  };
  

  const chartOptions: ApexOptions = {
    chart: {
      type: "bar",
      stacked: true,
      toolbar: { show: false },
    },
    xaxis: {
      categories: chartData.categories,
    },
    colors: [userColor, adminColor],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "80%",
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "center",
    },
    dataLabels: {
      enabled: false,
    },
  };

  return (
    <DashboardCard title="User Registrations">
      <>
        <Select
          value={filter}
          onChange={(e) => setFilter(e.target.value as "day" | "month" | "year")}
          style={{ marginBottom: "10px", marginRight: "10px" }}
        >
          <MenuItem value="day">Day</MenuItem>
          <MenuItem value="month">Month</MenuItem>
          <MenuItem value="year">Year</MenuItem>
        </Select>

        <Select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as "all" | "users" | "admin")}
          style={{ marginBottom: "10px" }}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="users">Users</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </Select>

        {chartData.series.length > 0 ? (
          <ReactApexChart
            options={chartOptions}
            series={[
              { name: "Users", data: chartData.series[0] },  // User data (Blue)
              { name: "Admins", data: chartData.series[1] }, // Admin data (Red)
            ]}
            type="bar"
            width={600}
            height={400}
          />
        ) : (
          <Typography>No data available</Typography>
        )}
      </>
    </DashboardCard>
  );
};

export default UserRegistrationsChart;
