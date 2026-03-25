"use client";

import RevinueChart from "./components/revinue-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Stats from "./components/stats";

const DashboardPageView = () => {
    return (
        <div className="space-y-6">
            <Card>
                <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                        <Stats />
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12">
                    <Card>
                        <CardHeader className="border-none pb-0 mb-0">
                            <div className="flex flex-wrap items-center gap-3">
                                <CardTitle className="flex-1 whitespace-nowrap">
                                    Revenue & Orders
                                </CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="px-0">
                            <RevinueChart />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default DashboardPageView;
