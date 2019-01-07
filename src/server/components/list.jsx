import { css } from 'emotion'
import styled from 'react-emotion'

const hoverSet = color => css`
a {
    text-decoration: none;
    color: ${color};
}

a:hover {
    text-decoration: underline;
    color: purple;
}
`

export const List = styled('div')``

const listItemAlign = (pr) => {
  let h = 'baseline'
  switch (pr) {
    case ('single'): {
      h = 'center'
      break
    }
    case ('double'): {
      h = 'flex-start'
      break
    }
    case ('triple'): {
      h = 'flex-start'
      break
    } default: {
      h = 'flex-start'
    }
  }
  return h
}

const listItemHeight = (pr) => {
  let h = '32px'
  switch (pr) {
    case ('single'): {
      h = '32px'
      break
    }
    case ('double'): {
      h = '40px'
      break
    }
    case ('triple'): {
      h = '48px'
      break
    } default: {
      h = '24px'
    }
  }
  return h
}

export const ListSmallLink = styled('a')`
  padding-left:3px;
  padding-right: 3px;
`

export const ListItem = styled('a')`
padding: 16px;
height: ${props => listItemHeight(props.type)};
display: flex;
align-items: ${props => listItemAlign(props.type)};
text-decoration: none;
color: black;


:hover {
    background-color: #f6f8fa;
}
`

export const ListIcon = styled('div')``

export const ListMain = styled('div')`
flex-grow:2;
`

export const ListPrimaryText = styled('div')`
color: black;
${hoverSet('black')}
`

export const ListSecondaryText = styled('div')`
color: gray;
font-size: 13px;
${hoverSet('gray')}
`

export const ListSecondaryTextLink = styled('a')`
color: gray;
text-decoration: none;

:hover {
    text-decoration: none;
    color: purple;
}

`
export const ListMetadata = styled('div')``

export const ListDate = styled('div')`
width: 100px;
font-size:13px;
color: gray;
${hoverSet('gray')}
`
