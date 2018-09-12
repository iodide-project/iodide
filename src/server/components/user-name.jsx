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


const MediumUserNameContainer = styled('a')`
display: block;
text-decoration: none;
color: black;

:hover {
  text-decoration: underline;
}

div.info-table {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

div.user-name {
  font-size: 14px;
}

img {
  border-radius: 7px;
  margin-right: 15px;
}
`

export const MediumUserName = ({ username, fullName, avatar }) => (
  <MediumUserNameContainer href={`/${username}`}>
    <div className="info-table">
      <img
        src={avatar}
        alt={username}
        width={35}
      />
      <div className="user-name">
        {fullName} <i>({username})</i>
      </div>
    </div>
  </MediumUserNameContainer>
)
