const {db} = require('../models/database')

const TABLE = {
    columns: [
        {
            header: "Type",
            width: 10
        },
        {
            header: "Name",
            width: 20
        },
        {
            header: "Votes",
            width: 10
        },
        {
            header: "Date Requested",
            width: 30
        }
    ]
}

function create_table() {
    var table = "```"

    // Add Headers
    TABLE.columns.forEach((col, i) => {
        if (i > 0) table += "| "
        table += col.header.padEnd(col.width)
    })
    table += "\n--------------------------------------------------------------------\n" 
    return table
}

function add_row(table, ...values){
    values.forEach((value, i) => {
        if (i > 0) table += "| "
        table += `${value}`.padEnd(TABLE.columns[i].width)
    })
    return table + "\n"
}

function end_table(table){
    table += "```"
    return table
}

module.exports = () => {
    var table = create_table()
		
    const get = db.prepare('SELECT * FROM Requests');
    const rows = get.all()
    rows.forEach((row, i) => {
        var date = new Date(row.Date).toDateString()
        table = add_row(table, row.Type, row.Name, row.Votes, date)
    })

    table = end_table(table)

    return table
}