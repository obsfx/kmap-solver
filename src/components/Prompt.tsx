import React, { useEffect } from 'react';
import { Box, Text, useApp } from 'ink';
import solve, { KMapCell, KMapGrayCode, KMapGrayCodes } from '../kmap-solver-lib';

type Props = {
  variables: string[];
  minterms: number[];
  dontcares: number[];
}

const Prompt = (props: Props) => {
  const { exit } = useApp();
  const { variables, minterms, dontcares } = props;
  const { groups, expression } = solve(variables, minterms, dontcares);

  const grayCodes: KMapGrayCode = KMapGrayCodes.get(variables.length) || { rows: [], cols: [] };

  const { rows, cols } = grayCodes;

  const decimals: number[] = [];
  groups.forEach((group: KMapCell[]) => group.forEach((cell: KMapCell) => decimals.push(cell.decimal)))

  useEffect(() => exit(), []);

  const table: JSX.Element[] = [];

  for (let r: number = 0; r < rows.length; r++) {
    const texts: JSX.Element[] = [];

    texts.push(
      <Text key={`${r}_indicator`}color='cyan'>{rows[r]} </Text>
    );

    for (let c: number = 0; c < cols.length; c++) {
      const cellNumber: number = r * cols.length + c;

      texts.push(
        <Box key={cellNumber} flexDirection='row'>
          {
            c == 0 && <Text>{cols[c]}</Text>
          }
          <Text>
            { decimals.includes(cellNumber) ? 
            <Text bold={true} color='greenBright'>1</Text> : 
              dontcares.includes(cellNumber) ? 
              'X' : 
              <Text color='grey'>0</Text>
            }
          </Text>
        </Box>
      );
    }

    table.push(
      <Box key={r}>
        {texts}
      </Box>
    )
  }

  return (
    <Box flexDirection='column'>
      <Box flexDirection='column'>
      {table}
      </Box>
    </Box>
  )
}

export default Prompt;
