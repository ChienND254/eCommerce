import _ from 'lodash';

const getInfoData = <T, K extends keyof T>({fields = [], object = {} as T}: { fields: K[], object: T }): Pick<T, K> => {
    return _.pick(object, fields) as Pick<T, K>;;
}

export default getInfoData;
