import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  background-color: #ee1515;
  color: white;
  padding: 20px;
  text-align: center;
  border-radius: 5px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 2.5em;
`;

function Header() {
  return (
    <HeaderContainer>
      <Title>PokéDex Ultime</Title>
    </HeaderContainer>
  );
}

export default Header;

