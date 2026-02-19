export interface RecurringExpense {
    id: string;
    name: string;
    description: string;
    amount: number;
    currency: string;    
    categoryName: string;
    categoryId: number;
    frequency: string;
    nextPaymentDate: string;
}