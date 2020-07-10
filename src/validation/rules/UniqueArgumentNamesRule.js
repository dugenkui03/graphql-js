// @flow strict

import { GraphQLError } from '../../error/GraphQLError';
import { type ASTVisitor } from '../../language/visitor';

import { type ASTValidationContext } from '../ValidationContext';

/**
 * Unique argument names
 *
 * A GraphQL field or directive is only valid if all supplied arguments are
 * uniquely named.
 */
export function UniqueArgumentNamesRule(
  context: ASTValidationContext,
): ASTVisitor {
  //let 声明的变量只在 let 命令所在的代码块 {} 内有效，在 {} 之外不能访问。
  let knownArgNames = Object.create(null);

  //返回值
  return {
    Field() {
      knownArgNames = Object.create(null);
    },
    Directive() {
      knownArgNames = Object.create(null);
    },
    Argument(node) {
      const argName = node.name.value;
      if (knownArgNames[argName]) {
        context.reportError(
          new GraphQLError(
            `There can be only one argument named "${argName}".`,
            [knownArgNames[argName], node.name],
          ),
        );
      } else {
        knownArgNames[argName] = node.name;
      }
      return false;
    },
  };
}
