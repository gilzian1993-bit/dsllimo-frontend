export const getYAxisConfig = (color: string, formatter?: (value: number) => string): any => ({
 labels: {
 style: {
 colors: color, // Using 'colors' (plural) to match X-axis format for consistency
 fontFamily: "Inter",
 },
 formatter: formatter || ((value: number) => {
   // Format numbers with proper decimal places
   if (value >= 1000000) {
     return (value / 1000000).toFixed(1) + "M";
   }
   if (value >= 1000) {
     return (value / 1000).toFixed(1) + "K";
   }
   return value.toFixed(0);
 }),
 },
});


export const getXAxisConfig = (colors: string): { } => ({
 categories: [
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
 labels: getLabel(colors),
 axisBorder: {
 show: false,
 },
 axisTicks: {
 show: false,
 },
});

export const getLabel = (colors:any): { } => ({
 style: {
 colors: colors,
 fontFamily: "Inter",
 },
});


export const getGridConfig = (color: string): { show: boolean; borderColor: string; strokeDashArray: number; position: string; } => ({
 show: true,
 borderColor: color,
 strokeDashArray: 10,
 position: "back",
});