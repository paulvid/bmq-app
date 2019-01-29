import React, { Component } from 'react';
import { DropdownItem, DropdownMenu, DropdownToggle, Nav } from 'reactstrap';
import PropTypes from 'prop-types';

import { AppHeaderDropdown, AppNavbarBrand, AppSidebarToggler } from '@coreui/react';
import logo from '../../assets/img/brand/long_logo.png'
import sygnet from '../../assets/img/brand/small_logo.png'

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultHeader extends Component {
  render() {

    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        <AppNavbarBrand className="bg-dark"
          full={{ src: logo, width: 180, height: 45, alt: 'BMQ Logo' }}
          minimized={{ src: sygnet, width: 45, height: 45, alt: 'BMQ Logo' }}
        ></AppNavbarBrand>

        <Nav className="ml-auto" navbar>
          <AppHeaderDropdown direction="down">
            <DropdownToggle nav>
              <img src={'../../assets/img/avatars/1.png'} className="img-avatar" alt="admin@bootstrapmaster.com" /> admin@cloudera.com &nbsp; &nbsp;
            </DropdownToggle>

          </AppHeaderDropdown>
        </Nav>
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;
