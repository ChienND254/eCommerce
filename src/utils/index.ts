import _ from 'lodash';

/**
 * Extracts specific fields from an object.
 * 
 * @template T - The type of the object.
 * @template K - The keys of the object to extract.
 * 
 * @param {Object} params - The parameters object.
 * @param {K[]} params.fields - The fields to pick from the object.
 * @param {T} params.object - The object from which to pick the fields.
 * 
 * @returns {Pick<T, K>} A new object containing only the specified fields.
 * 
 * @example
 * const user = { id: 1, name: 'John', age: 25 };
 * const fields = ['id', 'name'];
 * const userInfo = getInfoData({ fields, object: user });
 * // userInfo will be { id: 1, name: 'John' }
 */
const getInfoData = <T, K extends keyof T>({ fields = [], object = {} as T }: { fields: K[], object: T }): Pick<T, K> => {
    return _.pick(object, fields) as Pick<T, K>;
}

/**
 * Removes properties with a value of `null` from an object.
 * 
 * @param {Object} obj - The object from which to remove `null` properties.
 * 
 * @returns {void}
 * 
 * @example
 * let obj = { name: 'John', age: null, id: 1 };
 * removeUndefinedObject(obj);
 * // Now obj will be { name: 'John', id: 1 }
 */
const removeUndefinedObject = <T extends Record<string, any>>(obj: Partial<T>): Partial<T> => {
    Object.keys(obj).forEach((key) => {
        if (obj[key] === null || obj[key] === undefined) {
            delete obj[key];
        }
    });

    return obj;
}

/**
 * Recursively updates keys in nested objects to have a flat structure.
 * 
 * @param {Object} obj - The object to flatten.
 * 
 * @returns {Object} A new object with flattened keys.
 * 
 * @example
 * let obj = { user: { info: { name: 'John', age: 30 } } };
 * const flattenedObj = updateNestedObjectParser(obj);
 * // flattenedObj will be { 'user.info.name': 'John', 'user.info.age': 30 }
 */
const updateNestedObjectParser = (obj: Record<string, any>): Record<string, any> => {
    const final: Record<string, any> = {};

    Object.keys(obj || {}).forEach(key => {
        if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
            const response = updateNestedObjectParser(obj[key]);

            Object.keys(response || {}).forEach(a => {
                final[`${key}.${a}`] = response[a];
            });
        } else {
            final[key] = obj[key];
        }
    });

    return final;
}

export { getInfoData, removeUndefinedObject, updateNestedObjectParser };
