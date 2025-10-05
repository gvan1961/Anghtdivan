import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th *ngFor="let column of columns">
              {{ column.label }}
            </th>
            <th *ngIf="actions">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let item of data">
            <td *ngFor="let column of columns">
              {{ getValue(item, column.key) }}
            </td>
            <td *ngIf="actions" class="actions-cell">
              <ng-content></ng-content>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="no-data" *ngIf="!data || data.length === 0">
        Nenhum registro encontrado
      </div>
    </div>
  `,
  styles: [`
    .table-container {
      overflow-x: auto;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
    }

    .data-table th {
      background: #f7fafc;
      padding: 12px 16px;
      text-align: left;
      font-weight: 600;
      color: #2d3748;
      border-bottom: 2px solid #e2e8f0;
      font-size: 14px;
      white-space: nowrap;
    }

    .data-table td {
      padding: 12px 16px;
      border-bottom: 1px solid #e2e8f0;
      color: #4a5568;
      font-size: 14px;
    }

    .data-table tbody tr:hover {
      background: #f7fafc;
    }

    .actions-cell {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .no-data {
      padding: 40px;
      text-align: center;
      color: #718096;
      font-size: 14px;
    }
  `]
})
export class TableComponent {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() actions = false;

  getValue(item: any, key: string): any {
    const keys = key.split('.');
    let value = item;
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value ?? '-';
  }
}