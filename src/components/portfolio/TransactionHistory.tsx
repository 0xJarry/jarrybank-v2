'use client'

import { formatCurrency } from '@/lib/utils'
import {
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink,
} from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

/**
 * Transaction history component displaying recent DeFi transactions
 * Shows transaction status, amounts, and protocol information in a modern table format
 */
export function TransactionHistory() {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'failed'>('all')

  // Mock data for development - replace with real data fetching
  const mockTransactions = [
    {
      hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      type: 'swap',
      amount: '100.00 WAVAX',
      value: 2550.0,
      status: 'completed',
      protocol: 'Trader Joe',
      time: '30m ago',
      url: 'https://snowtrace.io/tx/0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    },
    {
      hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
      type: 'claim',
      amount: '500.00 JOE',
      value: 125.0,
      status: 'pending',
      protocol: 'Trader Joe',
      time: '5m ago',
      url: 'https://snowtrace.io/tx/0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    },
    {
      hash: '0x567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234',
      type: 'deposit',
      amount: '50.00 WETH.e',
      value: 160000.0,
      status: 'completed',
      protocol: 'GMX',
      time: '2h ago',
      url: 'https://snowtrace.io/tx/0x567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234',
    },
    {
      hash: '0x901234567890abcdef1234567890abcdef1234567890abcdef1234567890abcd',
      type: 'withdraw',
      amount: '25.00 WAVAX',
      value: 637.5,
      status: 'failed',
      protocol: 'Benqi',
      time: '4h ago',
      url: 'https://snowtrace.io/tx/0x901234567890abcdef1234567890abcdef1234567890abcdef1234567890abcd',
      error: 'Insufficient balance',
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="text-primary h-4 w-4" />
      case 'pending':
        return <Clock className="text-accent-foreground h-4 w-4" />
      case 'failed':
        return <XCircle className="text-destructive h-4 w-4" />
      default:
        return <AlertCircle className="text-secondary-foreground h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-primary bg-primary/10'
      case 'pending':
        return 'text-accent-foreground bg-accent/50'
      case 'failed':
        return 'text-destructive bg-destructive/25'
      default:
        return 'text-secondary-foreground bg-secondary/10'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'swap':
        return <ArrowUpRight className="text-primary h-4 w-4" />
      case 'deposit':
        return <ArrowDownLeft className="text-primary h-4 w-4" />
      case 'withdraw':
        return <ArrowUpRight className="text-destructive h-4 w-4" />
      case 'claim':
        return <CheckCircle className="text-accent-foreground h-4 w-4" />
      default:
        return <AlertCircle className="text-muted-foreground h-4 w-4" />
    }
  }

  const filteredTransactions = mockTransactions.filter(
    (tx) => filter === 'all' || tx.status === filter
  )

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <div className="flex items-center justify-between">
        <h3 className="text-foreground text-xl font-semibold">Recent Transactions</h3>
        <div className="flex space-x-2">
          {(['all', 'pending', 'completed', 'failed'] as const).map((status) => (
            <Button
              key={status}
              variant={filter === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(status)}
              className={
                filter === status
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground border-border'
              }
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Transactions Table - Modern table design */}
      <div className="bg-card border-border overflow-hidden rounded-xl border">
        {/* Table Header */}
        <div className="bg-muted/50 border-border text-muted-foreground grid grid-cols-7 gap-4 border-b p-4 text-sm font-medium">
          <div>TYPE</div>
          <div>PROTOCOL</div>
          <div>AMOUNT</div>
          <div>VALUE</div>
          <div>STATUS</div>
          <div>TIME</div>
          <div>ACTIONS</div>
        </div>

        {/* Table Rows */}
        {filteredTransactions.map((transaction) => (
          <div
            key={transaction.hash}
            className="border-border hover:bg-muted grid grid-cols-7 gap-4 border-b p-4 transition-colors last:border-b-0"
          >
            {/* Type Column */}
            <div className="flex items-center space-x-3">
              <div className="bg-muted/50 border-border flex h-8 w-8 items-center justify-center rounded-full border">
                {getTypeIcon(transaction.type)}
              </div>
              <div className="text-card-foreground font-medium capitalize">{transaction.type}</div>
            </div>

            {/* Protocol Column */}
            <div className="flex items-center">
              <div className="text-card-foreground font-medium">{transaction.protocol}</div>
            </div>

            {/* Amount Column */}
            <div className="flex items-center">
              <div className="text-card-foreground font-medium">{transaction.amount}</div>
            </div>

            {/* Value Column */}
            <div className="flex items-center">
              <div className="text-card-foreground font-medium">
                {formatCurrency(transaction.value)}
              </div>
            </div>

            {/* Status Column */}
            <div className="flex items-center">
              <div
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(transaction.status)}`}
              >
                {getStatusIcon(transaction.status)}
                <span className="ml-1 capitalize">{transaction.status}</span>
              </div>
            </div>

            {/* Time Column */}
            <div className="flex items-center">
              <div className="text-muted-foreground text-sm">{transaction.time}</div>
            </div>

            {/* Actions Column */}
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="outline"
                className="bg-secondary hover:bg-secondary/80 text-secondary-foreground border-border"
                onClick={() => window.open(transaction.url, '_blank')}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                View
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTransactions.length === 0 && (
        <div className="bg-card border-border rounded-xl border p-8 text-center">
          <div className="text-muted-foreground">
            No {filter !== 'all' ? filter : ''} transactions found
          </div>
        </div>
      )}
    </div>
  )
}
