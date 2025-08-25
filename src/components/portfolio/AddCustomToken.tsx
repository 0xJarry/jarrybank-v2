/**
 * AddCustomToken Modal Component
 * Add custom tokens by contract address
 */

'use client';

import { useState, useCallback } from 'react';
import { X, Plus, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { isAddress, type Address, getContract } from 'viem';
import { usePublicClient } from 'wagmi';
import tokenRegistry, { type TokenMetadata } from '@/lib/tokenRegistry';
import { cn } from '@/lib/utils';

/**
 * Component props
 */
interface AddCustomTokenProps {
  isOpen: boolean;
  onClose: () => void;
  onTokenAdded?: (token: TokenMetadata) => void;
  chainId?: string;
}

/**
 * ERC20 ABI for token metadata
 */
const ERC20_ABI = [
  {
    inputs: [],
    name: 'name',
    outputs: [{ type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [{ type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

/**
 * Form state
 */
interface FormState {
  address: string;
  symbol: string;
  name: string;
  decimals: string;
}

/**
 * AddCustomToken component
 */
export function AddCustomToken({
  isOpen,
  onClose,
  onTokenAdded,
  chainId = '43114',
}: AddCustomTokenProps) {
  const publicClient = usePublicClient();
  const [formState, setFormState] = useState<FormState>({
    address: '',
    symbol: '',
    name: '',
    decimals: '18',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [autoDetecting, setAutoDetecting] = useState(false);

  /**
   * Auto-detect token metadata from contract
   */
  const autoDetectToken = useCallback(async (address: Address) => {
    if (!publicClient) return;
    
    setAutoDetecting(true);
    setError(null);
    
    try {
      const contract = getContract({
        address,
        abi: ERC20_ABI,
        client: publicClient,
      });
      
      // Fetch token metadata
      const [name, symbol, decimals] = await Promise.all([
        contract.read.name().catch(() => 'Unknown Token'),
        contract.read.symbol().catch(() => 'UNKNOWN'),
        contract.read.decimals().catch(() => 18),
      ]);
      
      setFormState(prev => ({
        ...prev,
        name: name as string,
        symbol: symbol as string,
        decimals: decimals.toString(),
      }));
      
      setError(null);
    } catch (err) {
      console.error('Failed to auto-detect token:', err);
      setError('Failed to auto-detect token metadata. Please enter manually.');
    } finally {
      setAutoDetecting(false);
    }
  }, [publicClient]);

  /**
   * Handle address input change
   */
  const handleAddressChange = async (value: string) => {
    setFormState(prev => ({ ...prev, address: value }));
    setError(null);
    setSuccess(false);
    
    // Auto-detect if valid address
    if (isAddress(value)) {
      await autoDetectToken(value as Address);
    }
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    
    // Validate address
    if (!isAddress(formState.address)) {
      setError('Invalid contract address');
      return;
    }
    
    // Validate other fields
    if (!formState.symbol || !formState.name) {
      setError('Symbol and name are required');
      return;
    }
    
    const decimals = parseInt(formState.decimals);
    if (isNaN(decimals) || decimals < 0 || decimals > 18) {
      setError('Decimals must be between 0 and 18');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const token: TokenMetadata = {
        address: formState.address as Address,
        symbol: formState.symbol,
        name: formState.name,
        decimals,
        chain: chainId,
        isCustom: true,
        addedAt: Date.now(),
      };
      
      await tokenRegistry.addCustomToken(token);
      
      setSuccess(true);
      onTokenAdded?.(token);
      
      // Reset form after short delay
      setTimeout(() => {
        setFormState({
          address: '',
          symbol: '',
          name: '',
          decimals: '18',
        });
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to add token');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Reset and close
   */
  const handleClose = () => {
    setFormState({
      address: '',
      symbol: '',
      name: '',
      decimals: '18',
    });
    setError(null);
    setSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-md rounded-lg bg-background p-6 shadow-lg">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Add Custom Token</h2>
          <button
            onClick={handleClose}
            className="rounded-lg p-1 hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Contract Address */}
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Token Contract Address
            </label>
            <div className="relative">
              <input
                type="text"
                value={formState.address}
                onChange={(e) => handleAddressChange(e.target.value)}
                placeholder="0x..."
                className="w-full rounded-lg border bg-background px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={isLoading}
              />
              {autoDetecting && (
                <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
              )}
            </div>
          </div>

          {/* Token Symbol */}
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Token Symbol
            </label>
            <input
              type="text"
              value={formState.symbol}
              onChange={(e) => setFormState(prev => ({ ...prev, symbol: e.target.value }))}
              placeholder="e.g., USDC"
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isLoading || autoDetecting}
            />
          </div>

          {/* Token Name */}
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Token Name
            </label>
            <input
              type="text"
              value={formState.name}
              onChange={(e) => setFormState(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., USD Coin"
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isLoading || autoDetecting}
            />
          </div>

          {/* Decimals */}
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Decimals
            </label>
            <input
              type="number"
              value={formState.decimals}
              onChange={(e) => setFormState(prev => ({ ...prev, decimals: e.target.value }))}
              placeholder="18"
              min="0"
              max="18"
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isLoading || autoDetecting}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-500/10 p-3 text-sm text-red-500">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="flex items-center gap-2 rounded-lg bg-green-500/10 p-3 text-sm text-green-500">
              <CheckCircle className="h-4 w-4 flex-shrink-0" />
              <span>Token added successfully!</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 rounded-lg border py-2 text-sm font-medium hover:bg-muted"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || autoDetecting || !formState.address}
              className={cn(
                'flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium',
                'bg-primary text-primary-foreground hover:bg-primary/90',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Add Token
                </>
              )}
            </button>
          </div>
        </form>

        {/* Helper Text */}
        <p className="mt-4 text-xs text-muted-foreground">
          Enter the contract address and we&apos;ll auto-detect the token details.
          Custom tokens are stored locally and will persist across sessions.
        </p>
      </div>
    </div>
  );
}