/**
 * @ignore
 */
const Heket = require("heket");

/* tslint:disable */
/**
 * @ignore
 */
export const Grammar = `
grammar = [head] *(template-head identifier *["." path] *[array-left array-index array-right] template-tail [tail])
path = *( ALPHA / "_" )
array-left = "["
array-right = "]"
array-index = *( DIGIT )
template-head = "\${"
template-tail = "}"
head = *( ALPHA /  DIGIT / special-characters )
tail = *( ALPHA / DIGIT / special-characters )
literals = *( ALPHA / DIGIT / special-characters )
identifier = *( ALPHA / "_" )
special-characters =  *("-" / "_" / "~" / "." / ":" / "/" / "?" / "#" / "[" / "]" / "@" /  "!" /  "&" / "'" / "(" / ")" /  "*" / "+" / "," / ";" / "=")
`;
/* tslint:enable */

/**
 * @ignore
 */
const parser = Heket.createParser(Grammar);

/**
 * @ignore
 */
interface IParserObject {
  paths: string[];

  identifier: string | null;
  arrayIndex: number | null;
}

/**
 * Compile template with the given JSON into string or optionally by value.
 * @param jsonObject a valid parsed JSON object
 * @param templateString a string that may contain template delimeters `${}` that refer to the JSON.
 * @param passByReference allows you to return JSON objects by reference if there is no `head` or `tail`.
 * @return a string OR a JSON value reference if `passByReference` is `true` and there is no `head` or `tail`.
 */
function compileTemplate(
  jsonObject: any,
  templateString: string,
  passByReference?: boolean,
): string | any {
  const match = parser.parse(templateString);
  const result = match.getRawResult();

  // walk grammar
  let currentObj: IParserObject = { paths: [], identifier: null, arrayIndex: null };
  return result
    .rules
    .reduce((resultString: string | any, rule: any) => {
      switch (rule.rule_name) {
        case "head":
          resultString += rule.string;
          break;
        case "template_head":
          break;
        case "identifier":
          currentObj.identifier = rule.string;
          break;
        case "path":
          currentObj.paths.push(rule.string);
          break;
        case "array_index":
          currentObj.arrayIndex = parseInt(rule.string, 10);
          break;
        case "template_tail":
          break;
        case "tail":
          if (!currentObj.identifier) {
            break;
          }
          let value = jsonObject[currentObj.identifier];
          if (currentObj.paths.length > 0) {
            value = currentObj.paths.reduce((memo, path) => {
              return memo[path];
            }, value);
          }
          if (Number(currentObj.arrayIndex) !== null) {
            if (currentObj.arrayIndex !== null) {
              value = value[currentObj.arrayIndex];
            }
          }
          currentObj = { paths: [], identifier: null, arrayIndex: null };
          if (resultString === "" && rule.string === "" && passByReference) {
            resultString = value;
            break;
          }
          resultString += value;
          resultString += rule.string;
          break;
      }
      return resultString;
    }, "");
}

export default compileTemplate;