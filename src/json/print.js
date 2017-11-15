import chalk from 'chalk';
import parse from './parse';

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

  const jsonString = JSON.stringify(obj, null, indent);
  const lines = jsonString.split('\n');
  const gutterWidth = lines.length.toString().length;
  const annotationGutter = `${''.padStart(gutterWidth)}${annotationGutterChar}`;

  // console.log(JSON.stringify(parse(jsonString), null, 2));
  // TODO: Handle json pointer escape notation and better error handling
  try {
    const { meta: { line, column } } = dataPath
      .split('/')
      .slice(1)
      .reduce(
        (obj, pointer) => obj.value[pointer] || obj.value.value[pointer],
        parse(jsonString)
      );

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
