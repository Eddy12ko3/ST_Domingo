import { Component, OnInit } from '@angular/core';
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

@Component({
    selector: 'app-reportes',
    templateUrl: './reportes.component.html',
    styleUrls: ['./reportes.component.css'],
})
export class ReportesComponent implements OnInit {
    isDarkTheme: boolean = false;
    currentDate = new Date();

    events = [
        { title: 'Evento 1', date: '2023-11-10' },
        { title: 'Evento 2', date: '2023-11-15' },
    ];

    constructor(private themeService: ThemeService) {}
    ngOnInit() {
        this.themeService.isDarkMode$.subscribe(isDarkMode => {
            this.isDarkTheme = isDarkMode;
        });
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
            event => event.date === format(date, 'yyyy-MM-dd', { locale: es })
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
