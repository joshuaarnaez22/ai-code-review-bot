import { UserButton } from "@clerk/nextjs"

export default function DashboardPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="text-muted-foreground">You are signed in.</p>
      <UserButton />
    </main>
  )
}
