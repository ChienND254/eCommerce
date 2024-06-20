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
 * Creates a MongoDB projection object for selecting specific fields.
 * 
 * @param {string[]} [select=[]] - An array of field names to select.
 * 
 * @returns {Object} An object with the fields as keys and `1` as values.
 * 
 * @example
 * const fields = ['name', 'email'];
 * const projection = getSelectData(fields);
 * // projection will be { name: 1, email: 1 }
 */
const getSelectData = (select: string[] = []): Record<string, 1> => {
    return Object.fromEntries(select.map(el => [el, 1]));
}

export { getInfoData, getSelectData };
