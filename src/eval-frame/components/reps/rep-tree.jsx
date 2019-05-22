import React from "react";
import styled from "react-emotion";
import PropTypes from "prop-types";
import InlineChildSummary from "./in-line-child-summary";

import ValueSummary, { RepBaseText } from "./value-summary";

export const SubPathsContainer = styled("div")`
  border-left: 1px solid red;
  margin-left: 5px;
`;

const ExpanderArrow = ({ expanded }) => (expanded ? "-" : "+");
ExpanderArrow.propTypes = {
  expanded: PropTypes.bool.isRequired
};

export class PathIdentifierRep extends React.Component {
  static propTypes = {
    pathItem: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
  };
  render() {
    if (typeof this.props.pathItem === "string") {
      return <RepBaseText>this.props.pathItem</RepBaseText>;
    }
    const { min, max } = this.props.pathItem;
    return <RepBaseText>{`[${min}⋯${max}`}</RepBaseText>;
  }
}

const objSummaryShape = PropTypes.shape({
  objType: PropTypes.string.isRequired,
  objClass: PropTypes.string.isRequired,
  size: PropTypes.number,
  stringValue: PropTypes.string.isRequired,
  isTruncated: PropTypes.bool.isRequired
});

export default class ExpandableRep extends React.Component {
  static propTypes = {
    pathToEntity: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    valueSummary: objSummaryShape,
    getChildSummaries: PropTypes.func,
    rootObjName: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.toggleExpand = this.toggleExpand.bind(this);
  }
  state = {
    childSummaries: null,
    expanded: false
  };

  async componentDidMount() {
    // on mount, get the array of childSummaries for this entity
    // in compact form. this array of {path, summary} objs
    // can be used for in-line summaries where applicable.
    const { rootObjName, pathToEntity } = this.props;
    const childSummaries = await this.props.getChildSummaries(
      rootObjName,
      pathToEntity
    );

    // this following lint rule is controversial. the react docs *advise*
    // loading data in compDidMount, and explicitly say calling
    // setState is ok if needed. Disabling lint rule is justified.
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({ childSummaries });
  }

  async toggleExpand() {
    // on toggleExpand, update the childSummaries in the
    // compact/non-compact form as needed
    const { rootObjName, pathToEntity } = this.props;
    const childSummaries = await this.props.getChildSummaries(
      rootObjName,
      pathToEntity,
      !this.state.expanded
    );
    this.setState({ expanded: !this.state.expanded, childSummaries });
  }

  render() {
    const {
      pathToEntity,
      valueSummary,
      getChildSummaries,
      rootObjName
    } = this.props;
    const { expanded, childSummaries } = this.state;
    const pathItem = pathToEntity[pathToEntity.length - 1];

    const pathLabel =
      pathToEntity.length > 1 ? <PathIdentifierRep pathItem={pathItem} /> : "";

    // leaf node: no child childItems
    // if (
    //   childSummaries === null ||
    //   childSummaries.summaryType === "NO_SUBPATHS"
    // ) {
    //   return (
    //     <div>
    //       {/* <PathIdentifierRep pathItem={pathItem} /> */}
    //       <ValueSummary serializedObj={valueSummary} />
    //     </div>
    //   );
    // }

    const expanderArrow = <ExpanderArrow {...{ expanded }} />;

    // const childItems = expanded ? (
    //   <SubPathsContainer>
    //     {childSummaries.childItems.map(({ path, summary }) => {
    //       return (
    //         <React.Fragment>
    //           <ExpandableRep
    //             valueSummary={summary}
    //             pathToEntity={[pathToEntity, path]}
    //             {...{ getChildSummaries, rootObjName }}
    //           />
    //         </React.Fragment>
    //       );
    //     })}
    //   </SubPathsContainer>
    // ) : (
    //   ""
    // );

    return (
      <div>
        <div onClick={this.toggleExpand}>
          {expanderArrow}
          {pathLabel}
          <ValueSummary {...valueSummary} />
          <InlineChildSummary {...childSummaries} />
        </div>
        {/* {childItems} */}
      </div>
    );
  }
}
