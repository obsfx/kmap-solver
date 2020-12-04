import commander, { Command } from 'commander';

const cl: commander.Command = new Command();

cl
  .option('-v, --variables <values>', 'variables that will be used (maximum 4 vars) e.g. -v w,x,y,z')
  .option('-m, --minterms <values>', 'decimal minterm positions e.g. -m 0,1,4,5,12')
  .option('-x, --maxterms <values>', 'decimal maxterm positions e.g. -x 0,1,4,5,12');

cl.parse(process.argv);

if (typeof cl.variables != 'string' || ( typeof cl.minterms != 'string' && typeof cl.maxterms != 'string' )) {
  console.log('Please specify minterms or maxterms');
}

const grayCodesForVars: string[][][] = [
  // 2
  [ 
    [ '0', '1' ], 
    [ '0', '1' ] 
  ],
  // 3
  [ 
    [ '00', '01', '11', '10' ], 
    [ '0', '1' ] 
  ],
  // 4
  [ 
    [ '00', '01', '11', '10' ], 
    [ '00', '01', '11', '10' ], 
  ],
]

const variables: string[] = cl.variables.trim().split(',');
const terms: number[] = cl.minterms.trim().split(',').map((str: string) => Number(str));

const [ rows, cols ]= grayCodesForVars[variables.length - 2];

let map: number[][] = [];
let map2: number[][] = [];

for (let i: number = 0; i < rows.length; i++) {
  map.push([]);
  map2.push([]);

  for (let j: number = 0; j < cols.length; j++) {
    let idx = parseInt(`${rows[i]}${cols[j]}`, 2);
    map[i][j] = idx;
    map2[i][j] = terms.indexOf(idx) > -1 ? 1 : 0;
  }
}

console.log(variables, terms);
console.log('---------------');
console.log(map);
console.log('---------------');
console.log(map2);
