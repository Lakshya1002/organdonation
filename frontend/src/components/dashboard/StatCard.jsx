import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

export default function StatCard({ title, value, icon }) {
  return (
    <Card className="shadow-md hover:shadow-xl transition rounded-xl">
      <CardContent className="flex items-center justify-between">
        <div>
          <Typography className="text-gray-600 font-medium text-sm">
            {title}
          </Typography>
          <Typography className="text-2xl font-bold mt-1">{value}</Typography>
        </div>
        <div className="text-blue-600 text-4xl">{icon}</div>
      </CardContent>
    </Card>
  );
}
