import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: #ee1515;
  color: white;
  padding: 10px;
  text-align: center;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
`;

function Footer() {
  return (
    <FooterContainer>
      <p>&copy; 2023 PokéDex Ultime. Tous droits réservés.</p>
    </FooterContainer>
  );
}

export default Footer;

