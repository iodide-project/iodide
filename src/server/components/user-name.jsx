import React from 'react'
import styled from 'react-emotion'

const UserNameContainer = styled('a')`
display: flex;
align-items: center;
padding-right: 8px;
padding-bottom: 0px;

img {
  width: 30px;
  height: 30px;
  border-radius: 15px;
  margin:0px;
  margin-right:8px;
}

div {
  font-weight: bold;
}
`

const Avatar = ({ src }) => (
  <img src={src} alt={src} />
)

// appropriate for inline displays, tables, etc.
export const SmallUserName = ({ username, avatar }) => (
  <UserNameContainer href={`/${username}/`}>
    <div><Avatar src={avatar} /></div>
    <div>{username}</div>
  </UserNameContainer>
)
