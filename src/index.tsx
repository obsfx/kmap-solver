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


const variables: string[] = cl.variables.trim().split(',');
const terms: number[] = cl.minterms.trim().split(',').map((str: string) => Number(str));

