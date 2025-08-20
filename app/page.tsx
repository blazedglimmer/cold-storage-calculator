"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { ProductRow, ProductData } from "@/components/product-row"
import { Plus, Download, Trash2, Snowflake } from 'lucide-react'
import * as XLSX from 'xlsx'

export default function ColdStorageCalculator() {
  const [products, setProducts] = useState<ProductData[]>([])

  const addNewProduct = () => {
    const newProduct: ProductData = {
      id: Date.now().toString(),
      productName: '',
      weight: 0,
      temperature: 0,
      density: 500,
      category: ''
    }
    setProducts([...products, newProduct])
  }

  const updateProduct = (updatedProduct: ProductData) => {
    setProducts(products.map(product => 
      product.id === updatedProduct.id ? updatedProduct : product
    ))
  }

  const deleteProduct = (id: string) => {
    setProducts(products.filter(product => product.id !== id))
  }

  const clearAllData = () => {
    if (confirm('Are you sure you want to clear all data?')) {
      setProducts([])
    }
  }

  const exportToExcel = () => {
    if (products.length === 0) {
      alert('No data to export!')
      return
    }

    const exportData = products.map(product => {
      if (!product.productName || product.weight <= 0 || !product.category) {
        return {
          'Product Name': product.productName,
          'Weight (kg)': product.weight,
          'Temperature (°C)': product.temperature,
          'Density (kg/m³)': product.density,
          'Category': product.category,
          'Error': 'Incomplete data'
        }
      }

      const { calculateColdStorageValues } = require('@/lib/calculations')
      const calculated = calculateColdStorageValues(
        product.weight,
        product.temperature,
        product.density,
        product.category
      )

      return {
        'Product Name': product.productName,
        'Weight (kg)': product.weight,
        'Temperature (°C)': product.temperature,
        'Density (kg/m³)': product.density,
        'Category': product.category,
        'Shelf Life (Chilled)': calculated.shelfChilled,
        'Shelf Life (Frozen)': calculated.shelfFrozen,
        'Required Humidity (%)': calculated.humidity,
        'Required Moisture (%)': calculated.moisture,
        'Pre-chilling Needed': calculated.preChilling ? 'Yes' : 'No',
        'Dry Condition Needed': calculated.dryCondition ? 'Yes' : 'No',
        'AC Required (TR)': calculated.acRequired,
        'Storage Volume (m³)': calculated.volume,
        'Power Consumption (24hrs) kWh': calculated.power24hrs,
        'Power per Hour (kWh)': calculated.powerPerHour,
        'Units per 24hrs': calculated.units24hrs,
      }
    })

    const ws = XLSX.utils.json_to_sheet(exportData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Cold Storage Data')
    XLSX.writeFile(wb, `cold_storage_calculator_${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
              <Snowflake className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Cold Storage Calculator
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Calculate technical requirements for cold storage facilities// package.json
{