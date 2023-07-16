import React from "react";
import PageTitle from "../Layout/PageTitle";
import { SLayout, SMain } from "../Layout/styles.js";
import Sidebar from "../Sidebar/Sidebar";
import { router_auth, ApiBillTrackerMainInfo } from "../../constants";
import { useState, useEffect } from "react";
import { getSafe } from "../../utils";
import styled from "styled-components";
import Modal from '@mui/material/Modal';
import Button from '@material-ui/core/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { TextField, MenuItem, Select} from "@material-ui/core";

const MoneyScale = styled.div`
    width: 350px;
    height: 150px;
    background-color: background.paper;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 2px solid #000;
`;

const AddBill = styled.button`
    width: 250px;
    height: 150px;
    background-color: #2B7A78;
    color: #fff;
    border: none;
    border-radius: 10px;
    cursor: pointer;
`;

const ViewDetails = styled.button`
    width: 250px;
    height: 100px;
    background-color: #2B7A78;
    color: #fff;
    border: none;
    border-radius: 10px;
    cursor: pointer;
`;

const Slider = styled.div`
    width: 1500px;
    height: 500px;
    display: flex;
    overflow-x: auto;
    scroll-behavior: smooth;
`;

const UserProfile = styled.div`
    min-width: 350px;
    height: 500px;
    background-color: #ccc;
    display: flex;
    flex-direction: column;
    justify-content: top;
    align-items: center;
    padding: 10px;
    text-align: center;
`;

const AddBillForm = {
    position: 'absolute',
    top: '50%',
    left: '60%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    textAlign: 'center',
};

