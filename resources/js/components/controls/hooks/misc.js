import axios from 'axios';
import _ from 'lodash';
import {
  useEffect, useState, useCallback, useMemo,
} from 'react';
import queryString from 'query-string';

export const useEffectProducts = () => {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    axios.get('/cart/count').then((res) => {
      setCartCount(res.data[0]);
    });
  }, []);

  return {
    cartCount,
    setCartCount,
  };
};

export const useUrlParams = (query, defaultParams) => useMemo(() => {
  const params = queryString.parse(query, { arrayFormat: 'index' });
  const defaultsKeysValues = _.mapValues(defaultParams, (value, key) => (_.isFunction(value) ? value(params[key]) : _.has(params, key) ? params[key] : value));
  return { ...params, ...defaultsKeysValues };
}, [query, defaultParams]);

export const useUrlParamsHandler = ({
  history, location, key, serializer = _.identity,
}) => useCallback((source, ...rest) => {
  let result = {};
  if (_.isUndefined(key)) {
    result = serializer(source, ...rest);
  } else if (_.has(source, 'target.value')) {
    result[key] = serializer(source.target.value);
  } else {
    result[key] = serializer(source, ...rest);
  }

  const newParams = _.pickBy({ ...(queryString.parse(location.search, { arrayFormat: 'index' })), ...result }, _.identity);
  history.replace(`${history.location.pathname}?${queryString.stringify(newParams, { arrayFormat: 'index' })}`);
}, [key, serializer, history, location]);
