"use client";

import { formatCurrency, truncateAddress } from "@/lib/utils";
import {
  RefreshCw,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/**
 * Transaction history component displaying recent DeFi transactions
 * Shows transaction status, amounts, and protocol information
 */
export function TransactionHistory() {
  const [filter, setFilter] = useState<
    "all" | "pending" | "completed" | "failed"
  >("all");

  // Mock data for development - replace with real data fetching
  const mockTransactions = [
    {
      hash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
      type: "swap",
      amount: "100.00 WAVAX",
      value: 2550.0,
      status: "completed",
      protocol: "Trader Joe",
      time: "30m ago",
      url: "https://snowtrace.io/tx/0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    },
    {
      hash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
      type: "claim",
      amount: "500.00 JOE",
      value: 125.0,
      status: "pending",
      protocol: "Trader Joe",
      time: "5m ago",
      url: "https://snowtrace.io/tx/0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    },
    {
      hash: "0x567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234",
      type: "deposit",
      amount: "50.00 WETH.e",
      value: 160000.0,
      status: "completed",
      protocol: "GMX",
      time: "2h ago",
      url: "https://snowtrace.io/tx/0x567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234",
    },
    {
      hash: "0x901234567890abcdef1234567890abcdef1234567890abcdef1234567890abcd",
      type: "withdraw",
      amount: "25.00 WAVAX",
      value: 637.5,
      status: "failed",
      protocol: "Benqi",
      time: "4h ago",
      url: "https://snowtrace.io/tx/0x901234567890abcdef1234567890abcdef1234567890abcdef1234567890abcd",
      error: "Insufficient balance",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-slate-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "failed":
        return "text-red-600 bg-red-100";
      default:
        return "text-slate-600 bg-slate-100";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "swap":
        return <ArrowUpRight className="h-4 w-4 text-blue-500" />;
      case "deposit":
        return <ArrowDownLeft className="h-4 w-4 text-green-500" />;
      case "withdraw":
        return <ArrowUpRight className="h-4 w-4 text-red-500" />;
      case "claim":
        return <ArrowUpRight className="h-4 w-4 text-purple-500" />;
      default:
        return <ArrowUpRight className="h-4 w-4 text-slate-500" />;
    }
  };

  const filteredTransactions = mockTransactions.filter((tx) => {
    if (filter === "all") return true;
    return tx.status === filter;
  });

  const handleRefresh = () => {
    // TODO: Implement real data refresh
    console.log("Refreshing transaction data...");
  };

  return (
    <div className="space-y-6">
      {/* Header and Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-slate-800">
            Recent Transactions
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {(["all", "pending", "completed", "failed"] as const).map(
            (status) => (
              <Button
                key={status}
                variant={filter === status ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(status)}
                className="capitalize"
              >
                {status}
              </Button>
            )
          )}
        </div>
      </div>

      {/* Transactions Table */}
      <Card className="bg-white bg-opacity-80 backdrop-blur-sm border-slate-200 overflow-hidden shadow-lg">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-100 bg-opacity-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Protocol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredTransactions.map((tx) => (
                  <tr
                    key={tx.hash}
                    className="hover:bg-slate-100 hover:bg-opacity-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-lg bg-slate-200 flex items-center justify-center mr-3">
                          {getTypeIcon(tx.type)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-800 capitalize">
                            {tx.type}
                          </div>
                          <div className="text-xs text-slate-500">
                            {truncateAddress(tx.hash)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-800">{tx.amount}</div>
                      <div className="text-sm text-slate-600">
                        {formatCurrency(tx.value)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(tx.status)}
                        <span
                          className={`ml-2 text-xs px-2 py-1 rounded-full ${getStatusColor(tx.status)} capitalize`}
                        >
                          {tx.status}
                        </span>
                      </div>
                      {tx.error && (
                        <div className="text-xs text-red-600 mt-1">
                          {tx.error}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                      {tx.protocol}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {tx.time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 p-0 h-auto"
                      >
                        <a
                          href={tx.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium"
                        >
                          View
                          <ArrowUpRight className="h-3 w-3 ml-1" />
                        </a>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
