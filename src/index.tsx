import commander, { Command } from 'commander';
import colors from 'colors/safe';
import Table, { HorizontalTableRow } from 'cli-table3';
import solve, { KMapCell, KMapGrayCode, KMapGrayCodes } from './kmap-solver-lib';

const cl: commander.Command = new Command();

cl
  .option('-v, --variables <values>', 'variables that will be used (maximum 4 vars) e.g. -v w,x,y,z')
  .option('-m, --minterms <values>', 'decimal minterm positions e.g. -m 0,1,4,5,12')
  .option('-d, --dontcares <values>', '(optional) dont care positions e.g. -d 0,2,3,6')

cl.parse(process.argv);

const variables: string[] = cl.variables ? 
  cl.variables
  .trim()
  .split(',')
  .map((variable: string) => variable.trim()) : [];

if (variables.length == 0) {
  console.error(colors.red('You didn\'t specify any variable'));
  process.exit(1);
}

const terms: number[] = cl.minterms ? 
  cl.minterms
  .trim()
  .split(',')
  .map((str: string) => Number(str.trim())) : [];

console.log();

if (terms.length == 0) {
  console.error('You didn\'t specify any minterm');
  process.exit(1);
}

if (terms.includes(NaN)) {
  console.error('minterms must be number');
  process.exit(1);
}

const dontcares: number[] = cl.dontcares ? 
  cl.dontcares
  .trim()
  .split(',')
  .map((str: string) => Number(str.trim())) : [];

const { groups, expression } = solve(variables, terms, dontcares);

const grayCodes: KMapGrayCode = KMapGrayCodes.get(variables.length) || { rows: [], cols: [] };
const { rows, cols } = grayCodes;

const decimals: number[] = [];
groups.forEach((group: KMapCell[]) => group.forEach((cell: KMapCell) => decimals.push(cell.decimal)))

// instantiate
const table = new Table({
  chars: { 
    'top': '', 
    'top-mid': '', 
    'top-left': '', 
    'top-right': '', 
    'bottom': '', 
    'bottom-mid': '', 
    'bottom-left': '', 
    'bottom-right': '',
    'left': '',
    'left-mid': '', 
    'mid': '', 
    'mid-mid': '', 
    'right': '', 
    'right-mid': '', 
    'middle': ''
  },
  style:{
    "padding-left": 0,
    "padding-right": 0
  },
  head: ['', ...cols ],
});

const data: HorizontalTableRow[] = [];

const text_c = (i: number, str: string): string => {
  const fns = [
    colors.green(str),
    colors.cyan(str),
    colors.yellow(str),
    colors.blue(str),
    colors.red(str)
  ]

  return fns[i] || colors.dim(str);
}

for (let r: number = 0; r < rows.length; r++) {
  data.push([ rows[r] ]);

  for (let c: number = 0; c < cols.length; c++) {
    let state: string = colors.gray(' 0 ');

    if (dontcares.includes(parseInt(`${rows[r]}${cols[c]}`, 2))) {
      state = colors.bold(colors.yellow(' X '));
    }

    data[r].push(state);
  }
}

for (let r: number = 0; r < groups.length; r++) {
  for (let c: number = 0; c < groups[r].length; c++) {

    const { decimal, row, col } = groups[r][c];

    if (decimals.filter((value: number) => value == decimal).length > 1) {
      data[row ][col + 1] = colors.bold(colors.inverse(colors.magenta(' 1 ')));
      continue;
    }

    data[row][col + 1] = colors.inverse(text_c(r, ' 1 '));
  }
}

table.push(...data);

console.log(table.toString());

console.log(colors.grey('────────────────────────────'));
console.log(` ${colors.bold(`f(${variables.join(',')})`)} = ${terms.join(',')}`);
console.log(colors.grey('────────────────────────────'));

for (let i: number = 0; i < groups.length; i++) {
  let mterms: string = ``;

  for (let j: number = 0; j < groups[i].length; j++) {
    const decimal: number = groups[i][j].decimal;

    mterms += decimals.filter((d: number) => d == decimal).length > 1 ? 
      colors.bold(colors.magenta(decimal.toString())) :
      text_c(i, decimal.toString());

    if (j < groups[i].length - 1) {
      mterms += ',';
    }
  }

  console.log(` ${text_c(i, `GROUP${i + 1}`)} (${mterms})`);
}
console.log(colors.grey('────────────────────────────'));
console.log(`${colors.inverse(colors.white('RESULT:'))} ${colors.cyan(colors.bold(expression))}`);
