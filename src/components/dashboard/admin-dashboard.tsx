export function AdminDashboard() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <div className="bg-destructive/10 text-destructive rounded-lg border p-8">
                <h2 className="text-xl font-semibold">Admin only</h2>
                <p>Admin</p>
            </div>
        </div>
    );
}
