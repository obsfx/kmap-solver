export type KMapGrayCode = {
  rows: string[];
  cols: string[];
}

export type KMapCell = {
  binary: string;
  decimal: number;
  row: number;
  col: number;
}

export const KMapGrayCodes: Map<number, KMapGrayCode> = new Map([
  [ 
    2, {
      rows: [ '0', '1' ], 
      cols: [ '0', '1' ] 
    } 
  ],
  [ 
    3, {
      rows: [ '00', '01', '11', '10' ], 
      cols: [ '0', '1' ] 
    } 
  ],
  [ 
    4, {
      rows: [ '00', '01', '11', '10' ], 
      cols: [ '00', '01', '11', '10' ]
    } 
  ]
]);

type Region = {
  w: number;
  h: number;
}

export type KMapResult = {
  groups: KMapCell[][];
  expression: string;
}

const getKMap = (variables: string[]): KMapCell[][] => {
 let KMap: KMapCell[][] = []; 

 const grayCodes: KMapGrayCode | undefined = KMapGrayCodes.get(variables.length);
 
 if (!grayCodes) return KMap;

 const { rows, cols } = grayCodes;

 for (let row: number = 0; row < rows.length; row++) {
   KMap.push([]);

   for (let col: number = 0; col < cols.length; col++) {
     const binary: string = `${rows[row]}${cols[col]}`;
     const decimal: number = parseInt(binary, 2);

     KMap[row].push({ binary, decimal, row, col });
   }
 }

 return KMap;
}

const findDecimalPos = (decimal: number, KMap: KMapCell[][]): { row: number, col: number } => {
  for (let row: number = 0; row < KMap.length; row++) {
    for (let col: number = 0; col < KMap[0].length; col++) {
      if (decimal == KMap[row][col].decimal) return { row, col };
    }
  }

  return { row: 0, col: 0 };
}

const generateRegions = (rowCount: number, colCount: number): Region[] => {
  let regions: Region[] = [];

  for (let w: number = 1; w <= colCount; w = w*2) {
    for (let h: number = 1; h <= rowCount; h = h*2) {
      regions.push({ w, h });

      if ((w == 1 && h == 1) || (w == colCount && h == rowCount)) {
        continue;
      }

      if (w == h) {
        regions.push({ w: -w, h });
        regions.push({ w: -w, h: -h });
        regions.push({ w: w, h: -h });
        continue;
      }

      if (w > h) {
        regions.push({ w: -w, h });

        if (h != 1) {
          regions.push({ w: w, h: -h });
          regions.push({ w: -w, h: -h });
        }

        continue;
      }

      if (w < h) {
        regions.push({ w, h: -h });

        if (w != 1) {
          regions.push({ w: -w, h: h });
          regions.push({ w: -w, h: -h });
        }

        continue;
      }
    }
  }

  return regions.sort((a, b) => {
    let area_a: number = Math.abs(a.w * a.h);
    let area_b: number = Math.abs(b.w * b.h);

    return area_a - area_b;
  });
}

const group = (decimal: number, terms: number[], KMap: KMapCell[][]): KMapCell[] => {
  const rowCount: number = KMap.length;
  const colCount: number = KMap[0].length;

  const { row, col } = findDecimalPos(decimal, KMap);

  const regions: Region[] = generateRegions(rowCount, colCount);

  const checkRegion = (w: number, h: number): KMapCell[] | false => {
    const cells: KMapCell[] = [];

    let r: number = 0;

    while (r != h) {
      const curRow: number = (row + r) % rowCount >= 0 ? 
        (row + r) % rowCount : 
        rowCount + ((row + r) % rowCount);

      let c: number = 0;

      while (c != w) {
        const curCol: number = (col + c) % colCount >= 0 ?
          (col + c) % colCount :
          colCount + ((col + c) % colCount);

        if (terms.indexOf(KMap[curRow][curCol].decimal) == -1) return false;

        cells.push(KMap[curRow][curCol]);

        w < 0 ? c-- : c++;
      }

      h < 0 ? r-- : r++;
    }

    return cells;
  }

  for (let i: number = regions.length - 1; i > -1; i--) {
    const { w, h } = regions[i];

    const cells: KMapCell[] | false = checkRegion(w, h);

    if (cells) return cells;
  }

  return [ KMap[row][col] ];
}

const extract = (variables: string[], group: KMapCell[]): string => {
  let buffer: string[] = group[0].binary.split('');
  let expression: string = '';

  for (let i: number = 1; i < group.length; i++) {
    const binary: string[] = group[i].binary.split('');

    for (let j: number = 0; j < binary.length; j++) {
      if (binary[j] != buffer[j]) buffer[j] = 'X';
    }
  }

  for (let i: number = 0; i < buffer.length; i++) {
    const value: string = buffer[i];

    if (value != 'X') {
      expression += value == '0' ? `${variables[i]}'` : `${variables[i]}`; 
    }
  }

  return expression;
}

const solve = (variables: string[], minterms: number[], dontcares: number[] = []): KMapResult => {
  const KMap: KMapCell[][] = getKMap(variables);

  const groups: KMapCell[][] = [];
  const expressions: string[] = [];

  let termQueue: number[] = [ ...minterms ];

  while (termQueue.length > 0) {
    const term = termQueue[0];

    if (term < 0 || term > variables.length * variables.length - 1) {
      termQueue = termQueue.filter((_term: number) => _term != term);
      continue;
    }

    let cells: KMapCell[] = group(term, minterms, KMap);

    if (dontcares.length > 0) {
      const dc_cells: KMapCell[] = group(term, [...minterms, ...dontcares], KMap);
      if (dc_cells.length > cells.length) cells = dc_cells;
    }

    groups.push(cells);

    cells.map((cell: KMapCell) => {
      termQueue = termQueue.filter((_term: number) => _term != cell.decimal);
    });

    const expression: string = extract(variables, cells);
    expressions.push(expression);
  }

  const total_expression: string = expressions.join(' + ');

  return {
    groups,
    expression: total_expression == '' ? '1' : expressions.join(' + ')
  }
}

export default solve;
