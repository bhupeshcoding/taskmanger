"use client";

import { useState } from "react";
import { TASK_PRIORITY_LIST, TASK_STATUS_LIST } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface TaskFilterProps {
  filters: {
    status: string;
    priority: string;
    assignedTo: string;
    searchQuery: string;
  };
  onFilterChange: (filters: TaskFilterProps['filters']) => void;
}

export function TaskFilter({ filters, onFilterChange }: TaskFilterProps) {
  // Local state for form inputs
  const [searchQuery, setSearchQuery] = useState(filters.searchQuery);
  
  // Handle filter changes
  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    // Convert "all" value to empty string for filter state
    const filterValue = value === "all" ? "" : value;
    const newFilters = { ...filters, [key]: filterValue };
    onFilterChange(newFilters);
  };
  
  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    handleFilterChange('searchQuery', searchQuery);
  };
  
  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    onFilterChange({
      status: '',
      priority: '',
      assignedTo: '',
      searchQuery: ''
    });
  };
  
  // Check if any filters are active
  const hasActiveFilters = 
    filters.status !== '' || 
    filters.priority !== '' || 
    filters.assignedTo !== '' || 
    filters.searchQuery !== '';

  // Convert empty string values to "all" for Select components
  const displayStatus = filters.status || "all";
  const displayPriority = filters.priority || "all";
  
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search tasks..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit">Search</Button>
          </form>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Select
                value={displayStatus}
                onValueChange={(value) => handleFilterChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {TASK_STATUS_LIST.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Select
                value={displayPriority}
                onValueChange={(value) => handleFilterChange('priority', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  {TASK_PRIORITY_LIST.map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      {priority}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Input
                type="text"
                placeholder="Filter by assignee"
                value={filters.assignedTo}
                onChange={(e) => handleFilterChange('assignedTo', e.target.value)}
              />
            </div>
          </div>
          
          {hasActiveFilters && (
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={resetFilters}>
                <X className="mr-1 h-4 w-4" />
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}