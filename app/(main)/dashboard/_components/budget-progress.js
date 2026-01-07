"use client";

import { useState, useEffect } from "react";
import { Pencil, Check, X } from "lucide-react";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateBudget } from "@/actions/budget";
import { cn } from "@/lib/utils";

export function BudgetProgress({ initialBudget, currentExpenses = 0 }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(
    initialBudget?.amount?.toString() || ""
  );

  const {
    loading: isLoading,
    fn: updateBudgetFn,
    data: updatedBudget,
    error,
  } = useFetch(updateBudget);

  const budgetAmount = initialBudget?.amount || 0;
  const percentUsed = budgetAmount > 0 ? (currentExpenses / budgetAmount) * 100 : 0;
  const remainingBudget = budgetAmount - currentExpenses;

  // Determine progress bar color
  const getProgressColor = () => {
    if (percentUsed >= 90) return "bg-red-500";
    if (percentUsed >= 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  const handleUpdateBudget = async () => {
    const amount = parseFloat(newBudget);

    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    await updateBudgetFn(amount);
  };

  const handleCancel = () => {
    setNewBudget(budgetAmount.toString());
    setIsEditing(false);
  };

  useEffect(() => {
    if (updatedBudget) {
      setIsEditing(false);
      toast.success("Budget updated successfully");
    }
  }, [updatedBudget]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to update budget");
    }
  }, [error]);

  if (!initialBudget) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Monthly Budget (Default Account)
          </CardTitle>
          <CardDescription>No budget set</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="h-3 w-3 mr-2" />
              Set Budget
            </Button>
          </div>
          {isEditing && (
            <div className="mt-4 flex items-center gap-2">
              <Input
                type="number"
                value={newBudget}
                onChange={(e) => setNewBudget(e.target.value)}
                className="flex-1"
                placeholder="Enter budget amount"
                autoFocus
                disabled={isLoading}
                min="0"
                step="0.01"
              />
              <Button
                variant="default"
                size="sm"
                onClick={handleUpdateBudget}
                disabled={isLoading}
              >
                <Check className="h-4 w-4 mr-1" />
                Save
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                disabled={isLoading}
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex-1">
          <CardTitle className="text-sm font-medium">
            Monthly Budget (Default Account)
          </CardTitle>
          <div className="flex items-center gap-2 mt-1">
            {isEditing ? (
              <div className="flex items-center gap-2 w-full">
                <Input
                  type="number"
                  value={newBudget}
                  onChange={(e) => setNewBudget(e.target.value)}
                  className="flex-1"
                  placeholder="Enter amount"
                  autoFocus
                  disabled={isLoading}
                  min="0"
                  step="0.01"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleUpdateBudget}
                  disabled={isLoading}
                >
                  <Check className="h-4 w-4 text-green-500" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ) : (
              <>
                <CardDescription className="text-sm">
                  <span className="font-semibold">${currentExpenses.toFixed(2)}</span>
                  {" spent of "}
                  <span className="font-semibold">${budgetAmount.toFixed(2)}</span>
                </CardDescription>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditing(true)}
                  className="h-6 w-6"
                >
                  <Pencil className="h-3 w-3" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Spent: ${currentExpenses.toFixed(2)}</span>
            <span>Left: ${Math.max(remainingBudget, 0).toFixed(2)}</span>
          </div>

          {/* Custom Progress Bar with proper styling */}
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className={cn(
                "h-full w-full flex-1 transition-all duration-300",
                getProgressColor()
              )}
              style={{ transform: `translateX(-${100 - Math.min(percentUsed, 100)}%)` }}
            />
          </div>

          <div className="flex justify-between">
            <span className="text-xs font-medium">
              {percentUsed.toFixed(1)}% used
            </span>
            <span className="text-xs text-muted-foreground">
              {budgetAmount > 0 ? `${Math.max(100 - percentUsed, 0).toFixed(1)}% remaining` : ""}
            </span>
          </div>
        </div>

        <div className="text-xs">
          {remainingBudget <= 0 ? (
            <p className="text-red-500 font-medium">Budget exceeded by ${Math.abs(remainingBudget).toFixed(2)}</p>
          ) : percentUsed >= 90 ? (
            <p className="text-red-500">Budget almost depleted!</p>
          ) : percentUsed >= 75 ? (
            <p className="text-yellow-500">Budget getting low</p>
          ) : (
            <p className="text-green-500">On track with budget</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}