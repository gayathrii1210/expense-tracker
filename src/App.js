import React, { useState, useEffect } from "react";

function App() {
  // load from localStorage or default
  const [incomes, setIncomes] = useState(() => {
    return JSON.parse(localStorage.getItem("incomes")) || [];
  });
  const [expenses, setExpenses] = useState(() => {
    return JSON.parse(localStorage.getItem("expenses")) || [];
  });

  // income form fields
  const [incDesc, setIncDesc] = useState("");
  const [incAmount, setIncAmount] = useState("");

  // expense form fields
  const [expDesc, setExpDesc] = useState("");
  const [expAmount, setExpAmount] = useState("");

  // persist to localStorage whenever changed
  useEffect(() => {
    localStorage.setItem("incomes", JSON.stringify(incomes));
  }, [incomes]);

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  // totals
  const totalIncome = incomes.reduce((sum, it) => sum + it.amount, 0);
  const totalExpenses = expenses.reduce((sum, it) => sum + it.amount, 0);
  const remaining = totalIncome - totalExpenses;

  // Add income (same pattern as expense)
  const addIncome = (e) => {
    e?.preventDefault();
    if (incDesc.trim() === "" || incAmount === "" || Number(incAmount) <= 0) {
      alert("Please enter valid income description and positive amount.");
      return;
    }
    const newIncome = {
      id: Date.now(),
      description: incDesc.trim(),
      amount: parseFloat(incAmount),
      date: new Date().toLocaleString(),
    };
    setIncomes((prev) => [...prev, newIncome]);
    setIncDesc("");
    setIncAmount("");
  };

  // Add expense
  const addExpense = (e) => {
    e?.preventDefault();
    if (expDesc.trim() === "" || expAmount === "" || Number(expAmount) <= 0) {
      alert("Please enter valid expense description and positive amount.");
      return;
    }
    const amountNum = parseFloat(expAmount);

    // prevent overspending: block if this expense would make remaining negative
    if (totalExpenses + amountNum > totalIncome) {
      alert("Warning: This expense would exceed your total income. Please adjust income or amount.");
      return;
    }

    const newExpense = {
      id: Date.now(),
      description: expDesc.trim(),
      amount: amountNum,
      date: new Date().toLocaleString(),
    };
    setExpenses((prev) => [...prev, newExpense]);
    setExpDesc("");
    setExpAmount("");
  };

  // delete with confirmation
  const deleteIncome = (id) => {
    const ok = window.confirm("Delete this income entry? This cannot be undone.");
    if (!ok) return;
    setIncomes((prev) => prev.filter((it) => it.id !== id));
  };

  const deleteExpense = (id) => {
    const ok = window.confirm("Delete this expense entry? This cannot be undone.");
    if (!ok) return;
    setExpenses((prev) => prev.filter((it) => it.id !== id));
  };

  // clear all (optional helper) - ask before clearing
  const clearAll = () => {
    const ok = window.confirm("Clear ALL incomes and expenses? This will delete all data.");
    if (!ok) return;
    setIncomes([]);
    setExpenses([]);
    localStorage.removeItem("incomes");
    localStorage.removeItem("expenses");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">💰 Expense Tracker</h1>
          <button
            onClick={clearAll}
            className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Clear All
          </button>
        </header>

        {/* Inputs row: Income on left, Expense on right */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Income card */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold mb-2">Add Income</h2>
            <form onSubmit={addIncome} className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Income description"
                value={incDesc}
                onChange={(e) => setIncDesc(e.target.value)}
                className="border p-2 rounded w-full"
              />
              <input
                type="number"
                placeholder="Amount"
                value={incAmount}
                onChange={(e) => setIncAmount(e.target.value)}
                className="border p-2 rounded w-40"
              />
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Add Income
              </button>
            </form>
            <p className="text-sm text-gray-500 mt-2">Your incomes help compute remaining balance.</p>
          </div>

          {/* Expense card */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold mb-2">Add Expense</h2>
            <form onSubmit={addExpense} className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Expense description"
                value={expDesc}
                onChange={(e) => setExpDesc(e.target.value)}
                className="border p-2 rounded w-full"
              />
              <input
                type="number"
                placeholder="Amount"
                value={expAmount}
                onChange={(e) => setExpAmount(e.target.value)}
                className="border p-2 rounded w-40"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Add Expense
              </button>
            </form>
            <p className="text-sm text-gray-500 mt-2">Adding expenses that exceed total income is blocked.</p>
          </div>
        </div>

        {/* Summary */}
        <div className="flex gap-4 mb-6">
          <div className="bg-white p-4 rounded shadow w-1/3">
            <div className="text-sm text-gray-500">Total Income</div>
            <div className="text-xl font-bold">₹{totalIncome.toFixed(2)}</div>
          </div>
          <div className="bg-white p-4 rounded shadow w-1/3">
            <div className="text-sm text-gray-500">Total Spent</div>
            <div className="text-xl font-bold">₹{totalExpenses.toFixed(2)}</div>
          </div>
          <div className={`p-4 rounded shadow w-1/3 ${remaining < 0 ? "bg-red-100" : "bg-green-50"}`}>
            <div className="text-sm text-gray-500">Remaining</div>
            <div className="text-xl font-bold">₹{remaining.toFixed(2)}</div>
            {remaining < 0 && <div className="text-red-600 text-sm mt-1">You are overspending!</div>}
          </div>
        </div>

        {/* Tables: Incomes and Expenses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Income table */}
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-3">Incomes</h3>
            {incomes.length === 0 ? (
              <p className="text-gray-500">No incomes added yet.</p>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="text-sm text-gray-600">
                    <th className="pb-2">Description</th>
                    <th className="pb-2">Amount</th>
                    <th className="pb-2">Date</th>
                    <th className="pb-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {incomes.map((it) => (
                    <tr key={it.id} className="border-t">
                      <td className="py-2">{it.description}</td>
                      <td className="py-2">₹{it.amount.toFixed(2)}</td>
                      <td className="py-2">{it.date}</td>
                      <td className="py-2">
                        <button
                          onClick={() => deleteIncome(it.id)}
                          className="text-sm bg-red-500 text-white px-2 py-1 rounded"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Expense table */}
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-3">Expenses</h3>
            {expenses.length === 0 ? (
              <p className="text-gray-500">No expenses added yet.</p>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="text-sm text-gray-600">
                    <th className="pb-2">Description</th>
                    <th className="pb-2">Amount</th>
                    <th className="pb-2">Date</th>
                    <th className="pb-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((it) => (
                    <tr key={it.id} className="border-t">
                      <td className="py-2">{it.description}</td>
                      <td className="py-2">₹{it.amount.toFixed(2)}</td>
                      <td className="py-2">{it.date}</td>
                      <td className="py-2">
                        <button
                          onClick={() => deleteExpense(it.id)}
                          className="text-sm bg-red-500 text-white px-2 py-1 rounded"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* AI Insights placeholder (you can later make dynamic) */}
        <div className="bg-blue-50 p-4 rounded shadow">
          <h3 className="font-semibold mb-2">AI Insights</h3>
          <p className="text-sm text-gray-700">
            Example insight: "Most of your expenses are on Food." (We will replace this with dynamic analysis next.)
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
