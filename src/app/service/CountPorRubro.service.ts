// count-por-rubro.service.ts

import { Injectable } from '@angular/core';
import { ApiAsociadosService } from './api/api.asociados.service';
import { map } from 'rxjs';
import { Asociado } from '../../interfaces/asociados.interface';

@Injectable({
  providedIn: 'root',
})
export class CountPorRubroService {
  constructor(private asociadosService: ApiAsociadosService) {}

  getCountPorRubro() {
    return this.asociadosService.obtenerAsociado().pipe(map((asociados: Asociado[]) => {
      const countPorRubro: Record<string, number> = {};
      const totalAsociados = asociados.length;

      asociados.forEach((asociado) => {
        const rubro = asociado.persons.stands[0]?.rubro?.nameField || 'Sin Rubro';
        countPorRubro[rubro] = (countPorRubro[rubro] || 0) + 1;
      });

      // Calcular porcentaje y normalizar al 100%
      Object.keys(countPorRubro).forEach((rubro) => {
        countPorRubro[rubro] = (countPorRubro[rubro] / totalAsociados) * 100;
      });
       

      return countPorRubro;
    }));
  }
}


