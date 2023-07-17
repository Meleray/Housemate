import React from "react";
import PageTitle from "../Layout/PageTitle";
import { SLayout, SMain } from "../Layout/styles.js";
import Sidebar from "../Sidebar/Sidebar";
import { router_auth, ApiBillTrackerMainInfo, ApiAddBill } from "../../constants";
import { useState, useEffect } from "react";
import { getSafe } from "../../utils";
import styled from "styled-components";
import Modal from '@mui/material/Modal';
import Button from '@material-ui/core/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { TextField, MenuItem, Select } from "@material-ui/core";

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
    display: flex;
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
    maxHeight: '80%',
};

const BillTrackerPage = () => {

    const [mainInfo, setMainInfo] = useState(null);
    const [openForm, setOpenForm] = useState(false);
    const [billName, setBillName] = useState('');
    const [billDescription, setBillDescription] = useState('');
    const [billSplit, setbillSplit] = useState('Equal');
    const [totalSum, setTotalSum] = useState('');
    const [payments, setPayments] = useState([]);


    const handleOpenForm = () => {
        if (mainInfo?.memberBalance.length == 0) {
            alert("You are alone in this space. Please add more users to create bills")
        } else {
            setOpenForm(true);
        }
    }

    const resetValues = () => {
        setBillName('');
        setbillSplit('Equal');
        setPayments([]);
        setTotalSum('');
        setBillDescription('');
    }

    const handleCloseForm = () => {
        setOpenForm(false, resetValues);
    }

    const fetchData = async () => {
        router_auth.post(ApiBillTrackerMainInfo, {
            spaceId: getSafe(localStorage, 'spaceId'),
        }).then(response => {
            setMainInfo(response.data);
        }).catch(error => {
            console.error('Error fetching bill tracker main data:', error);
        })
    };

    useEffect(() => {
        fetchData();
    }, []);

    function checkValues() {
        const floatRegex = /^\d+(\.\d{1,2})?$/;
        if (billSplit === 'Advanced') {
            for (const payment of payments) {
                if (!floatRegex.test(payment.amount)) {
                    return false;
                }
            }
        } else {
            if (!floatRegex.test(totalSum)) {
                return false;
            }
        }
        return true;
    }

    const handleAddBill = async (event) => {
        event.preventDefault();
        if (checkValues()) {
            let curr_totalSum = Number(parseFloat(totalSum));
            let new_payments = [];
            if (billSplit === 'Advanced') {
                payments.map((payment) => {
                    new_payments.push({
                        ...payment, 
                        amount: Number(parseFloat(payment.amount))
                    })
                })

                const sum = new_payments.reduce((acc, payment) => acc + payment.amount, 0);
                curr_totalSum = Number(sum);
            }
            console.log({
                userId: getSafe(localStorage, 'userId'),
                spaceId: getSafe(localStorage, 'spaceId'),
                isEqualSplit: (billSplit === 'Equal'),
                billName: billName,
                totalSum: curr_totalSum,
                payments: new_payments,
                billDescription: billDescription,
            })
            router_auth.post(ApiAddBill, {
                userId: getSafe(localStorage, 'userId'),
                spaceId: getSafe(localStorage, 'spaceId'),
                isEqualSplit: (billSplit === 'Equal'),
                billName: billName,
                totalSum: curr_totalSum,
                payments: new_payments,
                billDescription: billDescription,
            }).then(response => {
                alert("Bill added sucessfully!");
                fetchData();
                handleCloseForm();
            }).catch(error => {
                console.error('Error adding bill:', error);
                alert("Error addding bill!");
            })
        } else {
            alert("Invalid amounts entered!");
        }
    }

    const renderAdvancedFields = () => {
        if (billSplit === 'Advanced') {
            return payments?.map((payment, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px'}}>
                    <Select
                        value={payment.name}
                        onChange={(e) => handleSelectorChange(index, e.target.value)}
                        fullWidth
                        renderValue={(selectedValue) => {
                            const selectedMember = mainInfo?.memberBalance.find((member) => member.name === selectedValue);
                            return selectedMember ? selectedMember.name : '';
                        }}
                    >
                        {mainInfo?.memberBalance.map((member) => (
                            <MenuItem key={member.id} value={member}>
                                {member.name}
                            </MenuItem>
                        ))}
                    </Select>

                    <TextField
                        label="Amount"
                        value={payment.amount}
                        onChange={(e) => handleAmountChange(index, e.target.value)}
                        fullWidthpayment
                        required
                    />
                </Box>
            ));
        }
        return null;
    };

    const handleSelectorChange = (index, member) => {
        setPayments((prevAmounts) => {
            const updatedPayments = [...prevAmounts];
            updatedPayments[index] = { ...prevAmounts[index], name: member.name, id: member.id };
            return updatedPayments;
        });
    };

    const handleAmountChange = (index, value) => {
        setPayments((prevAmounts) => {
            const updatedPayments = prevAmounts.map((payment, i) => (i === index ? { ...payment, amount: value} : payment));
            return updatedPayments;
        });
    };

    const handleAddField = () => {
        setPayments((prevAmounts) => [...prevAmounts, { id: '', name: '', amount: '' }]);
    };

    const handleRemoveField = () => {
        if (payments.length > 0) {
            setPayments((prevAmounts) => prevAmounts.slice(0, -1));
        }
    };

    return (
        <SLayout>
            <Sidebar />
            <SMain>
                <div style={{ display: 'flex', marginBottom: '20px' }}>
                    <MoneyScale style={{ left: '50px', top: '50px', position: 'relative' }}>
                        <p style={{ fontSize: '30px', fontWeight: 'bold', color: 'green', margin: '0' }}>Owed to you</p>
                        <p style={{ fontSize: '40px', color: 'green', margin: '0' }}>+{Number(mainInfo?.inboundSum).toFixed(2) || 0}€</p>
                        {mainInfo?.inboundOutstandingSum !== 0 && (<p style={{ fontSize: '15px', color: '#fa7b0a', margin: '0' }}>Unconfirmed transactions:+{Number(mainInfo?.inboundOutstandingSum).toFixed(2) || 0}€</p>)}
                    </MoneyScale>
                    <MoneyScale style={{ marginLeft: '20px', left: '50px', top: '50px', position: 'relative' }}>
                        <p style={{ fontSize: '30px', fontWeight: 'bold', color: 'red', margin: '0' }}>You owe</p>
                        <p style={{ fontSize: '40px', color: 'red', margin: '0' }}>-{Number(mainInfo?.outboundSum).toFixed(2) || 0}€</p>
                        {mainInfo?.outboundOutstandingSum !== 0 && (<p style={{ fontSize: '15px', color: '#fa7b0a', margin: '0' }}>Unconfirmed transactions:-{Number(mainInfo?.outboundOutstandingSum).toFixed(2) || 0}€</p>)}
                    </MoneyScale>
                    <MoneyScale style={{ marginLeft: '20px', left: '50px', top: '50px', position: 'relative' }}>
                        <p style={{ fontSize: '30px', fontWeight: 'bold', margin: '0' }}>Total Balance</p>
                        <p style={{ fontSize: '40px', color: mainInfo?.inboundSum >= mainInfo?.outboundSum ? 'green' : 'red', margin: '0' }}>{mainInfo?.inboundSum >= mainInfo?.outboundSum ? `+${Number(mainInfo?.inboundSum - mainInfo?.outboundSum).toFixed(2)}` : Number(mainInfo?.inboundSum - mainInfo?.outboundSum).toFixed(2)}€</p>
                        {(mainInfo?.inboundOutstandingSum !== 0 || mainInfo?.outboundOutstandingSum !== 0) && (<p style={{ fontSize: '15px', color: '#fa7b0a', margin: '0' }}>Unconfirmed transactions: {mainInfo?.inboundOutstandingSum >= mainInfo?.outboundOutstandingSum ? `+${Number(mainInfo?.inboundOutstandingSum - mainInfo?.outboundOutstandingSum).toFixed(2)}` : Number(mainInfo?.inboundOutstandingSum - mainInfo?.outboundOutstandingSum).toFixed(2)}€</p>)}
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

                                <Typography variant="subtitle1" component="label" htmlFor="distribution-schema" style={{ fontSize: '20px', fontWeight: 'bold', margin: '0', }}>
                                    Bill split method
                                </Typography>

                                <Select value={billSplit} onChange={(e) => setbillSplit(e.target.value)} fullWidth>
                                    <MenuItem value="Equal">Equal Split</MenuItem>
                                    <MenuItem value="Advanced">Customizable Split</MenuItem>
                                </Select>

                                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                {renderAdvancedFields()}
                                </div>

                                {billSplit === 'Advanced' && (
                                    <>
                                        <Button variant="outlined" onClick={handleAddField}>Add Recepient</Button>
                                        <Button variant="outlined" onClick={handleRemoveField}>Remove Recepient</Button>
                                    </>
                                )}

                                {billSplit === 'Equal' && <TextField
                                    label="TotalSum"
                                    value={totalSum}
                                    onChange={(e) => {
                                        setTotalSum(e.target.value);
                                    }}
                                    fullWidth
                                    required
                                />}
                                <div style={{ display: 'flex', gap: '175px', marginTop: '30px' }}>
                                    <Button type="submit" >Add Bill</Button>
                                    <Button onClick={handleCloseForm}>Cancel</Button>
                                </div>
                            </form>
                        </Box>
                    </Modal>
                </div>
                <Slider style={{ left: '50px', top: '100px', position: 'relative', width: '1500px', height: '500px', overflowX: 'auto'}}>
                    {mainInfo?.memberBalance.map((member) => (
                        <UserProfile style={{ position: 'relative', marginRight: '20px' }} key={member.name}>
                            <p style={{ position: 'absolute', top: '10px', fontSize: '30px', fontWeight: 'bold', maxWidth: '300px', maxHeight: '100px' }}>{member.name}</p>
                            {(member.inboundOutstanding !== 0 || member.outboundOutstanding !== 0) && (<p style={{ fontSize: '20px', color: '#fa7b0a', margin: '0', top: '100px', position: 'absolute' }}>Transactions awaiting confirmation!</p>)}
                            <p style={{ fontSize: '25px', color: 'green', margin: '0', maxHeight: '10px', top: '200px', position: 'absolute' }}>Owed to you: +{Number(member?.inbound).toFixed(2) || 0}€</p>
                            <p style={{ fontSize: '25px', color: 'red', margin: '0', maxHeight: '10px', top: '250px', position: 'absolute' }}>You owe: -{Number(member?.outbound).toFixed(2) || 0}€</p>
                            <ViewDetails style={{ fontSize: '30px', bottom: '30px', margin: '0', position: "absolute" }}>View Details</ViewDetails>
                        </UserProfile>
                    ))}
                </Slider>
            </SMain>
        </SLayout >
    );
};

export default BillTrackerPage;