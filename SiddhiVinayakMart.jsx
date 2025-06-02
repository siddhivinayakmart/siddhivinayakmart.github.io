import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, MapPin } from "lucide-react";

export default function SiddhiVinayakMart() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white p-4">
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center py-10"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-yellow-400">
          Siddhi Vinayak Mart
        </h1>
        <p className="text-lg mt-2 text-zinc-300">
          Your Complete A-Z Saving Mart in Telia Kalan, Deoria, Uttar Pradesh
        </p>
      </motion.header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="flex items-center justify-center"
        >
          <img
            src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=800&q=80"
            alt="Mart image"
            className="rounded-2xl shadow-lg w-full max-w-md"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <Card className="bg-zinc-800 border-none shadow-2xl">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-2xl font-semibold text-yellow-300">
                Why Shop With Us?
              </h2>
              <ul className="list-disc list-inside text-zinc-300">
                <li>Complete range of groceries and essentials</li>
                <li>Unbeatable prices & offers</li>
                <li>Friendly local service</li>
                <li>Located conveniently in Telia Kalan, Deoria</li>
              </ul>
              <div className="flex gap-4 pt-4">
                <Button className="bg-yellow-500 hover:bg-yellow-400 text-black">
                  <ShoppingBag className="mr-2" size={16} /> Shop Now
                </Button>
                <Button variant="outline" className="border-yellow-500 text-yellow-500">
                  <MapPin className="mr-2" size={16} /> Find Us
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      <footer className="text-center mt-20 text-zinc-500 text-sm">
        &copy; {new Date().getFullYear()} Siddhi Vinayak Mart. All rights reserved.
      </footer>
    </main>
  );
}
