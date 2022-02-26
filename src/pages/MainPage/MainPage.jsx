import {
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow} from '@mui/material'
import React, { useEffect, useState } from 'react'
import './MainPage.scss'
import axios from 'axios'
import Moment from 'react-moment'
import moment from 'moment'

function MainPage({favoriteCurr}) {

    const [favCurrData, setFavCurrData] = useState([])

    useEffect(() => {
        getRates()
    }, [])

    const copyToClipboard = (obj) => {
        navigator.clipboard.writeText(`${obj.Cur_Name} ${obj.Cur_OfficialRate}р на ${moment(obj.date).format('DD.MM.YY')}`)
    };

    const getRates = (code) => {
        if (!code) {
            return favoriteCurr.forEach(e => {
                axios.get(`https://www.nbrb.by/api/exrates/rates/${e.Cur_Code}?parammode=1`)
                    .then(res => setFavCurrData(favCurrData => favCurrData.concat({...e, date: res.data.Date, Cur_OfficialRate: res.data.Cur_OfficialRate})))
            })
        }

        axios.get(`https://www.nbrb.by/api/exrates/rates/${code}?parammode=1`)
            .then(res => {
                setFavCurrData(currencies => {
                    return currencies.map(curr => {
                        if (curr.Cur_Code == code) {
                            return {
                                ...curr,
                                date: res.data.Date,
                                Cur_OfficialRate: res.data.Cur_OfficialRate
                            }
                        }
                        return curr
                    })
                })
            })
    }

    return (
        <div className='app-inner'>
            <Paper>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Code</TableCell>
                            <TableCell>Rate</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {favCurrData && favCurrData.map((curr, i) => {
                            return <Row
                                key={i}
                                curr={curr}
                                onUpdate={(code) => getRates(code)}
                                copyToClipboard={copyToClipboard}
                            />})}
                    </TableBody>
                </Table>
            </Paper>
        </div>
    )
}

export default MainPage

const Row = ({curr, onUpdate, copyToClipboard}) => {
    return (
        <TableRow>
            <TableCell><Moment format='DD/MM/YY'>{curr.date}</Moment></TableCell>
            <TableCell>{curr.Cur_Name}</TableCell>
            <TableCell>{curr.Cur_Code}</TableCell>
            <TableCell>{curr.Cur_OfficialRate}</TableCell>
            <TableCell>
                <Button onClick={() => onUpdate(curr.Cur_Code)}>Update</Button>
                <Button onClick={() => copyToClipboard(curr)}>Copy</Button>
            </TableCell>
        </TableRow>
    )
}