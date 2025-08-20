'use client';

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Trash2, Plus, Download, RotateCcw } from 'lucide-react';
import { calculateValues } from '@/lib/calculations';
import * as XLSX from 'xlsx';

export interface ProductRow {
  id: string;
  productName: string;
  weight: number;
  temperature: number;
  density: number;
  category: string;
}

const categories = [
  { value: 'fruits', label: 'Fruits' },
  { value: 'vegetables', label: 'Vegetables' },
  { value: 'meat', label: 'Meat' },
  { value: 'fish', label: 'Fish' },
  { value: 'dairy', label: 'Dairy' },
  { value: 'grains', label: 'Grains' },
  { value: 'default', label: 'Other' },
];

export default function ColdStorageCalculator() {
  const [rows, setRows] = useState<ProductRow[]>([
    {
      id: '1',
      productName: '',
      weight: 0,
      temperature: 4,
      density: 500,
      category: 'default',
    },
  ]);

  const addNewRow = useCallback(() => {
    const newRow: ProductRow = {
      id: Date.now().toString(),
      productName: '',
      weight: 0,
      temperature: 4,
      density: 500,
      category: 'default',
    };
    setRows(prev => [...prev, newRow]);
  }, []);

  const deleteRow = useCallback((id: string) => {
    setRows(prev => prev.filter(row => row.id !== id));
  }, []);

  const updateRow = useCallback(
    (id: string, field: keyof ProductRow, value: string | number) => {
      setRows(prev =>
        prev.map(row => (row.id === id ? { ...row, [field]: value } : row))
      );
    },
    []
  );

  const clearAllData = useCallback(() => {
    if (confirm('Are you sure you want to clear all data?')) {
      setRows([
        {
          id: Date.now().toString(),
          productName: '',
          weight: 0,
          temperature: 4,
          density: 500,
          category: 'default',
        },
      ]);
    }
  }, []);

  const exportToExcel = useCallback(() => {
    const exportData = rows.map(row => {
      const calculations = calculateValues(
        row.category,
        row.weight,
        row.temperature,
        row.density
      );
      return {
        'Product Name': row.productName,
        'Weight (kg)': row.weight,
        'Temperature (°C)': row.temperature,
        'Density (kg/m³)': row.density,
        Category: row.category,
        'Shelf Life (Chilled)': calculations.shelfChilled,
        'Shelf Life (Frozen)': calculations.shelfFrozen,
        'Required Humidity (%)': calculations.humidity,
        'Required Moisture (%)': calculations.moisture,
        'Pre-chilling Needed': calculations.preChilling,
        'Dry Condition Needed': calculations.dryCondition,
        'AC Required (Tons)': calculations.acRequired,
        'Storage Volume (m³)': calculations.volume,
        'Electricity (24hrs) kWh': calculations.power24hrs,
        'Units per Hour': calculations.powerPerHour,
        'Units per 24hrs': calculations.units24hrs,
      };
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Cold Storage Data');
    XLSX.writeFile(wb, 'cold_storage_calculator.xlsx');
  }, [rows]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Instructions Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📋 Instructions
          </CardTitle>
          <CardDescription>
            Enter product details to calculate cold storage requirements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              • Enter Product Name, Weight (kg), Temperature (°C), Density
              (kg/m³), and Category
            </li>
            <li>
              • All other values will be calculated automatically based on
              scientific formulas
            </li>
            <li>
              • AC tonnage is calculated using heat load formulas with safety
              factors
            </li>
            <li>
              • Power consumption is calculated using TR × 3.517 / COP formula
            </li>
            <li>{`• Click "Export to Excel" to download your data`}</li>
          </ul>
        </CardContent>
      </Card>

      {/* Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              onClick={exportToExcel}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Download className="h-4 w-4" />
              Export to Excel
            </Button>
            <Button
              onClick={addNewRow}
              variant="outline"
              className="flex items-center gap-2 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Add New Row
            </Button>
            <Button
              onClick={clearAllData}
              variant="destructive"
              className="flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              Clear All Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-semibold">Product Name</th>
                  <th className="text-left p-2 font-semibold">Weight (kg)</th>
                  <th className="text-left p-2 font-semibold">
                    Temperature (°C)
                  </th>
                  <th className="text-left p-2 font-semibold">
                    Density (kg/m³)
                  </th>
                  <th className="text-left p-2 font-semibold">Category</th>
                  <th className="text-left p-2 font-semibold">
                    Shelf Life (Chilled)
                  </th>
                  <th className="text-left p-2 font-semibold">
                    Shelf Life (Frozen)
                  </th>
                  <th className="text-left p-2 font-semibold">Humidity (%)</th>
                  <th className="text-left p-2 font-semibold">Moisture (%)</th>
                  <th className="text-left p-2 font-semibold">Pre-chilling</th>
                  <th className="text-left p-2 font-semibold">Dry Condition</th>
                  <th className="text-left p-2 font-semibold">
                    AC Required (TR)
                  </th>
                  <th className="text-left p-2 font-semibold">Volume (m³)</th>
                  <th className="text-left p-2 font-semibold">
                    Power (24hrs) kWh
                  </th>
                  <th className="text-left p-2 font-semibold">Power/Hour kW</th>
                  <th className="text-left p-2 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(row => {
                  const calculations = calculateValues(
                    row.category,
                    row.weight,
                    row.temperature,
                    row.density
                  );

                  return (
                    <tr key={row.id} className="border-b hover:bg-muted/50">
                      <td className="p-2">
                        <Input
                          value={row.productName}
                          onChange={e =>
                            updateRow(row.id, 'productName', e.target.value)
                          }
                          placeholder="Enter product name"
                          className="min-w-[150px]"
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          type="number"
                          value={row.weight || ''}
                          onChange={e =>
                            updateRow(
                              row.id,
                              'weight',
                              parseFloat(e.target.value) || 0
                            )
                          }
                          placeholder="Weight"
                          min="0"
                          step="0.1"
                          className="min-w-[100px]"
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          type="number"
                          value={row.temperature || ''}
                          onChange={e =>
                            updateRow(
                              row.id,
                              'temperature',
                              parseFloat(e.target.value) || 0
                            )
                          }
                          placeholder="Temperature"
                          step="0.1"
                          className="min-w-[120px]"
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          type="number"
                          value={row.density || ''}
                          onChange={e =>
                            updateRow(
                              row.id,
                              'density',
                              parseFloat(e.target.value) || 0
                            )
                          }
                          placeholder="Density"
                          min="0"
                          step="1"
                          className="min-w-[120px]"
                        />
                      </td>
                      <td className="p-2">
                        <Select
                          value={row.category}
                          onValueChange={value =>
                            updateRow(row.id, 'category', value)
                          }
                        >
                          <SelectTrigger className="min-w-[120px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map(category => (
                              <SelectItem
                                key={category.value}
                                value={category.value}
                              >
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-2 text-sm bg-muted/30">
                        {calculations.shelfChilled}
                      </td>
                      <td className="p-2 text-sm bg-muted/30">
                        {calculations.shelfFrozen}
                      </td>
                      <td className="p-2 text-sm bg-muted/30">
                        {calculations.humidity}%
                      </td>
                      <td className="p-2 text-sm bg-muted/30">
                        {calculations.moisture}%
                      </td>
                      <td className="p-2 text-sm bg-muted/30">
                        {calculations.preChilling}
                      </td>
                      <td className="p-2 text-sm bg-muted/30">
                        {calculations.dryCondition}
                      </td>
                      <td className="p-2 text-sm bg-green-50 dark:bg-green-950 font-semibold">
                        {calculations.acRequired}
                      </td>
                      <td className="p-2 text-sm bg-blue-50 dark:bg-blue-950 font-semibold">
                        {calculations.volume}
                      </td>
                      <td className="p-2 text-sm bg-orange-50 dark:bg-orange-950 font-semibold">
                        {calculations.power24hrs}
                      </td>
                      <td className="p-2 text-sm bg-purple-50 dark:bg-purple-950 font-semibold">
                        {calculations.powerPerHour}
                      </td>
                      <td className="p-2">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteRow(row.id)}
                          disabled={rows.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
