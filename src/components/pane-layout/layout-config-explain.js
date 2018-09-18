export default {
  settings: {
    showPopoutIcon: false,
    showCloseIcon: false,
    showMaximiseIcon: false,
  },
  dimensions: {
    dragProxyWidth: 300,
    dragProxyHeight: 0,
  },
  content: [{
    type: 'row',
    content: [
      {
        type: 'column',
        content: [
          {
            title: 'Editor',
            type: 'react-component',
            component: 'Positioner',
            props: { positionerId: 'EditorPositioner' },
            isClosable: false,
          },
          {
            type: 'stack',
            content: [
              {
                title: 'Console',
                type: 'react-component',
                component: 'Positioner',
                props: { positionerId: 'ConsolePositioner' },
                isClosable: false,
              },
              {
                title: 'Workspace',
                type: 'react-component',
                component: 'Positioner',
                props: { positionerId: 'WorkspacePositioner' },
                isClosable: false,
              },
              {
                title: 'App Info',
                type: 'react-component',
                component: 'Positioner',
                props: { positionerId: 'AppInfoPositioner' },
                isClosable: false,
              },
            ],
          },
        ],
      },
      {
        title: 'Report',
        type: 'react-component',
        component: 'Positioner',
        props: { positionerId: 'ReportPositioner' },
        isClosable: false,
      },
    ],
  }],
}
