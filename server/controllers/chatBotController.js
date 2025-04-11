const { Client } = require('@botpress/client');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');


const client = new Client({
    token: 'bp_pat_DW3y18TCbac1oMnR6vT8SfRjlv8vOY0aG899',
    botId: 'c560a319-46a8-4996-b25b-f11f6e920838',
    workspaceId: 'wkspace_01J62A0CQR0AFAGY23CT1GY1VP'
})



async function allTickets() {
    const { rows, limit, offset, count } = await client.findTableRows({
        table: 'Unanswered_QuestionsTable',
        limit: 50,
        offset: 0,
        filter: {},
        orderBy: 'row_id',
        orderDirection: 'asc'
    })
    return rows;
}


async function allActiveTickets() {
    const { rows, limit, offset, count } = await client.findTableRows({
        table: 'Unanswered_QuestionsTable',
        filter: {
            $or: [
                { active: true },
                { active: null }
            ]
        }
    })
    return rows;
}
async function allNonActiveTickets() {
    const { rows, limit, offset, count } = await client.findTableRows({
        table: 'Unanswered_QuestionsTable',
        filter: {
            active: false
        }
    })
    return rows;
}

exports.getAllActiveTickets = catchAsync(async (req, res, next) => {
    const rows = await allActiveTickets();
    // console.log(rows);
    if (!rows) {
        return next(new AppError('No ticket found with that ID', 404));
    }
    res.status(200).json({
        status: 'success',
        data: {
            rows
        }
    });
})

exports.getAllTickets = catchAsync(async (req, res, next) => {
    const row0 = await allActiveTickets();
    const rows1 = await allNonActiveTickets();
    const rows = [...row0, ...rows1];
    // console.log(rows);
    if (!rows) {
        return next(new AppError('No ticket found with that ID', 404));
    }
    res.status(200).json({
        status: 'success',
        data: {
            rows
        }
    });
})

exports.getTicketStats = catchAsync(async (req, res, next) => {
    const activeTick = await allActiveTickets();
    const allTick = await allTickets();
    // console.log();
    if (!allTick) {
        return next(new AppError('No ticket found with that ID', 404));
    }
    res.status(200).json({
        status: 'success',
        data: {
            allTick,
            activeTick
        }
    });
})

async function getOneTicket(cid) {
    const { rows, limit, offset, count } = await client.findTableRows({
        table: 'Unanswered_QuestionsTable',
        filter: {
            id: cid  // Filter for rows where `id` matches `cid`
        },
        limit: 1,  // Assuming you want only one row
        offset: 0
    })
    return rows;
}

exports.getTicketById = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const rows = await getOneTicket(parseInt(id, 10));
    if (!rows) {
        return next(new AppError('No ticket found with that ID', 404));
    }
    res.status(200).json({
        status: 'success',
        data: {
            rows
        }
    });
})

exports.updateTicket = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { rows, errors, warnings } = await client.updateTableRows({
        table: 'Unanswered_QuestionsTable',
        rows: [
            {
                id: parseInt(id, 10),
                Active: false,
                Answer: req.body.message,
            }
        ]
    })
    // console.log(rows);
    if (!rows) {
        return next(new AppError('No ticket found with that ID', 404));
    }
    res.status(200).json({
        status: 'success',
        data: {
            rows
        }
    });
})
