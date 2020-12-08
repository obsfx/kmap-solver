import commander, { Command } from 'commander';
import solve from './kmap-solver-lib';

const cl: commander.Command = new Command();

cl
  .option('-v, --variables <values>', 'variables that will be used (maximum 4 vars) e.g. -v w,x,y,z')
  .option('-m, --minterms <values>', 'decimal minterm positions e.g. -m 0,1,4,5,12')
  .option('-d, --dontcares <values>', '(optional) dont care positions e.g. -d 0,2,3,6')

cl.parse(process.argv);

if (typeof cl.variables != 'string' || ( typeof cl.minterms != 'string' && typeof cl.maxterms != 'string' )) {
  console.log('Please specify minterms or maxterms');
}


const variables: string[] = cl.variables.trim().split(',').map((variable: string) => variable.trim());
const terms: number[] = cl.minterms.trim().split(',').map((str: string) => Number(str.trim()));
const dontcares: number[] = cl.dontcares ? 
  cl.dontcares.trim().split(',').map((str: string) => Number(str.trim())) :
  [];

setTimeout(() => {
  const kek = solve(variables, terms, dontcares);
  console.log(kek.groups)
  console.log(kek.expression);
}, 2000);
