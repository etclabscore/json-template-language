"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var heket_1 = __importDefault(require("heket"));
var es6TemplateGrammar = "\ntemplate = *(template-head identifier *[\".\" path] template-tail)\npath = *( ALPHA )\ntemplate-head = \"${\"\ntemplate-tail = \"}\"\nstring = *( ALPHA )\nidentifier = (\"params\" / \"result\")\n";
var parser = heket_1.default.createParser(es6TemplateGrammar);
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
function parse(runtimeExpression) {
    var match = parser.parse(runtimeExpression);
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
exports.default = parse;
