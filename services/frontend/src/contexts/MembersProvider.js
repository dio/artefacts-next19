import React, { useState } from 'react';

const defaultMembers = [
  {
    name: 'Ignasi Barrera',
    initial: 'I',
    title: 'Engineer',
    version: 'v1',
    picture:
      'https://www.tetrate.io/wp-content/uploads/2019/03/Ignasi_Barrera2.jpg',
    quote: "I really want a boat, that's my reason to join Tetrate."
  },
  {
    name: 'Zack Butcher',
    initial: 'Z',
    title: 'Engineer',
    version: 'v1',
    picture:
      'https://www.tetrate.io/wp-content/uploads/2019/02/Zack_Butcher.png',
    quote: "I really want a boat, that's my reason to join Tetrate."
  },
  {
    name: 'Hongtao Gao',
    initial: 'H',
    title: 'Engineer',
    version: 'v1',
    picture:
      'https://www.tetrate.io/wp-content/uploads/2019/03/Hongtao-1-e1551500623352.jpg',
    quote: "I really want a boat, that's my reason to join Tetrate."
  },
  {
    name: 'Devarajan Ramaswamy',
    initial: 'D',
    title: 'Engineer',
    version: 'v1',
    picture:
      'https://www.tetrate.io/wp-content/uploads/2019/03/Screenshot-2019-03-02-at-06.51.56-e1551538502713.png',
    quote: "I really want a boat, that's my reason to join Tetrate."
  },
  {
    name: 'Lizan Zhou',
    initial: 'L',
    title: 'Engineer',
    version: 'v1',
    picture:
      'https://www.tetrate.io/wp-content/uploads/2019/03/lizan-e1551501164830.jpg',
    quote: "I really want a boat, that's my reason to join Tetrate."
  }
];

export const MembersContext = React.createContext(defaultMembers);
export default function MembersContextProvider({ children }) {
  const [members, setMembers] = useState(defaultMembers);
  const obj = { members, setMembers };

  return (
    <MembersContext.Provider value={obj}>{children}</MembersContext.Provider>
  );
}
