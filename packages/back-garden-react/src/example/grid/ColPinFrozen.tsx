import React from 'react';
import { ReactDataGrid } from '../../incubator/react-data-grid/index';

class Example extends React.Component<any, any> {
  _columns: (
    | { key: string; name: string }
    | { key: string; name: string; frozen: boolean; width?: undefined }
    | { key: string; name: string; width: number; frozen: boolean }
    | { key: string; name: string; width: number; frozen?: undefined }
  )[];
  _rows: any[];

  constructor(props, context) {
    super(props, context);
    this.createRows();

    const extraColumns = [...Array(50).keys()].map(i => ({ key: `col${i}`, name: `col${i}` }));
    const columns = [
      {
        key: 'id',
        name: 'ID',
        frozen: true,
      },
      {
        key: 'task',
        name: 'Title',
        width: 200,
        frozen: true,
      },
      {
        key: 'priority',
        name: 'Priority',
        width: 200,
        frozen: true,
      },
      {
        key: 'issueType',
        name: 'Issue Type',
        width: 200,
        // frozen: true,
      },
      {
        key: 'complete',
        name: '% Complete',
        width: 200,
      },
      {
        key: 'startDate',
        name: 'Start Date',
        width: 200,
      },
      {
        key: 'completeDate',
        name: 'Expected Complete',
        width: 200,
      },
      ...extraColumns,
    ];

    this._columns = columns;
    this.state = null;
  }

  getRandomDate = (start, end) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toLocaleDateString();
  };

  createRows = () => {
    const rows = [];
    for (let i = 1; i < 1000; i++) {
      rows.push({
        id: i,
        task: `Task ${i}`,
        complete: Math.min(100, Math.round(Math.random() * 110)),
        priority: ['Critical', 'High', 'Medium', 'Low'][Math.floor(Math.random() * 3 + 1)],
        issueType: ['Bug', 'Improvement', 'Epic', 'Story'][Math.floor(Math.random() * 3 + 1)],
        startDate: this.getRandomDate(new Date(2015, 3, 1), new Date()),
        completeDate: this.getRandomDate(new Date(), new Date(2016, 0, 1)),
      });
    }

    this._rows = rows;
  };

  rowGetter = i => {
    return this._rows[i];
  };

  render() {
    return (
      <ReactDataGrid columns={this._columns} rowGetter={this.rowGetter} rowsCount={this._rows.length} minHeight={500} />
    );
  }
}

export default Example;
