export interface DataTablesResponse {
	data: any[];
	draw: number;
	recordsFiltered: number;
	recordsTotal: number;
}

export interface DataTables_AjaxCallback {
	(data: { recordsTotal: number; recordsFiltered: number; data: any[] | never[] }): void;
}
