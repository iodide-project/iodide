import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "@emotion/styled";

import { storiesOf } from "@storybook/react";

import { ContainedButton } from "../../../../../../shared/components/buttons";

import InProgress from "../in-progress";

const ManageFileSourcesStories = storiesOf("ManageFileSources", module);

// FIXME: re-implement the `AddNewFileSourceUnconnected` story
// when we have removed the unnecessary Redux state and put
// local state back into this. I will leave this story commented out
// for future reference when someone circles back on this task.
// const AddNewFileSourceStory = () => {
//   const [addedSoFar, updateAddedSoFar] = useState([]);
//   const [filename, setFilename] = useState("cool.csv");
//   const [url, setURL] = useState("https://whatever.edu");
//   const [updateInterval, setUpdateInterval] = useState("never updates");
//   const [statusMessage, updateStatusMessage] = useState("");
//   const [statusType, updateStatusType] = useState("NONE");

//   const clearUpdateStatus = () => {};

//   const addFileSource = async (f, u, i) => {
//     updateAddedSoFar([
//       ...addedSoFar,
//       { filename: f, url: u, updateInterval: i }
//     ]);
//     return "success";
//   };

//   return (
//     <>
//       <AddNewFileSourceUnconnected
//         filename={filename}
//         url={url}
//         updateInterval={updateInterval}
//         statusMessage={statusMessage}
//         statusType={statusType}
//         updateUpdateInterval={setUpdateInterval}
//         updateURL={setURL}
//         updateFilename={setFilename}
//         updateStatusMessage={updateStatusMessage}
//         updateStatusType={updateStatusType}
//         addFileSource={addFileSource}
//         clearUpdateStatus={clearUpdateStatus}
//       />
//       <h3>added so far</h3>
//       <table>
//         <tr>
//           <th>url</th>
//           <th>filename</th>
//           <th>frequency</th>
//         </tr>
//         {addedSoFar.map(({ filename: f, url: u, updateInterval: i }) => {
//           return (
//             <tr>
//               <td>{f}</td>
//               <td>{u}</td>
//               <td>{i}</td>
//             </tr>
//           );
//         })}
//       </table>
//     </>
//   );
// };

// ManageFileSourcesStories.add("AddNewFileSource", () => {
//   return <AddNewFileSourceStory />;
// });

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
        NOTE: avoid using this component for the time being. It does not
        generalize well.
      </p>
      <SpinningFalse />
      <SpinningTrue />
      <OnOrOff />
    </>
  );
});
