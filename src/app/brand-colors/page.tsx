"use client";

import { AllBrandColors } from "@/components/branding/AllBrandColors";

/**
 * Brand Colors Demo Page
 *
 * This page demonstrates the complete theme system
 * and shows all CSS variables with their actual values
 */
export default function BrandColorsPage() {
  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="text-center mb-12">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-foreground mb-6">
            Smart Color System
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-4xl mx-auto">
            A dynamic showcase that automatically reads your CSS variables. Add
            or remove colors in{" "}
            <code className="bg-background px-1 rounded">globals.css</code> and
            watch them appear here!
          </p>
        </div>
      </div>

      {/* All Brand Colors Component */}
      <AllBrandColors />
    </main>
  );
}
