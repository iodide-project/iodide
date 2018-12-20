import { css } from 'emotion'
import styled from 'react-emotion'

const hoverSet = color => css`
a {
    text-decoration: none;
    color: ${color};
}

a:hover {
    text-decoration: none;
    color: purple;
}
`

export const List = styled('div')`
`

export const ListItem = styled('a')`
padding: 16px;
height: 30px;
display: flex;
text-decoration: none;
color: black;
border-bottom: 1px solid lightgray;

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
font-weight:bold;
color: gray
`
