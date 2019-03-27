import Heket from "heket";

const es6TemplateGrammar = `
template = *(template-head identifier *["." path] template-tail)
path = *( ALPHA )
template-head = "\${"
template-tail = "}"
string = *( ALPHA )
identifier = ("params" / "result")
`;

const parser = Heket.createParser(es6TemplateGrammar);

/**
 * Runtime expression results contain a token and optional path.
 * 
 * **Example**:
 * ```
{
  token: 'params',
  path: 'foo'
}
  ```
 */
interface IRuntimeExpressionResult {
  token: "result" | "params";
  path: string | null;
}

/**
 * Runtime expressions allow defining values based on information that will only be available within an actual JSON-RPC 2.0 call.
 * 
 * **Example**: 
 * 
 * ```
 "$params.foo"
 ```
 */
type TRuntimeExpression = string;

// export const parseVariables = function(runtimeExpression: TRuntimeExpression) {
//   let expressions : any[] = [];
//   try {
//     const variableMatch = variablesParser.parse(runtimeExpression);
//     expressions = expressions.concat(variableMatch.getAll('variables'));
//   } catch (e) {
//     console.log('e=', e);
//   }
//   console.log('expressions', expressions);
//   if (expressions.length > 0) {

//   }
// }

/**
 * Parse runtime expression and return token and optional path.
 */
function parse(runtimeExpression: TRuntimeExpression): any {
  const match = parser.parse(runtimeExpression);
  return match.getRawResult();
}



// links: [
//   {
//     "name": "myLink",
//     "method": "linked_method",
//     "params": {
//       “fooBarId”: “nipple-salad{$params.nipId}salad-{$result.another}”
//     }
//   }
// ]

export default parse;