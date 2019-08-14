import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "react-emotion";

import { storiesOf } from "@storybook/react";

import { AddNewFileSourceUnconnected } from "../add-new-file-source";
import { ContainedButton } from "../../../../../../shared/components/buttons";

import InProgress from "../in-progress";

const ManageFileSourcesStories = storiesOf("ManageFileSources", module);

const AddNewFileSourceStory = () => {
  const [addedSoFar, updateAddedSoFar] = useState([]);
  const [filename, setFilename] = useState("");
  const [URL, setURL] = useState("");
  const [interval, setInterval] = useState("never updates");
  // const [addFSState, addFileSourceGo] = useState(undefined);

  const addFileSource = async (a, b, c) => {
    updateAddedSoFar([...addedSoFar, [a, b, c]]);
    return "success";
  };
  return (
    <>
      <AddNewFileSourceUnconnected
        filename={filename}
        url={URL}
        updateInterval={interval}
        updateFileSourceInputUpdateInterval={setInterval}
        updateFileSourceInputURL={setURL}
        updateFileSourceInputFilename={setFilename}
        addFileSource={addFileSource}
      />
      <h3>added so far</h3>
      <table>
        <tr>
          <th>url</th>
          <th>filename</th>
          <th>frequency</th>
        </tr>
        {addedSoFar.map(([a, b, c]) => {
          return (
            <tr>
              <td>{a}</td>
              <td>{b}</td>
              <td>{c}</td>
            </tr>
          );
        })}
      </table>
    </>
  );
};

ManageFileSourcesStories.add("AddNewFileSource", () => {
  return <AddNewFileSourceStory />;
});

const Title = ({ children }) => {
  return <h2>{children}</h2>;
};

const MainContainer = styled.div`
  display: grid;
  grid-template-columns: 300px 300px;
  align-items: center;
`;

Title.propTypes = {
  children: PropTypes.element
};

const InProgressWrapper = styled.div`
  position: relative;
`;

const SpinningFalse = () => (
  <MainContainer>
    <Title>spinning=false</Title>
    <InProgressWrapper>
      <InProgress spinning={false}>
        <ContainedButton onClick={() => {}}>
          clicking will not work here
        </ContainedButton>
      </InProgress>
    </InProgressWrapper>
  </MainContainer>
);

const SpinningTrue = () => (
  <MainContainer>
    <Title>spinning=false</Title>
    <InProgressWrapper>
      <InProgress spinning>
        <ContainedButton onClick={() => {}}>Click this!!!!</ContainedButton>
      </InProgress>
    </InProgressWrapper>
  </MainContainer>
);

const OnOrOff = () => {
  const [spinning, setSpinning] = useState(false);
  function checkItOut() {
    setSpinning(true);
    setTimeout(() => {
      setSpinning(false);
    }, 4000);
  }
  return (
    <MainContainer>
      <Title>updates</Title>
      <InProgressWrapper>
        <InProgress spinning={spinning}>
          <ContainedButton onClick={checkItOut}>Click this!!!!</ContainedButton>
        </InProgress>
      </InProgressWrapper>
    </MainContainer>
  );
};

ManageFileSourcesStories.add("InProgress", () => {
  return (
    <>
      <h1>InProgress</h1>
      <p>
        This component is not to be used until it is better-conceived to be more
        catch-all.
      </p>
      <SpinningFalse />
      <SpinningTrue />
      <OnOrOff />
    </>
  );
});
