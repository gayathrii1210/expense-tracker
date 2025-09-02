import React, { useState } from "react";

function ExpenseTracker() {
  const [income, setIncome] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  // Calculate totals
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const remainingBalance = income ? income - totalExpenses : 0;

  // Add new expense with overspending check
  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!amount || !category) return;

    const newAmount = parseFloat(amount);

    if (income && totalExpenses + newAmount > income) {
      alert("Warning: You cannot spend more than your income!");
      return;
    }

    const newExpense = {
      id: Date.now(),
      amount: newAmount,
      category,
      description,
      date: new Date().toLocaleString(),
    };

    setExpenses([...expenses, newExpense]);
    setAmount("");
    setCategory("");
    setDescription("");
  };

  // Generate simple insights
  const generateInsights = () => {
    if (expenses.length === 0) return ["No insights yet."];
    const categoryTotals = {};
    expenses.forEach((exp) => {
      if (!categoryTotals[exp.category]) categoryTotals[exp.category] = 0;
      categoryTotals[exp.category] += exp.amount;
    });
    const highestCategory = Object.keys(categoryTotals).reduce((a, b) =>
      categoryTotals[a] > categoryTotals[b] ? a : b
    );
    return [
      `Highest spending category: ${highestCategory} (₹${categoryTotals[highestCategory].toFixed(
        2
      )})`,
      `Total spent: ₹${totalExpenses.toFixed(2)}`,
      `Remaining balance: ₹${remainingBalance.toFixed(2)}`
    ];
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white shadow-md rounded-md">
      {/* Header */}
      <h1 className="text-3xl font-bold text-center text-blue-500 mb-6">
        AI Expense Tracker
      </h1>

      {/* Income Input */}
      <div className="mb-4">
        <input
          type="number"
          placeholder="Enter your income"
          value={income}
          onChange={(e) => setIncome(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      {/* Add Expense Form */}
      <form className="mb-6" onSubmit={handleAddExpense}>
        <div className="flex flex-col sm:flex-row gap-2 mb-2">
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border p-2 rounded w-full sm:w-1/3"
          />
          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border p-2 rounded w-full sm:w-1/3"
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 rounded w-full sm:w-1/3"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Expense
        </button>
      </form>

      {/* Expense List */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Expenses</h2>
        {expenses.length === 0 ? (
          <p className="text-gray-500">No expenses added yet.</p>
        ) : (
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-1">Amount</th>
                <th className="border px-2 py-1">Category</th>
                <th className="border px-2 py-1">Description</th>
                <th className="border px-2 py-1">Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp) => (
                <tr key={exp.id}>
                  <td className="border px-2 py-1">{exp.amount}</td>
                  <td className="border px-2 py-1">{exp.category}</td>
                  <td className="border px-2 py-1">{exp.description}</td>
                  <td className="border px-2 py-1">{exp.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Total Expense & Remaining Balance */}
      <div className="text-right font-bold text-lg mb-4">
        <p>Total Spent: ₹{totalExpenses.toFixed(2)}</p>
        <p>Remaining Balance: ₹{remainingBalance.toFixed(2)}</p>
      </div>

      {/* AI Insights */}
      <div className="mt-4 p-3 bg-yellow-100 rounded">
        <h2 className="font-semibold mb-1">AI Insights:</h2>
        <ul className="list-disc list-inside">
          {generateInsights().map((insight, index) => (
            <li key={index}>{insight}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ExpenseTracker;
