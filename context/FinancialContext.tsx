'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Project, Budget, Currency, Expense, ProjectStaff, DEFAULT_CURRENCIES } from '@/types';

interface FinancialContextType {
  // Projects
  projects: Project[];
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  
  // Budgets
  budgets: Budget[];
  addBudget: (budget: Omit<Budget, 'id' | 'createdAt'>) => void;
  updateBudget: (id: string, budget: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;
  getBudgetByProject: (projectId: string) => Budget[];
  getTotalBudgetByProject: (projectId: string) => number;
  
  // Currencies
  currencies: Currency[];
  addCurrency: (currency: Omit<Currency, 'id'>) => void;
  updateCurrency: (id: string, currency: Partial<Currency>) => void;
  deleteCurrency: (id: string) => void;
  getCurrency: (id: string) => Currency | undefined;
  getDefaultCurrency: () => Currency | undefined;
  
  // Expenses
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt' | 'isLocked'>) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  getExpensesByProject: (projectId: string) => Expense[];
  getTotalExpensesByProject: (projectId: string) => number;
  getTotalExpenses: () => number;
  getRemainingBudgetByProject: (projectId: string) => number;
  
  // Dashboard calculations
  getTotalRemainingBudget: () => number;
  getTotalContingencyBudget: () => number;
  
  // Project Staff
  projectStaff: ProjectStaff[];
  addProjectStaff: (staff: Omit<ProjectStaff, 'id' | 'createdAt'>) => void;
  updateProjectStaff: (id: string, staff: Partial<ProjectStaff>) => void;
  deleteProjectStaff: (id: string) => void;
  getProjectStaffByProject: (projectId: string) => ProjectStaff[];
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

export function FinancialProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>(DEFAULT_CURRENCIES);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [projectStaff, setProjectStaff] = useState<ProjectStaff[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedProjects = localStorage.getItem('financial-projects');
    const savedBudgets = localStorage.getItem('financial-budgets');
    const savedCurrencies = localStorage.getItem('financial-currencies');
    const savedExpenses = localStorage.getItem('financial-expenses');
    const savedProjectStaff = localStorage.getItem('financial-project-staff');
    
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
    if (savedBudgets) {
      setBudgets(JSON.parse(savedBudgets));
    }
    if (savedCurrencies) {
      setCurrencies(JSON.parse(savedCurrencies));
    }
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    }
    if (savedProjectStaff) {
      setProjectStaff(JSON.parse(savedProjectStaff));
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('financial-projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('financial-budgets', JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem('financial-currencies', JSON.stringify(currencies));
  }, [currencies]);

  useEffect(() => {
    localStorage.setItem('financial-expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('financial-project-staff', JSON.stringify(projectStaff));
  }, [projectStaff]);

  // Project functions
  const addProject = (project: Omit<Project, 'id' | 'createdAt'>) => {
    const newProject: Project = {
      ...project,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setProjects((prev) => [...prev, newProject]);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    // Also delete associated budgets, expenses, and staff
    setBudgets((prev) => prev.filter((b) => b.projectId !== id));
    setExpenses((prev) => prev.filter((e) => e.projectId !== id));
    setProjectStaff((prev) => prev.filter((s) => s.projectId !== id));
  };

  // Budget functions
  const addBudget = (budget: Omit<Budget, 'id' | 'createdAt'>) => {
    const newBudget: Budget = {
      ...budget,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setBudgets((prev) => [...prev, newBudget]);
  };

  const updateBudget = (id: string, updates: Partial<Budget>) => {
    setBudgets((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
    );
  };

  const deleteBudget = (id: string) => {
    setBudgets((prev) => prev.filter((b) => b.id !== id));
  };

  const getBudgetByProject = (projectId: string) => {
    return budgets.filter((b) => b.projectId === projectId);
  };

  const getTotalBudgetByProject = (projectId: string) => {
    return budgets
      .filter((b) => b.projectId === projectId)
      .reduce((sum, b) => sum + b.amount, 0);
  };

  // Currency functions
  const addCurrency = (currency: Omit<Currency, 'id'>) => {
    const newCurrency: Currency = {
      ...currency,
      id: Date.now().toString(),
    };
    setCurrencies((prev) => [...prev, newCurrency]);
  };

  const updateCurrency = (id: string, updates: Partial<Currency>) => {
    setCurrencies((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const deleteCurrency = (id: string) => {
    // Don't allow deletion of default currencies
    const currency = currencies.find((c) => c.id === id);
    if (currency?.isDefault) {
      return;
    }
    setCurrencies((prev) => prev.filter((c) => c.id !== id));
  };

  const getCurrency = (id: string) => {
    return currencies.find((c) => c.id === id);
  };

  const getDefaultCurrency = () => {
    return currencies.find((c) => c.isDefault) || currencies[0];
  };

  // Expense functions
  const addExpense = (expense: Omit<Expense, 'id' | 'createdAt' | 'isLocked'>) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      isLocked: true, // Expenses are locked immediately after creation
    };
    setExpenses((prev) => [...prev, newExpense]);
  };

  const updateExpense = (id: string, updates: Partial<Expense>) => {
    const expense = expenses.find((e) => e.id === id);
    if (expense?.isLocked) {
      // Only allow status updates for locked expenses
      if (updates.status !== undefined || updates.approvedBy !== undefined || updates.authorizedBy !== undefined) {
        setExpenses((prev) =>
          prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
        );
      }
      return;
    }
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
  };

  const deleteExpense = (id: string) => {
    const expense = expenses.find((e) => e.id === id);
    if (expense?.isLocked) {
      return; // Cannot delete locked expenses
    }
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const getExpensesByProject = (projectId: string) => {
    return expenses.filter((e) => e.projectId === projectId);
  };

  const getTotalExpensesByProject = (projectId: string) => {
    return expenses
      .filter((e) => e.projectId === projectId)
      .reduce((sum, e) => sum + e.amount, 0);
  };

  const getTotalExpenses = () => {
    return expenses.reduce((sum, e) => sum + e.amount, 0);
  };

  const getRemainingBudgetByProject = (projectId: string) => {
    const totalBudget = getTotalBudgetByProject(projectId);
    const totalExpenses = getTotalExpensesByProject(projectId);
    return totalBudget - totalExpenses;
  };

  // Dashboard calculations
  const getTotalRemainingBudget = () => {
    const allProjects = projects.map((p) => p.id);
    return allProjects.reduce((sum, projectId) => {
      return sum + getRemainingBudgetByProject(projectId);
    }, 0);
  };

  const getTotalContingencyBudget = () => {
    // Contingency budget is the sum of all remaining budgets per project
    return getTotalRemainingBudget();
  };

  // Project Staff functions
  const addProjectStaff = (staff: Omit<ProjectStaff, 'id' | 'createdAt'>) => {
    const newStaff: ProjectStaff = {
      ...staff,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setProjectStaff((prev) => [...prev, newStaff]);
  };

  const updateProjectStaff = (id: string, updates: Partial<ProjectStaff>) => {
    setProjectStaff((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  };

  const deleteProjectStaff = (id: string) => {
    setProjectStaff((prev) => prev.filter((s) => s.id !== id));
  };

  const getProjectStaffByProject = (projectId: string) => {
    return projectStaff.filter((s) => s.projectId === projectId);
  };

  return (
    <FinancialContext.Provider
      value={{
        projects,
        addProject,
        updateProject,
        deleteProject,
        budgets,
        addBudget,
        updateBudget,
        deleteBudget,
        getBudgetByProject,
        getTotalBudgetByProject,
        currencies,
        addCurrency,
        updateCurrency,
        deleteCurrency,
        getCurrency,
        getDefaultCurrency,
        expenses,
        addExpense,
        updateExpense,
        deleteExpense,
        getExpensesByProject,
        getTotalExpensesByProject,
        getTotalExpenses,
        getRemainingBudgetByProject,
        getTotalRemainingBudget,
        getTotalContingencyBudget,
        projectStaff,
        addProjectStaff,
        updateProjectStaff,
        deleteProjectStaff,
        getProjectStaffByProject,
      }}
    >
      {children}
    </FinancialContext.Provider>
  );
}

export function useFinancial() {
  const context = useContext(FinancialContext);
  if (context === undefined) {
    throw new Error('useFinancial must be used within a FinancialProvider');
  }
  return context;
}

