import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, FileText } from "lucide-react";

const SALARY_DATA = [
  {
    id: 1,
    month: "March",
    year: "2025",
    amount: "$4,520",
    date: "31 Mar 2025",
    status: "Paid",
  },
  {
    id: 2,
    month: "February",
    year: "2025",
    amount: "$4,520",
    date: "28 Feb 2025",
    status: "Paid",
  },
  {
    id: 3,
    month: "January",
    year: "2025",
    amount: "$4,520",
    date: "31 Jan 2025",
    status: "Paid",
  },
  {
    id: 4,
    month: "December",
    year: "2024",
    amount: "$4,520",
    date: "31 Dec 2024",
    status: "Paid",
  },
  {
    id: 5,
    month: "November",
    year: "2024",
    amount: "$4,520",
    date: "30 Nov 2024",
    status: "Paid",
  },
  {
    id: 6,
    month: "October",
    year: "2024",
    amount: "$4,520",
    date: "31 Oct 2024",
    status: "Paid",
  },
];

const SalarySlips = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Salary Slips</h1>
        <p className="text-slate-500 mt-1">
          View and download your salary slips
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="hr-stat-card">
          <CardHeader className="pb-2">
            <CardTitle>Current Salary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="hr-stat-value">$54,240</div>
            <div className="hr-stat-label">Annual Gross</div>
          </CardContent>
        </Card>

        <Card className="hr-stat-card">
          <CardHeader className="pb-2">
            <CardTitle>Latest Payslip</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="hr-stat-value">$4,520</div>
            <div className="hr-stat-label">March 2025</div>
          </CardContent>
        </Card>

        <Card className="hr-stat-card">
          <CardHeader className="pb-2">
            <CardTitle>YTD Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="hr-stat-value">$13,560</div>
            <div className="hr-stat-label">Jan - Mar 2025</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Salary History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Period</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {SALARY_DATA.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    {item.month} {item.year}
                  </TableCell>
                  <TableCell>{item.amount}</TableCell>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalarySlips;
