import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ThemeService } from '../../service/controllers/theme.service';
import {
	addDays,
	startOfMonth,
	endOfMonth,
	startOfWeek,
	endOfWeek,
	format,
	isSameMonth,
	addMonths,
	subMonths,
} from 'date-fns';
import { es } from 'date-fns/locale';
import { DataTables_Spanish } from 'src/utils/proyect.utils';
import { DataTablesResponse, DataTables_AjaxCallback } from 'src/utils/DataTable.interface';
import { DataTableDirective } from 'angular-datatables';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from 'src/app/service/controllers/notification.service';
import { Subscription } from 'rxjs';
import { environment } from 'src/environment/environment.prod';

@Component({
	selector: 'app-reportes',
	templateUrl: './reportes.component.html',
	styleUrls: ['./reportes.component.css'],
})
export class ReportesComponent implements OnInit {
	isDarkTheme: boolean = false;
	currentDate = new Date();
	dtOptions = {};
	suscriptionDataTables?: Subscription;
	events = [
		{ title: 'Evento 1', date: '2023-11-10' },
		{ title: 'Evento 2', date: '2023-11-15' },
	];

	constructor(
		private themeService: ThemeService,
		private http: HttpClient,
		private notification: NotificationService,
		private renderer: Renderer2,
	) {}

	@ViewChild(DataTableDirective, { static: false })
	private dataTableElement?: DataTableDirective;
	private reloadDataTable() {
		this.dataTableElement?.dtInstance.then((dtIntance: DataTables.Api) => {
			dtIntance.ajax.reload();
		});
	}
	ngOnInit() {
		this.themeService.isDarkMode$.subscribe((isDarkMode) => {
			this.isDarkTheme = isDarkMode;
		});

		this.dtOptions = {
			serverSide: false,
			/*serverSide: true,*/
			processing: true,
			language: DataTables_Spanish,
			pagingType: 'full_numbers',
			ajax: (dataTablesParameters: any, callback: DataTables_AjaxCallback) => {
				this.suscriptionDataTables = this.http
					.get<DataTablesResponse>(`${environment.API_REST.URL}/reportes/load`)
					.subscribe((resp) => {
						console.log(resp);
						callback({
							recordsTotal: resp.recordsTotal,
							recordsFiltered: resp.recordsFiltered,
							data: resp.data,
						});
					});
			},
			dom: 'Bfrtip',
			buttons: [
				{
					text: 'Recargar',
					action: (e: any, dt: any, node: any, config: any) => {
						this.reloadDataTable();
						this.notification.success('Se sincroniza la tabla con la base de datos.');
					},
				},
				{
					text: 'Visualización',
					extend: 'colvis',
				},
				{
					text: 'PDF',
					extend: 'print',
				},
				{
					text: 'Copiar',
					extend: 'copy',
				},
				{
					text: 'Excel',
					extend: 'excel',
				},
				{
					text: 'CSV',
					extend: 'csv',
				},
			],
			drawCallback: (settings: any) => {
				this.dataTableElement?.dtInstance.then((dtIntance: DataTables.Api) => {
					// filtrado
					dtIntance.columns().every(function () {
						const that = this;
						$('input', this.footer()).on('keyup change', function () {
							if (that.search() !== (this as HTMLInputElement).value) {
								that.search((this as HTMLInputElement).value).draw();
							}
						});
					});
				});
			},
			columns: [
				{
					title: '#',
					render: function (data: any, type: any, full: any, meta: any) {
						return meta.row + 1; // Genera el número correlativo
					},
				},
				{
					title: 'nombre',
					data: 'persons.name',
				},
				{
					title: 'apellidos',
					data: 'persons.lastname',
				},
				{
					title: 'N° de documento',
					data: 'numDocument.numDocument',
				},
				{
					title: 'direccion',
					data: 'persons.addresses[].description',
				},
				{
					title: 'celular',
					data: 'persons.cellPhones[].cellNumber',
				},
				{
					title: 'rubro',
					data: 'persons.stands[].rubro.nameField',
				},
				{
					title: 'ultimos pagos asociados',
					data: 'persons.detailpayment[].datePayment',
				},
				{
					title: 'Acciones',
					data: null,
					render: (data: any, type: any, full: any) => {
						return `
						<div class="table-action"><a class="cursor-pointer dataTablever">ver</a></div>
						`;
					},
					createdCell: (
						cell: Node,
						cellData: any,
						rowData: any,
						rowIndex: number,
						colIndex: number,
					) => {
						$(cell).on('click', 'a.dataTablever', () => {
							// this.verProducto(cellData);
						});
					},
				},
			],
			select: true,
		};
	}
	toggleTheme() {
		this.themeService.toggleDarkMode();
	}
	getMonthGrid() {
		const weeks = [];
		const startMonth = startOfMonth(this.currentDate);
		const endMonth = endOfMonth(this.currentDate);

		let startDate = startOfWeek(startMonth, { weekStartsOn: 0 });

		while (startDate <= endMonth) {
			const week = [];
			for (let i = 0; i < 7; i++) {
				week.push({
					date: format(startDate, 'yyyy-MM-dd', { locale: es }),
					isCurrentMonth: isSameMonth(startDate, startMonth),
					events: this.getEventsForDate(startDate),
				});
				startDate = addDays(startDate, 1);
			}
			weeks.push(week);
		}

		return weeks;
	}
	getEventsForDate(date: Date) {
		return this.events.filter(
			(event) => event.date === format(date, 'yyyy-MM-dd', { locale: es }),
		);
	}

	navigate(months: number) {
		this.currentDate =
			months > 0 ? addMonths(this.currentDate, 1) : subMonths(this.currentDate, 1);
	}

	isToday(date: string): boolean {
		const today = new Date();

		const dateToCompare = new Date(date);

		return (
			dateToCompare.getDate() === today.getDate() - 1 &&
			dateToCompare.getMonth() === today.getMonth() &&
			dateToCompare.getFullYear() === today.getFullYear()
		);
	}
}
