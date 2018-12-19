import React from 'react'
import styled from 'react-emotion'

import { OutlineButton, ContainedButton } from '../../shared/components/buttons'

const SplashContentContainer = styled('div')`
margin:auto;
margin-bottom:40px;
`

const SingleSplash = styled('div')`
display:flex;
justify-content: middle;
`

const SplashTitle = styled('h1')`
margin-top:10px; 
margin-bottom: 40px; 
padding-bottom: 0px;
font-size:40px;
width: 600px;

sub {
  font-size:.6em;
  font-weight: 300;
}
`

const HighlightedTitle = styled('span')`
color: tomato;
`

const SplashCopy = styled('div')`
margin-bottom:60px;

`

const ButtonGroup = styled('div')`
margin:auto;
text-align:center;
margin-top:20px;
margin-bottom:60px;
`

const ThreePointsContainer = styled('div')`
margin-top:20px;
display: grid;
grid-template-columns: 1fr 1fr 1fr;
grid-template-rows: auto;
margin-bottom:60px;
`

const Point = styled('div')`
color: #8A7F8D;
line-height:1.4em;
padding-left:15px;
padding-right:15px;
`

const PointTitle = styled('h3')`
color: black;
margin:0;
margin-bottom:10px;
font-size:16px;
font-weight: normal;
`

const BottomDivider = styled('hr')`
border:none;
border-bottom:1px solid darkgray;
`

export default class SplashContent extends React.Component {
  render() {
    return (
      <SplashContentContainer>
        <SingleSplash>
          {/* <SplashImg width={100} src="https://camo.githubusercontent.com/b5dbd69518bd23f9eb2f9b722860e03d822fbcd6/68747470733a2f2f66696c65732e6769747465722e696d2f696f646964652d70726f6a6563742f696f646964652f7857314a2f696f646964652d737469636b65722d322e706e67" /> */}
          <SplashTitle>
            <HighlightedTitle>Iodide<sub>α</sub></HighlightedTitle> lets you do
            data science entirely in your browser.
          </SplashTitle>
        </SingleSplash>
        <SplashCopy>
          {'Create, share, collaborate, and reproduce powerful reports and visualizations with tools you already know.'}
        </SplashCopy>
        <ButtonGroup>
          <ContainedButton>Sign Up For Free</ContainedButton>
          <OutlineButton>Try It Out</OutlineButton>
          <OutlineButton>Docs</OutlineButton>
        </ButtonGroup>
        <ThreePointsContainer>
          <Point>
            <PointTitle>
              Bring the power of the web to your data analysis
            </PointTitle>
            Directly import and utilize the best-in-class visualization and UI tools in Javascript.
          </Point>
          <Point>
            <PointTitle>
              Combine Python, Javascript, Markdown, and CSS willy-nilly
            </PointTitle>
              Choose the right language for the task without ever leaving your notebook.
          </Point>
          <Point>
            <PointTitle>
              Share, remix, fork, and merge your work
            </PointTitle>
              Working with others is frictionless, innit?? blah blah blah blah blah
          </Point>
        </ThreePointsContainer>
        <BottomDivider />
      </SplashContentContainer>
    )
  }
}
