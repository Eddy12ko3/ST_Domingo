export interface DetailPayments {
	datePayment: Date;
	datePayment_string: string;
	amount: number;
	person: {
		name: string;
		lastname: string;
		date_birth: Date;
	};
}
