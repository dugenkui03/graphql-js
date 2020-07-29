import { GraphQLError } from '../../error/GraphQLError';
import type { ASTVisitor } from '../../language/visitor';

import type { ASTValidationContext } from '../ValidationContext';

/**
 * Unique argument names
 *
 * A GraphQL field or directive is only valid if all supplied arguments are
 * uniquely named.
 */
export function UniqueArgumentNamesRule(
  context: ASTValidationContext,
): ASTVisitor {
  let knownArgNames = Object.create(null);
  /**
   * 返回一个对象：https://www.jianshu.com/p/d39b3a6207a2
   *
   * 构造函数 return {回调方法A,回调方法B}
   */
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
