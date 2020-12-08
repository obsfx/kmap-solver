export type KMapGrayCode = {
  rows: string[];
  cols: string[];
}

export type KMapCell = {
  binary: string;
  decimal: number;
  value: boolean;
  row: number;
}

const KMapGrayCodes: Map<number, KMapGrayCode> = new Map([
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

export const getKMap = (variables: string[], terms: number[]): KMapCell[][] => {
 let KMap: KMapCell[][] = []; 

 const grayCodes: KMapGrayCode | undefined = KMapGrayCodes.get(variables.length);
 
 if (!grayCodes) return KMap;

 const { rows, cols } = grayCodes;

 for (let row: number = 0; row < rows.length; row++) {
   KMap.push([]);

   for (let col: number = 0; col < cols.length; col++) {
     const binary: string = `${rows[row]}${cols[col]}`;
     const decimal: number = parseInt(binary, 2);
     const value: boolean = terms.indexOf(decimal) > -1;

     KMap[row].push({ binary, decimal, value, row });
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

export const group = (decimal: number, KMap: KMapCell[][]): KMapCell[] => {
  //Number.isInteger(Math.log2(16))

  const rowCount: number = KMap.length;
  const colCount: number = KMap[0].length;

  const { row, col } = findDecimalPos(decimal, KMap);

  let regions: { w: number, h: number }[] = [];

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

  regions = regions.sort((a, b) => {
    let area_a: number = Math.abs(a.w * a.h);
    let area_b: number = Math.abs(b.w * b.h);

    return area_a - area_b;
  });

  //console.log(regions);

  const checkRegion = (w: number, h: number): KMapCell[] | false => {
    const cells: KMapCell[] = [];

    let r: number = 0;

    debugger;

    while (r != h) {
      const curRow: number = (row + r) % rowCount >= 0 ? 
        (row + r) % rowCount : 
        rowCount + ((row + r) % rowCount);

      let c: number = 0;

      while (c != w) {
        //console.log('kekw', r, c, w, h);
        const curCol: number = (col + c) % colCount >= 0 ?
          (col + c) % colCount :
          colCount + ((col + c) % colCount);

        if (!KMap[curRow][curCol].value) return false;

        cells.push(KMap[curRow][curCol]);

        if (w < 0) c--;
        else c++;
      }

      if (h < 0) r--;
      else r++;
    }

    return cells;
  }

  for (let i: number = regions.length - 1; i > -1; i--) {
    const { w, h } = regions[i];

    //console.log('----', w, h)

    const cells: KMapCell[] | false = checkRegion(w, h);

    if (cells) return cells;
  }

  return [ KMap[row][col] ];
}
