/**
 * Validates whether a value's type matches any of the allowed types.
 * @param value - The value to check
 * @param allowedTypes - An array of strings representing permitted types (e.g., "string", "number")
 * @returns boolean - True if the value's type matches one of the allowed types, false otherwise
 */
function validateUnionType(value: any, allowedTypes: string[]): boolean {
    const valueType = typeof value;

    // Iterate through the array of allowed types
    for (const allowedType of allowedTypes) {
        if (valueType === allowedType) {
            return true;
        }
    }

    return false;
}

// --- Demonstration & Test Cases ---

let sampleString: string = "TypeScript is awesome!";
let sampleNumber: number = 2026;
let sampleBoolean: boolean = false;
let sampleUndefined: undefined = undefined;

console.log(validateUnionType(sampleString, ["string", "number"])); 

console.log(validateUnionType(sampleNumber, ["boolean", "object"])); 

console.log(validateUnionType(sampleBoolean, ["string", "boolean"])); 

console.log(validateUnionType(sampleUndefined, ["number", "undefined"])); 
