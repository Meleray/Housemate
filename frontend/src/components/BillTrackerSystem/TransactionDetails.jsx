import { useParams, Link } from 'react-router-dom';
import { SLayout, SMain } from "../Layout/styles.js";
import Sidebar from "../Sidebar/Sidebar";
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min.js';
import PageTitle from '../Layout/PageTitle.jsx';
import { useState, useEffect, } from 'react';
import { router_auth, ApiGetTransactions, ApiConfirmTransaction } from '../../constants.js';
import { getSafe } from '../../utils.js';
import styled from 'styled-components';


const Divider = styled.div`
    width: 5px;
    background-color: #000;
    margin: 10px;
`;

const BackButton = styled(Link)`
    display: block;
    width: 200px;
    height: 100px;
    background-color: #2B7A78;
    color: #fff;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    text-align: center;
    line-height: 100px;
    font-size: 30px;
    margin: 30px auto;
    text-decoration: none;
`;

const Transaction = styled.div`
    width: 600px;
    max-width: 600px;
    bgcolor: background.paper;
    border: 2px solid #000;
    margin-top: 10px;
    overflow: auto;
`;

const TransactionText = styled.div`
    display: inline-block;
    overflow: hidden;
    font-size: 30px;
    font-weight: bold;
    text-align: center;
`;

const InboundButton = styled.button`
  width: 200px;
  height: 40px;
  background-color: ${props => (props.active ? '#fa7b0a' : 'grey')};
  color: #fff;
  border: none;
  border-radius: 10px;
  cursor: ${props => (props.active ? 'pointer' : 'default')};
  font-weight: bold;
  font-size: 25px;
`;

const OutboundButton = styled.button`
  width: 200px;
  height: 40px;
  background-color: ${props => (props.active ? 'red' : 'grey')};
  color: #fff;
  border: none;
  border-radius: 10px;
  cursor: ${props => (props.active ? 'pointer' : 'default')};
  font-weight: bold;
  font-size: 25px;
`;

