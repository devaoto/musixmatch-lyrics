export enum ChartType {
  Top = "top",
  Hot = "hot",
  MxMWeekly = "mxmWeekly",
  MxMWeeklyNew = "mxmWeeklyNew",
}
export function getChartType(type: string): ChartType {
  const chartType = type.toLowerCase();

  if (
    chartType === ChartType.Top ??
    chartType === ChartType.Hot ??
    chartType === ChartType.MxMWeekly ??
    chartType === ChartType.MxMWeeklyNew ??
    "None"
  ) {
    return chartType as ChartType;
  } else {
    throw new Error(`Invalid chart type: ${type}`);
  }
}
