let actions = {
	updateCell: function(cellID, text) {
		return {
			type: 'UPDATE_CELL',
			id: cellID,
			content: text
		}
	},
	renderCell: function(cellID) {
		return {
			type: 'RENDER_CELL',
			id: cellID
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
	deleteCell: function(cellID) {
		return {
			type: 'DELETE_CELL',
			id: cellID
		}
	}
}

export default actions