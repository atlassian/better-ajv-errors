import chalk from 'chalk';
import findErrorPosition from './find-error-position';

export default (obj, dataPath, options = {}) => annotate => {
  const {
    delta = 5,
    defaultColor = 'gray',
    errorColor = 'red',
    annotationColor = 'cyan',
    gutterChar = '│',
    annotationGutterChar = '〉',
    indent = 2,
  } = options;

  try {
    const { line, column } = findErrorPosition(obj, dataPath, indent);

    const jsonString = JSON.stringify(obj, null, indent);
    const lines = jsonString.split('\n');
    const gutterWidth = lines.length.toString().length;
    const annotationGutter = `${''.padStart(gutterWidth)}${annotationGutterChar}`;

    const min = Math.max(line - delta, 0);
    const max = Math.min(line + delta, lines.length - 1);
    let output = [];

    for (let i = min; i <= max; ++i) {
      const color = i === line ? errorColor : defaultColor;
      output.push(
        chalk`{${color} ${String(i + 1).padStart(
          gutterWidth
        )}${gutterChar} ${lines[i]}}`
      );
      if (i === line) {
        output = output.concat([
          // New line
          chalk`{${annotationColor} ${annotationGutter}}`,

          chalk`{${annotationColor} ${annotationGutter}${''.padStart(
            column
          )}${annotate()}}`,

          // New line
          chalk`{${annotationColor} ${annotationGutter}}`,
        ]);
      }
    }
    return output;
  } catch (e) {
    return [chalk`{red 😢  ${e.message || 'Error'}}`];
  }
};
