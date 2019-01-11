import React from 'react'
import styled from 'react-emotion'

import EmptyPaneContents from './empty-pane-contents'

const OnboardingContentContainer = styled(EmptyPaneContents)`
font-size: 14px;
font-weight: normal;
color: black;
`

const ThreeElements = styled('div')`
display: grid;
grid-template-columns: 1fr 1fr 1fr;
grid-column-gap: 30px;
`

const OnboardingHeader = styled('h1')`
font-weight: 300;`
const Element = styled('div')``
const ElementTitle = styled('h2')`
font-weight: 300;`
const ElementBody = styled('div')``

const OnboardingLink = styled('a')`
text-decoration: none;
display: block;

:hover {
  text-decoration: underline;
}
`

export default class OnboardingContent extends React.Component {
  render() {
    return (
      <OnboardingContentContainer>
        <OnboardingHeader>Welcome to Iodide!</OnboardingHeader>

        Here are three ways to get started.

        <ThreeElements>
          <Element>
            <ElementTitle>
                Fork an Example
            </ElementTitle>
            <ElementBody>
              <OnboardingLink>Pyodide starter</OnboardingLink>
              <OnboardingLink>Dashboard starter</OnboardingLink>
              <OnboardingLink>Examples Gallery</OnboardingLink>

            </ElementBody>
          </Element>
          <Element>
            <ElementTitle>
                Read a Tutorial
            </ElementTitle>
            <ElementBody>
              <OnboardingLink>A Tour Through Iodide</OnboardingLink>
              <OnboardingLink>How to use other libraries</OnboardingLink>
              <OnboardingLink>How to use files in your notebook</OnboardingLink>
              <OnboardingLink>How to use Python</OnboardingLink>

            </ElementBody>
          </Element>
          <Element>
            <ElementTitle>
                Check the Docs
            </ElementTitle>
            <ElementBody>
              <OnboardingLink>JSMD glossary</OnboardingLink>
              <OnboardingLink>Iodide API</OnboardingLink>
              <OnboardingLink>Pyodide API</OnboardingLink>
            </ElementBody>
          </Element>
        </ThreeElements>
      </OnboardingContentContainer>
    )
  }
}
