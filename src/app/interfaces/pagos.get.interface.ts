export interface DetailPayments{
    datePayment: string; 
    amount: number;
    person: {
      name: string;
      lastname: string;
      date_birth: Date;
    };
}
