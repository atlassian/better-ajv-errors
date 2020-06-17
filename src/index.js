import prettify from './helpers';

const customErrorToStructure = error => error.getError();

export default (schema, errors, { propertyPath, targetValue }) => {
  const customErrors = prettify(errors, {
    data: targetValue,
    schema,
    propPath: propertyPath,
  });

  return customErrors.map(customErrorToStructure);
};
