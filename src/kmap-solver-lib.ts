export type Grouping = {
  //direction1
  d1: number;
  //direction2
  d2: number;
}

export type KMapSpecification = {
  overflowX: boolean;
  overflowY: boolean;
  variableCount: number;
  grayCodes: string[][];
  groupings: Grouping[];
}

export type KMapCell = {
  binary: string;
  decimal: number;
  value: boolean;
}

export type KMap = {
  specification: KMapSpecification;
  map: KMapCell[][];
}

const KMapSpecifications: Map<number, KMapSpecification> = new Map([
  [ 
    2, {
      overflowX: false,
      overflowY: false,
      variableCount: 2,
      grayCodes: [ 
        [ '0', '1' ], 
        [ '0', '1' ] 
      ],
      groupings: [
        { d1: 2, d2: 2 },
        { d1: 2, d2: 1 }
      ]
    } 
  ],
  [ 
    3, {
      overflowX: false,
      overflowY: true,
      variableCount: 3,
      grayCodes: [ 
        [ '00', '01', '11', '10' ], 
        [ '0', '1' ] 
      ],
      groupings: [
        { d1: 2, d2: 4 },
        { d1: 1, d2: 4 },
        { d1: 2, d2: 2 },
        { d1: 1, d2: 2 }
      ]
    } 
  ],
  [ 
    4, {
      overflowX: true,
      overflowY: true,
      variableCount: 4,
      grayCodes: [ 
        [ '00', '01', '11', '10' ], 
        [ '00', '01', '11', '10' ]
      ],
      groupings: [
        { d1: 4, d2: 4 },
        { d1: 4, d2: 1 },
        { d1: 2, d2: 2 },
        { d1: 2, d2: 1 },
      ]
    } 
  ]
]);

// no need groupings
// search rows
// turn into binary representation
// bitwise AND with below and above rows
// mark
//
// 11
// 01
// 10
// 11
//
// e.g. step1 below
// 11 & 01 -> 01 -> output gonna used
// 01 & 10 -> 00 -> 00 < 01 -> stop
// rows = 0,1 buffer = 01
//
// e.g. step2 above
// 11 & 11 -> 11 -> output gonna used
// 11 & 10 -> 10 -> 10 < 11 -> stop
// overwrite buffer and rows
// rows = 0,4 buffer = 11
//
// pop this position from the minterm arr
