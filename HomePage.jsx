import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Home Page
function HomePage() {
  return (
    <main className="px-6 md:px-20 py-10 animate-fadeIn">
      <h1 className="text-4xl font-bold text-yellow-400 mb-4">Welcome to Siddhivinayak A-Z Saving Mart</h1>
      <p className="text-gray-300 max-w-3xl">
        Your neighborhood's trusted destination in Telia Kalan, Near Barhaj, Deoria, Uttar Pradesh. We offer a wide range of groceries, bakery delights, stationery, crockery, and daily essentials—all under one roof.
      </p>
      <img src="/storefront.png" alt="Storefront" className="mt-6 rounded-lg w-full max-w-xl mx-auto shadow-lg" />
    </main>
  );
}