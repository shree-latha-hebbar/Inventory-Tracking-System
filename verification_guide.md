# Real-Time Verification Guide

Follow these steps to launch the system and verify the live integration between the backend and frontend.

## 1. Start the Backend Server
Open a new terminal at `d:\Inventory Tracking System\Inventory-Tracking-System\backend` and run:
```powershell
./venv/Scripts/python.exe app.py
```
> [!NOTE]
> Ensure the output says `Running on http://127.0.0.1:5000`.

## 2. Start the Frontend Server
Open a second terminal at `d:\Inventory Tracking System\Inventory-Tracking-System\frontend` and run:
```powershell
npm run dev
```
> [!NOTE]
> Note the URL provided (e.g., `http://localhost:5173`).

## 3. Perform a Live Test Workflow

### A. Authentication
1. Open the frontend URL in your browser.
2. Click on the **Admin** preset (it should auto-fill `admin / admin123`).
3. Click **Sign In**.

### B. Dashboard Verification
1. Once logged in, you should see the **Sapphire Dashboard**.
2. **Total Assets**: Should show **14** (calculated from the seeded products).
3. **Active Purchase Orders**: Scroll down to the table. You should see `PO-8041`, `PO-8040`, and `PO-8039` fetched directly from the database.

### C. Product Management
1. Click on **Manage Inventory** (or **Products**) in the sidebar/header.
2. Verify that the table matches the seeded items (e.g., *Corporate Workstation*, *MacBook Pro M3 Max*).
3. Try **Adding** or **Deleting** a product to see the database update in real time.

---

If any of these steps fail or you see "Red" error messages, please share the terminal output with me!