const BillTrackerPage = () => {

    const [mainInfo, setMainInfo] = useState(null);
    const [openForm, setOpenForm] = useState(false);
    const [billName, setBillName] = useState('');
    const [billDescription, setBillDescription] = useState('');
    const [billSplit, setbillSplit] = useState('Equal');
    const [totalSum, setTotalSum] = useState(0);
    const [amounts, setAmounts] = useState({});


    const handleOpenForm = () => setOpenForm(true);
    const handleCloseForm = () => setOpenForm(false);

    useEffect(() => {

        const fetchData = async () => {
            router_auth.post(ApiBillTrackerMainInfo, {
                spaceId: getSafe(localStorage, 'spaceId'),
            }).then(response => {
                setMainInfo(response.data);
            }).catch(error => {
                console.error('Error fetching bill tracker main data:', error);
            })
        };

        fetchData();
    }, []);

    const handleAddBill = async (event) => {
        event.preventDefault();

        if (billSplit === 'Advanced') {
            const sum = amounts.reduce((acc, amount) => acc + Number(amount.amount), 0);
            setTotalSum(sum);
        }


        console.log('Form values:', {
            billName,
            billDescription,
            billSplit,
            totalSum,
            amounts,
        });
    }

    const renderAdvancedFields = () => {
        if (billSplit === 'Advanced') {
          return mainInfo?.memberBalance.map((member) => (
            <TextField
                key={member.name}
                label={member.name}
                type="number"
                value={amounts[member.id] || ''}
                onChange={(e) => handleAmountChange(member.id, e.target.value)}
                fullWidth
            />
          ));
        }
        return null;
      };
    
    const handleAmountChange = (id, value) => {
        setAmounts((prevAmounts) => ({
            ...prevAmounts,
            [id]: Number(value),
        }));
    };

    return (
        <SLayout>
            <Sidebar />
            <SMain>
                <div style={{ display: 'flex', marginBottom: '20px' }}>
                    <MoneyScale style={{ left: '50px', top: '50px', position: 'relative' }}>
                        <p style={{ fontSize: '30px', fontWeight: 'bold', color: 'green', margin: '0' }}>Owed to you</p>
                        <p style={{ fontSize: '40px', color: 'green', margin: '0' }}>+{mainInfo?.inboundSum || 0}€</p>
                        {mainInfo?.inboundOutstandingSum !== 0 && (<p style={{ fontSize: '15px', color: '#fa7b0a', margin: '0' }}>Unconfirmed transactions:+{mainInfo?.inboundOutstandingSum || 0}€</p>)}
                    </MoneyScale>
                    <MoneyScale style={{ marginLeft: '20px', left: '50px', top: '50px', position: 'relative' }}>
                        <p style={{ fontSize: '30px', fontWeight: 'bold', color: 'red', margin: '0' }}>You owe</p>
                        <p style={{ fontSize: '40px', color: 'red', margin: '0' }}>-{mainInfo?.outboundSum || 0}€</p>
                        {mainInfo?.outboundOutstandingSum !== 0 && (<p style={{ fontSize: '15px', color: '#fa7b0a', margin: '0' }}>Unconfirmed transactions:-{mainInfo?.outboundOutstandingSum || 0}€</p>)}
                    </MoneyScale>
                    <MoneyScale style={{ marginLeft: '20px', left: '50px', top: '50px', position: 'relative' }}>
                        <p style={{ fontSize: '30px', fontWeight: 'bold', margin: '0' }}>Total Balance</p>
                        <p style={{ fontSize: '40px', color: mainInfo?.inboundSum >= mainInfo?.outboundSum ? 'green' : 'red', margin: '0' }}>{mainInfo?.inboundSum >= mainInfo?.outboundSum ? `+${mainInfo?.inboundSum - mainInfo?.outboundSum}` : mainInfo?.inboundSum - mainInfo?.outboundSum}€</p>
                        {(mainInfo?.inboundOutstandingSum !== 0 || mainInfo?.outboundOutstandingSum !== 0) && (<p style={{ fontSize: '15px', color: '#fa7b0a', margin: '0' }}>Unconfirmed transactions: {mainInfo?.inboundOutstandingSum >= mainInfo?.outboundOutstandingSum ? `+${mainInfo?.inboundOutstandingSum - mainInfo?.outboundOutstandingSum}` : mainInfo?.inboundOutstandingSum - mainInfo?.outboundOutstandingSum}€</p>)}
                    </MoneyScale>
                    <AddBill onClick={handleOpenForm} style={{ marginLeft: '70px', left: '50px', top: '50px', position: 'relative', fontWeight: 'bold', fontSize: '40px', }}>Add Bill</AddBill>
                    <Modal
                        open={openForm}
                        onClose={handleCloseForm}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={AddBillForm}>
                            <Typography id="modal-modal-title" variant="h6" component="h2" style={{ fontSize: '30px', fontWeight: 'bold' }}>
                                New Bill Information
                            </Typography>
                            <form onSubmit={handleAddBill}>
                                <TextField
                                    label="Bill Name"
                                    value={billName}
                                    onChange={(e) => setBillName(e.target.value)}
                                    inputProps={{ maxLength: 100 }}
                                    fullWidth
                                    required
                                />
                                <Typography variant="body2" color="textSecondary">
                                    {billName.length}/100
                                </Typography>

                                <TextField
                                    label="Bill Description"
                                    value={billDescription}
                                    onChange={(e) => setBillDescription(e.target.value)}
                                    inputProps={{ maxLength: 500 }}
                                    fullWidth
                                    multiline
                                    rows={4}
                                />
                                <Typography variant="body2" color="textSecondary">
                                    {billDescription.length}/500
                                </Typography>

                                <Typography variant="subtitle1" component="label" htmlFor="distribution-schema" style={{fontSize: '20px', fontWeight: 'bold', margin: '0', }}>
                                Bill split method
                                </Typography>

                                <Select value={billSplit} onChange={(e) => setbillSplit(e.target.value)} fullWidth>
                                    <MenuItem value="Equal">Equal Split</MenuItem>
                                    <MenuItem value="Advanced">Customizable Split</MenuItem>
                                </Select>

                                {renderAdvancedFields()}

                                { billSplit == 'Equal' && <TextField
                                    label="TotalSum"
                                    value={totalSum}
                                    onChange={(e) => {
                                        setTotalSum(Number(e.target.value));
                                    }}
                                    type="number"
                                    fullWidth
                                    required
                                /> }
                                <div style={{ display: 'flex', gap: '175px', marginTop: '30px' }}>
                                    <Button type="submit" >Add Bill</Button>
                                    <Button onClick={handleCloseForm}>Cancel</Button>
                                </div>
                            </form>
                        </Box>
                    </Modal>
                </div>
                <Slider style={{ left: '50px', top: '100px', position: 'relative' }}>
                    {mainInfo?.memberBalance.map((member) => (
                        <UserProfile style={{ position: 'relative', marginRight: '20px' }} key={member.name}>
                            <p style={{ position: 'absolute', top: '10px', fontSize: '30px', fontWeight: 'bold', maxWidth: '300px', maxHeight: '100px' }}>{member.name}</p>
                            {(member.inboundOutstanding !== 0 || member.outboundOutstanding !== 0) && (<p style={{ fontSize: '20px', color: '#fa7b0a', margin: '0', top: '100px', position: 'absolute'}}>Transactions awaiting confirmation!</p>)}
                            <p style={{ fontSize: '25px', color: 'green', margin: '0', maxHeight: '10px', top: '200px', position: 'absolute'}}>Owed to you: +{member?.inbound || 0}€</p>
                            <p style={{ fontSize: '25px', color: 'red', margin: '0', maxHeight: '10px', top: '250px', position: 'absolute'}}>You owe: -{member?.outbound || 0}€</p>
                            <ViewDetails style={{ fontSize: '30px', bottom: '30px', margin: '0', position: "absolute" }}>View Details</ViewDetails>
                        </UserProfile>
                    ))}
                </Slider>
            </SMain>
        </SLayout>
    );
};

export default BillTrackerPage;