import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Form,
  NavDropdown,
  Badge,
} from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingBasket, fas } from '@fortawesome/free-solid-svg-icons';
import { fab, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';

import { Link, withRouter } from 'react-router-dom';
import axios from 'axios';
import sanctumApi from '../../sanctum-api';
import DownShiftSearch from './DownShiftSearch';
import { debounce } from '../../utilities/helpers';

import CustomLoader from '../CustomLoader';
import { useWindowSize } from '../controls/hooks/misc';

library.add(fas, fab);

const IndexNavbar = ({
  logout, history, userInfo, userLogged,
}) => {
  // logout, history cartCount, userInfo, userLogged in
  const [navbarBg, setNavbarBg] = useState(false);
  const [categories, setCategories] = useState([]);

  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const cartCount = useSelector((state) => state.cart.cartTotal);

  const handleScroll = debounce(() => {
    // use debounce help to reduce rerenders from scroll listener

    const currentScrollPos = window.pageYOffset;

    setVisible(
      // ensures navbar is shown only when swiping up more than 70px
      prevScrollPos - currentScrollPos > 70
      //  ensures navbar is shown always at the verytop
      || currentScrollPos < 10,
    );

    setPrevScrollPos(currentScrollPos);

    if (window.scrollY >= 480) {
      setNavbarBg(true);
    } else {
      setNavbarBg(false);
    }
  }, 100);

  const handleDownshiftChange = (selectedProduct) => {
    history.push(`/products/${selectedProduct.id}`);
  };

  const navbarLogout = () => {
    sanctumApi
      .get('sanctum/csrf-cookie')
      .then(() => {
        axios
          .post('/logout')
          .then(() => {
            logout();
            history.push('/login');
          })
          .catch((err) => {
            console.error(err);
          });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    axios
      .get('/category-list')
      .then((res) => {
        setCategories(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  useEffect(() => {
    // transition effect dark/light and hide/show nav
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [prevScrollPos, visible]);

  const { isMobile } = useWindowSize();

  return (
    <nav
      className={`navbar navbar-expand-lg fixed-top
            ${navbarBg ? 'navbar-light bg-light' : 'navbar-dark bg-dark'}`}
      style={{ top: visible ? '0' : '-180px', transition: 'top 0.6s', padding: !isMobile ? '0.5rem 10%' : '0.1rem 1%' }}
    >
      <Link className="navbar-brand" to="/">VINOREO</Link>
      <div className="navbar-brand" id="product-search-form">
        <Form inline>
          <DownShiftSearch handleDownshiftChange={handleDownshiftChange} />
        </Form>
      </div>
      <div className="navbar-brand" id="product-search-form">
        <Link className="navbar-brand" to="/products">{!isMobile ? 'Lista de precios' : 'Lista'}</Link>
      </div>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon" />
      </button>
      <div
        className="collapse navbar-collapse"
        id="navbarSupportedContent"
      >
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <a className="nav-link" href="#Tequila">
              Tequila
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#Whisky">
              Whisky
            </a>
          </li>
          <li className="nav-item dropdown">
            <span
              className="nav-link dropdown-toggle"
              id="navbarDropdown"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Ver todos
            </span>
            <div
              className="dropdown-menu"
              aria-labelledby="navbarDropdown"
              id="category-dropdown"
            >
              {categories.map((category) => (
                <a
                  className="dropdown-item"
                  key={category}
                  href={`#${category}`}
                >
                  {category}
                </a>
              ))}
            </div>
          </li>
        </ul>
        {/* right side of navbar */}
        <ul className="navbar-nav">
          {cartCount || cartCount === 0 ? (
            <li className="nav-item">
              <Link
                to="/cart"
                className="nav-link"
                style={{ marginRight: '10px' }}
              >
                <b>Carrito</b>
                {' '}
                &nbsp;&nbsp;&nbsp;
                <Badge
                  pill
                  variant="info"
                  size="sm"
                  id="item-count"
                >
                  <FontAwesomeIcon
                    icon={faShoppingBasket}
                    data-testid="cart-count-badge"
                  />
                  &nbsp;
                  {cartCount ?? cartCount}
                </Badge>
              </Link>
            </li>
          ) : (
            <li className="nav-item">
              <CustomLoader size={30} />
            </li>
          )}

          {userLogged && !userInfo.userName && (
            <li className="nav-item">
              <CustomLoader size={30} />
            </li>
          )}
          {userInfo.userName && userLogged && (
            <li className="nav-item">
              <NavDropdown
                title={`${userInfo.userName}`}
                id="collasible-nav-dropdown"
              >
                <NavDropdown.Item onClick={navbarLogout}>
                  Cerrar sesión
                </NavDropdown.Item>
              </NavDropdown>
            </li>
          )}

          {!userLogged && (
            <li className="nav-item">
              <Link to="/login" className="nav-link">
                Inicia Sesión
              </Link>
            </li>
          )}
        </ul>
      </div>

      {/* floating btns */}
      <a
        href="https://wa.me/message/FHZNST5IP6LFB1"
        className="material-icons floating-btn-whats"
      >
        <FontAwesomeIcon icon={faWhatsapp} />
      </a>
      <Link to="/cart" className="material-icons floating-btn-cart">
        <FontAwesomeIcon icon={['fas', 'shopping-cart']} />
        &nbsp;
        <Badge pill variant="warning" data-testid="floating-cart-count">
          {cartCount && cartCount}
        </Badge>
      </Link>
    </nav>
  );
};

export default withRouter(IndexNavbar);
