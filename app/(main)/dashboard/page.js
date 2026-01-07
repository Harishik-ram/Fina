import { Suspense } from "react";
import { getUserAccounts, getDashboardData } from "@/actions/dashboard";
import { getCurrentBudget } from "@/actions/budget";
import { AccountCard } from "./_components/account-card";
import { CreateAccountDrawer } from "@/components/create-account-drawer";
import { BudgetProgress } from "./_components/budget-progress";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { DashboardOverview } from "./_components/transaction-overview";
import { checkUser } from "@/lib/checkUser";

export default async function DashboardPage() {
  await checkUser();

  const [accounts, transactions] = await Promise.all([
    getUserAccounts(),
    getDashboardData(),
  ]);

  const defaultAccount = Array.isArray(accounts)
    ? accounts.find((account) => account.isDefault)
    : null;

  let budgetData = null;
  if (defaultAccount?.id) {
    budgetData = await getCurrentBudget(defaultAccount.id);
  }

  return (
    <div className="space-y-8 px-5">
      <div>
        <h1 className="text-5xl font-bold gradient-title">Dashboard</h1>

        {/* Budget Progress */}
        {defaultAccount && (
          <div className="mt-6">
            <BudgetProgress
              initialBudget={budgetData?.budget || null}
              currentExpenses={budgetData?.currentExpenses || 0}
            />
          </div>
        )}

        {/* Dashboard Overview */}
        <div className="mt-8">
          <DashboardOverview
            accounts={Array.isArray(accounts) ? accounts : []}
            transactions={Array.isArray(transactions) ? transactions : []}
          />
        </div>

        {/* Accounts Grid */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Accounts</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <CreateAccountDrawer>
              <Card className="hover:shadow-md transition-shadow cursor-pointer border-2 border-muted-foreground/40 border-dashed hover:border-primary/30 min-h-[180px]">
                <CardContent className="flex flex-col items-center justify-center text-muted-foreground h-full pt-5">
                  <Plus className="h-10 w-10 mb-2" />
                  <p className="text-sm font-medium">Add New Account</p>
                  <p className="text-xs mt-1 text-center">Click to create a new account</p>
                </CardContent>
              </Card>
            </CreateAccountDrawer>

            {Array.isArray(accounts) && accounts.length > 0 ? (
              accounts.map((account) => (
                <AccountCard key={account.id} account={account} />
              ))
            ) : (
              <p className="text-muted-foreground col-span-2 lg:col-span-2">
                No accounts found. Create your first account!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}