const TransactionDetails = () => {
    const location = useLocation();
    const { memberId } = location.state || {};
    const { memberName } = useParams()

    const [transactions, setTransactions] = useState(null);
    const [expandedTransactions, setExpandedTransactions] = useState({});

    const fetchData = async () => {
        router_auth.post(ApiGetTransactions, {
            spaceId: getSafe(localStorage, 'spaceId'),
            userId: getSafe(localStorage, 'userId'),
            otherUserId: memberId
        }).then(response => {
            console.log(response.data);
            setTransactions(response.data);
        }).catch(error => {
            console.error('Error fetching transaction info:', error);
        })
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleConfirm = (paymentId) => {
        router_auth.post(ApiConfirmTransaction, {
            paymentId: paymentId,
            userId: getSafe(localStorage, 'userId')
        }).then(response => {
            fetchData();
        }).catch(error => {
            alert("Error confirming transaction!");
        })
    };

    const handleExpandTransaction = (transactionId) => {
        setExpandedTransactions((prevState) => ({
            ...prevState,
            [transactionId]: !prevState[transactionId],
        }));
    };

    return (
        <SLayout>
            <Sidebar />
            <p style={{ fontSize: '40px', fontWeight: 'bold', margin: '0', position: 'absolute', left: "45%" }}>Your transactions with {memberName}</p>
            <SMain style={{ width: "1300px", height: '85%', margin: '0', position: "absolute", top: "15%", left: "25%" }}>
                <div style={{ width: "600px", height: '80%', margin: '0', position: "absolute", top: "0%" }}>
                    <p style={{ fontSize: '30px', fontWeight: 'bold', margin: '0', top: "0%", position: 'absolute', left: "180px" }}>Sent requests</p>
                    <div style={{ overflowY: "scroll", position: 'absolute', top: "50px", width: "600px", maxHeight: "550px" }}>
                        {transactions?.inbound.map((transaction, index) => (
                            <Transaction
                                key={transaction._id}
                                style={{ marginTop: "15px", position: "relative", height: expandedTransactions[transaction._id] ? "170px" : "70px" }}
                                onClick={() => handleExpandTransaction(transaction._id)}
                            >
                                <TransactionText style={{ position: "absolute", left: "10px", top: "10px", maxWidth: "150px", overflowX: "auto" }}>{transaction.billId.name}</TransactionText>
                                <TransactionText style={{ color: "green", position: "absolute", left: "220px", top: "10px", maxWidth: "100px", overflowX: "auto" }}>+{transaction.paymentSum}€</TransactionText>
                                <InboundButton style={{ position: "absolute", left: "360px", top: "10px" }}
                                    active={transaction.senderConfirmation}
                                    onClick={() => transaction.senderConfirmation && handleConfirm(transaction._id)}
                                >
                                    {transaction.senderConfirmation ? 'Confirm' : 'Waiting'}
                                </InboundButton>
                                {
                                    expandedTransactions[transaction._id] && (
                                        <div style={{ position: "absolute", left: "10px", top: "60px" }}>
                                            <p style={{ fontSize: "16px" }}>{new Date(transaction.billId.date).toLocaleTimeString()}</p>
                                            <p style={{ fontSize: "16px" }}>{new Date(transaction.billId.date).toLocaleDateString()}</p>
                                            <p style={{ fontSize: "20px" }}>{transaction.billId.body}</p>
                                        </div>
                                    )
                                }
                            </Transaction>
                        ))}
                    </div>
                </div>
                <Divider style={{ left: "50%", position: "absolute", height: "80%", top: "0%" }} />
                <div style={{ width: "600px", height: '80%', margin: '0', position: "absolute", top: "0%", left: "700px" }}>
                    <p style={{ fontSize: '30px', fontWeight: 'bold', margin: '0', top: "0%", position: 'absolute', left: "180px" }}>Incoming requests</p>
                    <div style={{ overflowY: "scroll", position: 'absolute', top: "50px", width: "600px", maxHeight: "550px", left: "30px" }}>
                        {transactions?.outbound.map((transaction, index) => (
                            <Transaction 
                                key={transaction._id}
                                style={{ marginTop: "15px", position: "relative", height: expandedTransactions[transaction._id] ? "170px" : "70px"}}
                                onClick={() => handleExpandTransaction(transaction._id)}
                            >
                                <TransactionText style={{ position: "absolute", left: "10px", top: "10px", maxWidth: "150px", overflowX: "auto" }}>{transaction.billId.name}</TransactionText>
                                <TransactionText style={{ color: "red", position: "absolute", left: "220px", top: "10px", maxWidth: "100px", overflowX: "auto" }}>-{transaction.paymentSum}€</TransactionText>
                                <OutboundButton style={{ position: "absolute", left: "360px", top: "10px" }}
                                    active={!transaction.senderConfirmation}
                                    onClick={() => !transaction.senderConfirmation && handleConfirm(transaction._id)}
                                >
                                    {!transaction.senderConfirmation ? 'Pay' : 'Waiting'}
                                </OutboundButton>

                                {
                                    expandedTransactions[transaction._id] && (
                                        <div style={{ position: "absolute", left: "10px", top: "60px" }}>
                                            <p style={{ fontSize: "16px" }}>{new Date(transaction.billId.date).toLocaleTimeString()}</p>
                                            <p style={{ fontSize: "16px" }}>{new Date(transaction.billId.date).toLocaleDateString()}</p>
                                            <p style={{ fontSize: "20px" }}>{transaction.billId.body}</p>
                                        </div>
                                    )
                                }
                            </Transaction>
                        ))}
                    </div>
                </div>
                <BackButton to="/billtracker" style={{ bottom: "10px", position: "absolute", left: "560px" }}>Back</BackButton>
            </SMain>
        </SLayout >
    );
};

export default TransactionDetails;
