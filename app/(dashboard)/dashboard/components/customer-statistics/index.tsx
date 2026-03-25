
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatsChart from "./stats-chart";

const CustomerStatistics = () => {
    return (
        <Card className="py-2.5">
            <CardHeader className="flex-row items-center justify-between gap-4 border-none pb-0 ">
                <CardTitle>Booking Status</CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-8">
                <StatsChart />
            </CardContent>
        </Card>
    );
};

export default CustomerStatistics;