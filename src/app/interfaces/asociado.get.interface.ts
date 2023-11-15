export interface Associates {
    folio: number;
    numDocument: {
      numDocId: number;
      numDocument: number;
      tipoDocumento: {
        tipoDocId: number;
        description: string;
      };
    };
    persons: {
      personId: number;
      name: string;
      lastname: string;
      date_birth: Date;
      state: boolean;
      created_at: string;
      updated_at: string;
      addresses: Array<{ addressId: number; description: string }>;
      cellPhones: Array<{
        cellPhoneid: number;
        cellNumber: number;
        operators: { operatorId: number; name: string };
      }>;
      gender: {
        genderId: number,
        description: string
      };
      stands: Array<{
        standId: number;
        code: string;
        areas: { areaId: number; size: string };
        sector: { sectorId: number; code: string };
        rubro: { fieldId: number; nameField: string };
      }>;
    };
  }