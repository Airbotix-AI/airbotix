/**
 * Students List Component
 * Comprehensive student management with search, filter, and CRUD operations
 */

import React, { useState, useMemo } from 'react';
import { Search, Plus, Download, Trash2, Edit, MoreHorizontal, Filter } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Select } from '../../ui/Select';
import { Badge } from '../../ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/Table';
import { Card } from '../../ui/Card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../ui/Dialog';
import { useStudentsList } from '../../../hooks/useStudents';
import type { Student, StudentSearchFilters } from '../../../types/student.types';
import {
  STUDENT_STATUS,
  STUDENT_SKILL_LEVELS,
  STUDENT_GRADES,
  STUDENT_UI_TEXT,
  STUDENT_TABLE_COLUMNS,
  PAGINATION_LIMITS
} from '../../../constants/student.constants';

// ============================================================================
// COMPONENT INTERFACES
// ============================================================================

export interface StudentsListProps {
  initialFilters?: StudentSearchFilters;
  onStudentSelect?: (student: Student) => void;
  showActions?: boolean;
  maxHeight?: string;
}

interface FilterState {
  search: string;
  status: string;
  skillLevel: string;
  grade: string;
}

// ============================================================================
// STUDENTS LIST COMPONENT
// ============================================================================

export function StudentsList({
  initialFilters = {},
  onStudentSelect,
  showActions = true,
  maxHeight = '600px'
}: StudentsListProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: '',
    skillLevel: '',
    grade: ''
  });
  
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [sortField, setSortField] = useState<string>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Use the students list hook
  const {
    students,
    loading,
    error,
    total,
    page,
    limit,
    refetch,
    createStudent,
    updateStudent,
    deleteStudent,
    setPage,
    setLimit,
    setFilters: setHookFilters,
    setSearch
  } = useStudentsList({
    page: 1,
    limit: PAGINATION_LIMITS.MEDIUM,
    filters: initialFilters
  });

  // Apply filters to hook
  React.useEffect(() => {
    const searchFilters: StudentSearchFilters = {
      name: filters.search || undefined,
      status: filters.status || undefined,
      skillLevel: filters.skillLevel || undefined,
      grade: filters.grade || undefined
    };
    
    setHookFilters(searchFilters);
    if (filters.search) {
      setSearch(filters.search);
    }
  }, [filters, setHookFilters, setSearch]);

  // Handle search input
  const handleSearchChange = (value: string) => {
    setFilters(prev => ({ ...prev, search: value }));
  };

  // Handle filter changes
  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      search: '',
      status: '',
      skillLevel: '',
      grade: ''
    });
  };

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Handle student selection
  const handleStudentSelect = (student: Student) => {
    onStudentSelect?.(student);
  };

  // Handle bulk selection
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStudents(students.map(s => s.id));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleSelectStudent = (studentId: string, checked: boolean) => {
    if (checked) {
      setSelectedStudents(prev => [...prev, studentId]);
    } else {
      setSelectedStudents(prev => prev.filter(id => id !== studentId));
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedStudents.length === 0) return;
    
    try {
      for (const studentId of selectedStudents) {
        await deleteStudent(studentId);
      }
      setSelectedStudents([]);
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting students:', error);
    }
  };

  // Handle export
  const handleExport = async () => {
    try {
      // TODO: Implement export functionality
      console.log('Export students');
    } catch (error) {
      console.error('Error exporting students:', error);
    }
  };

  // Calculate student age
  const calculateAge = (dateOfBirth: string): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  // Get status badge variant
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case STUDENT_STATUS.ACTIVE:
        return 'success';
      case STUDENT_STATUS.INACTIVE:
        return 'secondary';
      case STUDENT_STATUS.GRADUATED:
        return 'default';
      case STUDENT_STATUS.SUSPENDED:
        return 'destructive';
      default:
        return 'outline';
    }
  };

  // Get skill level badge variant
  const getSkillLevelBadgeVariant = (skillLevel: string) => {
    switch (skillLevel) {
      case STUDENT_SKILL_LEVELS.BEGINNER:
        return 'secondary';
      case STUDENT_SKILL_LEVELS.INTERMEDIATE:
        return 'warning';
      case STUDENT_SKILL_LEVELS.ADVANCED:
        return 'success';
      case STUDENT_SKILL_LEVELS.EXPERT:
        return 'default';
      default:
        return 'outline';
    }
  };

  // Pagination info
  const totalPages = Math.ceil(total / limit);
  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{STUDENT_UI_TEXT.STUDENT_LIST}</h2>
          <p className="text-muted-foreground">
            {total} {total === 1 ? 'student' : 'students'} total
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExport} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            {STUDENT_UI_TEXT.EXPORT_DATA}
          </Button>
          <Button onClick={() => console.log('Add student')} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            {STUDENT_UI_TEXT.ADD_NEW_STUDENT}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={STUDENT_UI_TEXT.SEARCH_PLACEHOLDER}
                value={filters.search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Status Filter */}
          <Select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            placeholder="All Status"
          >
            <option value="">All Status</option>
            {Object.entries(STUDENT_STATUS).map(([key, value]) => (
              <option key={key} value={value}>
                {value.charAt(0).toUpperCase() + value.slice(1)}
              </option>
            ))}
          </Select>

          {/* Skill Level Filter */}
          <Select
            value={filters.skillLevel}
            onChange={(e) => handleFilterChange('skillLevel', e.target.value)}
            placeholder="All Levels"
          >
            <option value="">All Levels</option>
            {Object.entries(STUDENT_SKILL_LEVELS).map(([key, value]) => (
              <option key={key} value={value}>
                {value.charAt(0).toUpperCase() + value.slice(1)}
              </option>
            ))}
          </Select>

          {/* Grade Filter */}
          <Select
            value={filters.grade}
            onChange={(e) => handleFilterChange('grade', e.target.value)}
            placeholder="All Grades"
          >
            <option value="">All Grades</option>
            {Object.entries(STUDENT_GRADES).map(([key, value]) => (
              <option key={key} value={value}>
                Grade {value}
              </option>
            ))}
          </Select>

          {/* Clear Filters */}
          <Button
            variant="outline"
            onClick={clearFilters}
            className="whitespace-nowrap"
          >
            <Filter className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>
      </Card>

      {/* Bulk Actions */}
      {selectedStudents.length > 0 && (
        <Card className="p-4 bg-muted/50">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {selectedStudents.length} student{selectedStudents.length === 1 ? '' : 's'} selected
            </span>
            <div className="flex gap-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Table */}
      <Card>
        <div style={{ maxHeight }} className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {showActions && (
                  <TableHead className="w-12">
                    <input
                      type="checkbox"
                      checked={selectedStudents.length === students.length && students.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                  </TableHead>
                )}
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('name')}
                >
                  Name {sortField === 'name' && (sortDirection === 'asc' ? '^' : 'v')}
                </TableHead>
                <TableHead>Age/Grade</TableHead>
                <TableHead>School</TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('skillLevel')}
                >
                  Skill Level {sortField === 'skillLevel' && (sortDirection === 'asc' ? '^' : 'v')}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('status')}
                >
                  Status {sortField === 'status' && (sortDirection === 'asc' ? '^' : 'v')}
                </TableHead>
                <TableHead>Workshops</TableHead>
                {showActions && <TableHead className="w-12">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={showActions ? 8 : 7} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      <span className="ml-2">{STUDENT_UI_TEXT.LOADING}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={showActions ? 8 : 7} className="text-center py-8 text-destructive">
                    {error}
                  </TableCell>
                </TableRow>
              ) : students.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={showActions ? 8 : 7} className="text-center py-8 text-muted-foreground">
                    {STUDENT_UI_TEXT.NO_DATA}
                  </TableCell>
                </TableRow>
              ) : (
                students.map((student) => (
                  <TableRow 
                    key={student.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleStudentSelect(student)}
                  >
                    {showActions && (
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(student.id)}
                          onChange={(e) => handleSelectStudent(student.id, e.target.checked)}
                          className="rounded border-gray-300"
                        />
                      </TableCell>
                    )}
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{calculateAge(student.dateOfBirth)} years</div>
                        <div className="text-muted-foreground">Grade {student.grade}</div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">{student.school}</TableCell>
                    <TableCell>
                      <Badge variant={getSkillLevelBadgeVariant(student.skillLevel)}>
                        {student.skillLevel.charAt(0).toUpperCase() + student.skillLevel.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(student.status)}>
                        {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {student.enrolledCourses.length} enrolled
                      </span>
                    </TableCell>
                    {showActions && (
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => console.log('Edit student', student.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => console.log('More actions', student.id)}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              Showing {startItem}-{endItem} of {total} students
            </div>
            <div className="flex items-center gap-2">
              <Select
                value={limit.toString()}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="w-20"
              >
                {Object.values(PAGINATION_LIMITS).map((limitValue) => (
                  <option key={limitValue} value={limitValue}>
                    {limitValue}
                  </option>
                ))}
              </Select>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page - 1)}
                  disabled={page <= 1}
                >
                  Previous
                </Button>
                <span className="px-3 py-2 text-sm">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={page >= totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Students</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedStudents.length} selected student{selectedStudents.length === 1 ? '' : 's'}? 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleBulkDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
