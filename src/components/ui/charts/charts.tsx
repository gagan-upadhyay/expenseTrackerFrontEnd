import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export function ExpenseChart() {
  return (
    <div className="p-6 bg-card rounded-xl border shadow-sm">
      <h2 className="text-xl font-bold mb-4">Monthly Spent</h2>
      <ChartContainer config={chartConfig} className=" w-full">
        <BarChart data={chartData}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis dataKey="category" tickLine={false} axisLine={false} />
          <YAxis hide />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="amount" radius={8} />
        </BarChart>
      </ChartContainer>
    </div>
  )
}




const chartData = [
  { category: "Food", amount: 450, fill: "var(--color-food)" },
  { category: "Rent", amount: 1200, fill: "var(--color-rent)" },
  { category: "Utilities", amount: 300, fill: "var(--color-utilities)" },
  { category: "Entertainment", amount: 200, fill: "var(--color-entertainment)" },
]

const chartConfig = {
  amount: { label: "Amount ($)" },
  food: { label: "Food", color: "hsl(var(--chart-1))" },
  rent: { label: "Rent", color: "hsl(var(--chart-2))" },
  utilities: { label: "Utilities", color: "hsl(var(--chart-3))" },
  entertainment: { label: "Entertainment", color: "hsl(var(--chart-4))" },
}
