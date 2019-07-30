import PropTypes from "prop-types";

export const ValueSummaryPropTypes = PropTypes.shape({
  objType: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
  stringValue: PropTypes.string.isRequired,
  isTruncated: PropTypes.bool.isRequired,
  DESC_TYPE: PropTypes.oneOf(["ValueSummary"])
});

//

export const RangeDescriptorPropTypes = PropTypes.shape({
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
  DESC_TYPE: PropTypes.oneOf(["RangeDescriptor"])
});

//

export const ChildSummaryItemPropTypes = PropTypes.shape({
  path: PropTypes.oneOfType([PropTypes.string, RangeDescriptorPropTypes])
    .isRequired,
  summary: ValueSummaryPropTypes,
  DESC_TYPE: PropTypes.oneOf(["ChildSummaryItem"])
});

export const MapPairSummaryItemPropTypes = PropTypes.shape({
  path: PropTypes.number.isRequired,
  keySummary: ValueSummaryPropTypes,
  valueSummary: ValueSummaryPropTypes,
  DESC_TYPE: PropTypes.oneOf(["MapPairSummaryItem"])
});

export const SubstringRangeSummaryItemPropTypes = PropTypes.shape({
  path: RangeDescriptorPropTypes,
  summary: ValueSummaryPropTypes,
  DESC_TYPE: PropTypes.oneOf(["SubstringRangeSummaryItem"])
});

export const GenericChildSummaryItemPropTypes = PropTypes.oneOfType([
  ChildSummaryItemPropTypes,
  MapPairSummaryItemPropTypes,
  SubstringRangeSummaryItemPropTypes
]);

//

export const ChildSummaryPropTypes = PropTypes.shape({
  childItems: PropTypes.arrayOf(
    PropTypes.oneOfType([
      ChildSummaryItemPropTypes,
      MapPairSummaryItemPropTypes,
      SubstringRangeSummaryItemPropTypes
    ])
  ),
  DESC_TYPE: PropTypes.oneOf(["ChildSummary"])
});

export const PathLabelPropTypes = PropTypes.oneOfType([
  PropTypes.string,
  RangeDescriptorPropTypes
]);

export const PathToEntityPropTypes = PropTypes.arrayOf(PathLabelPropTypes);

export const TopLevelRepSummaryPropTypes = PropTypes.shape({
  repType: PropTypes.oneOf([
    "HTML_STRING",
    "ERROR_TRACE",
    "ROW_TABLE_REP",
    "DEFAULT_REP"
  ])
});
