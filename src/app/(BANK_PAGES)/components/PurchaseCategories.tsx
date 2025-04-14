'use client';

import * as React from 'react';
import {
  Box,
  Typography,
  Grid,
  Stack,
  Card,
  CardContent,
  CardHeader,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import type { SxProps } from '@mui/material/styles';
import type { ApexOptions } from 'apexcharts';
import { Chart } from './core/chart';
import { SelectChangeEvent } from '@mui/material';

const iconMapping = {
  Groceries: LocalGroceryStoreIcon,
  Restaurants: RestaurantIcon,
  'Online Shopping': ShoppingCartIcon,
  Transportation: DirectionsCarIcon,
} as Record<string, React.ElementType>;

export interface PurchaseCategoriesProps {
  chartSeries: number[];
  labels: string[];
  sx?: SxProps;
}

// Define a union type for time frame keys
type TimeFrame = '7 Days' | '30 Days' | '60 Days' | '90 Days';

function PurchaseCategories({
  chartSeries = [40, 30, 20, 10],
  labels = ['Groceries', 'Restaurants', 'Online Shopping', 'Transportation'],
  sx,
}: PurchaseCategoriesProps): React.JSX.Element {
  const chartOptions = useChartOptions(labels);
  const [selectedTimeFrame, setSelectedTimeFrame] = React.useState<TimeFrame>('30 Days'); // Type it as TimeFrame
  const [updatedChartSeries, setUpdatedChartSeries] = React.useState(chartSeries); // To track updated data

  // Define data for each time frame
  const timeFrameData: Record<TimeFrame, number[]> = {
    '7 Days': [35, 25, 30, 10],
    '30 Days': [40, 30, 20, 10],
    '60 Days': [45, 25, 15, 15],
    '90 Days': [50, 20, 15, 15],
  };

  const handleTimeFrameChange = (event: SelectChangeEvent<string>) => {
    // Cast the selected value to TimeFrame type
    const selected = event.target.value as TimeFrame;
    setSelectedTimeFrame(selected);

    // Update the chart data based on the selected time frame
    setUpdatedChartSeries(timeFrameData[selected]);
  };

  return (
    <Card sx={sx} elevation={0}>
      <CardContent>
        <Typography variant="h4">
          Transaction Breakdown
        </Typography>

        <Grid container spacing={2} alignItems="center" mb={5} mt={2}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel id="timeframe-label">Time Frame</InputLabel>
              <Select
                labelId="timeframe-label"
                value={selectedTimeFrame}
                label="Time Frame"
                onChange={handleTimeFrameChange}
              >
                <MenuItem value="7 Days">Last 7 Days</MenuItem>
                <MenuItem value="30 Days">Last 30 Days</MenuItem>
                <MenuItem value="60 Days">Last 60 Days</MenuItem>
                <MenuItem value="90 Days">Last 90 Days</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Grid container spacing={2} alignItems="flex-start">
          <Grid item xs={12} md={6}>
            <Chart
              height={300}
              options={chartOptions}
              series={updatedChartSeries} // Use the updated chart series
              type="donut"
              width="100%"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid container spacing={3}>
              {updatedChartSeries.map((item, index) => {
                const label = labels[index];
                const Icon = iconMapping[label];

                const fakeData = `$${(Math.random() * 200 + 50).toFixed(2)}`;

                return (
                  <Grid item xs={4} key={label} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Card elevation={9} sx={{ width: '240px', height: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <CardContent sx={{ textAlign: 'center' }}>
                        {Icon ? <Icon fontSize="large" /> : null}
                        <Typography variant="h6">{label}</Typography>
                        <Typography color="text.secondary" variant="subtitle2">
                          {fakeData}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
              {updatedChartSeries.length < 9 && (
                <Grid item xs={4} />
              )}
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

function useChartOptions(labels: string[]): ApexOptions {
  const theme = useTheme();

  return {
    chart: { background: 'transparent' },
    colors: [theme.palette.primary.main, theme.palette.warning.main, theme.palette.secondary.light, theme.palette.info.main],
    dataLabels: { enabled: false },
    labels,
    legend: { show: false },
    plotOptions: { pie: { expandOnClick: false } },
    states: { active: { filter: { type: 'none' } }, hover: { filter: { type: 'none' } } },
    stroke: { width: 0 },
    theme: { mode: theme.palette.mode },
    tooltip: { fillSeriesColor: false },
  };
}

export default PurchaseCategories;
