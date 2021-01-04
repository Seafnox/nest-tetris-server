import { getArrayIntersection } from './get-array-intersection';

export const getPropertiesStrings = function(withClassProperties: boolean | string[], targetInstance): string[] {
  const allProps = Object.keys(targetInstance);
  const requiredProps = (withClassProperties instanceof Array) ? getArrayIntersection(allProps, withClassProperties) : allProps;

  return requiredProps.map(function (propName: string): string {
    return `[${propName}=${targetInstance[propName]}]`
  });
};
