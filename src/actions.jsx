let actions = {
	updateCell: function(cellID, text) {
		return {
			type: 'UPDATE_CELL',
			id: cellID,
			content: text
		}
	},
	changeCellType: function(cellID, cellType) {
		return {
			type: 'CHANGE_CELL_TYPE',
			id: cellID,
			cellType: cellType
		}
	},
	renderCell: function(cellID, renderMode=true) {
		return {
			type: 'RENDER_CELL',
			id: cellID,
			render: renderMode
		}
	},
	cellUp: function(cellID) {
		return {
			type: 'CELL_UP',
			id: cellID
		}
	},
	cellDown: function(cellID) {
		return {
			type: 'CELL_DOWN',
			id: cellID
		}
	},
	addCell: function(cellType) {
		return {
			type: 'ADD_CELL',
			cellType: cellType
		}
	},
	selectCell: function(cellID) {
		return {
			type: 'SELECT_CELL',
			id: cellID
		}
	},
	deleteCell: function(cellID) {
		return {
			type: 'DELETE_CELL',
			id: cellID
		}
	}
}

export default actions