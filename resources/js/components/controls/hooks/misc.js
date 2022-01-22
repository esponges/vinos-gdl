import axios from 'axios';
import _ from 'lodash';
import {
  useEffect, useState, useCallback, useMemo, useContext,
} from 'react';
import queryString from 'query-string';
import { useDispatch } from 'react-redux';
import { Context } from '../../Context';
import { addItemToCart } from '../../../store/cart/reducers';

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

export const useAddItemToCart = () => {
  const dispatch = useDispatch();
  const context = useContext(Context);

  const handleAddItemToCart = (id, price, itemCount = 1) => {
    dispatch(addItemToCart(id));

    const subTotal = price * itemCount;
    context.notifyMinAmountRemaining(subTotal);
  };

  return handleAddItemToCart;
};

const getDeviceScreenSize = (width) => {
  if (width < 415) {
    return 'mobile';
  }
  if (width < 469) {
    return 'tablet';
  }
  return 'desktop';
};

export const useWindowSize = () => {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
    screenType: undefined,
  });
  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
        screenType: getDeviceScreenSize(window.innerWidth),
        isMobile: getDeviceScreenSize(window.innerWidth) === 'mobile',
      });
    }
    // Add event listener
    window.addEventListener('resize', handleResize);
    // Call handler right away so state gets updated with initial window size
    handleResize();
    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures that effect is only run on mount
  // console.log('windowsize', windowSize);
  return { ...windowSize };
};
