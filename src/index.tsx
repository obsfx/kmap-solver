import commander, { Command } from 'commander';
import { getKMap, group, KMapCell } from './kmap-solver-lib';

const cl: commander.Command = new Command();

cl
  .option('-v, --variables <values>', 'variables that will be used (maximum 4 vars) e.g. -v w,x,y,z')
  .option('-m, --minterms <values>', 'decimal minterm positions e.g. -m 0,1,4,5,12')
  .option('-x, --maxterms <values>', 'decimal maxterm positions e.g. -x 0,1,4,5,12');

cl.parse(process.argv);

if (typeof cl.variables != 'string' || ( typeof cl.minterms != 'string' && typeof cl.maxterms != 'string' )) {
  console.log('Please specify minterms or maxterms');
}


const variables: string[] = cl.variables.trim().split(',').map((variable: string) => variable.trim());
const terms: number[] = cl.minterms.trim().split(',').map((str: string) => Number(str.trim()));

setTimeout(() => {

  const kmap = getKMap(variables, terms);

  while (terms.length > 0) {
    let k = group(terms[0], kmap);

    console.log('group----------------------');
    console.log(k);

    k.map(t => {
      if (terms.indexOf(t.decimal) > -1) {

        terms.splice(terms.indexOf(t.decimal), 1);
      }
    })

    console.log('--->', terms);
  }
}, 2000);
