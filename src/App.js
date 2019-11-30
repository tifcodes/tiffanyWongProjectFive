import React, { Component } from 'react';
import "./styles/style.scss"

import Header from "./Header"
import dbRef from './firebase'

class App extends Component {
  constructor() {
    super();
    this.state = {
      transactionList: [],
      incomeTotal: [],
      expenseTotal: [],
      incomeArray: [],
      expenseArray: [],
      userInput: "",
      amount: "",
      type: "",
      selectedValue: "",
    }
  }

  componentDidMount() {

    dbRef.on("value", (snapshot) => {
      const transaction = snapshot.val();

      const newTransaction = [];
      const newIncomeArray = [];
      const newExpenseArray = [];
      const newIncomeTotal = [];
      const newExpenseTotal = [];

      for (let i in transaction) {
        const individualTransactions = {
          transactionKey: i,
          transactionObject: transaction[i],
        }
        newTransaction.push(individualTransactions)

        if (individualTransactions.transactionObject.type === "income") {
          newIncomeArray.push(individualTransactions.transactionObject.amount)
          const newIncome = newIncomeArray.reduce((a, b) => parseInt(a) + parseInt(b), 0)
          newIncomeTotal.push(newIncome)
        }

        if (individualTransactions.transactionObject.type === "expense") {
          newExpenseArray.push(individualTransactions.transactionObject.amount)
          const newExpense = newExpenseArray.reduce((a, b) => parseInt(a) + parseInt(b), 0)
          newExpenseTotal.push(newExpense)
        }
      }

      this.setState({
        transactionList: newTransaction,
        incomeArray: newIncomeArray,
        expenseArray: newExpenseArray,
        incomeTotal: newIncomeTotal,
        expenseTotal: newExpenseTotal
      })
    })
  }

  handleChangeType = (event) => {
    this.setState({
      type: event.target.value
    })
  }

  handleUserInputChange = (event) => {
    this.setState({
      userInput: event.target.value,
    })
  }

  handleAmountChange = (event) => {
    this.setState({
      amount: event.target.value,
    })
  }

  handleSubmit = (event) => {
    event.preventDefault();

    const transactionToBeAdded = {
      userInput: this.state.userInput,
      amount: this.state.amount,
      type: this.state.type
    }

    if (transactionToBeAdded.userInput !== "" && transactionToBeAdded.amount !== "" && transactionToBeAdded.type !== "") {
      dbRef.push(transactionToBeAdded)
      this.setState({
        userInput: "",
        amount: "",
        type: ""
      })
    }
  }

  handleDelete = (event) => {
    dbRef.child(event.target.id).remove();
  }

  /* <h4> Total : {this.state.incomeArray.reduce((a, b) => parseInt(a) + parseInt(b), 0)} </h4> */

  handleAdd = (array) => {
    const totalIncome = array.reduce((a, b) => parseInt(a) + parseInt(b), 0)

    console.log(totalIncome)

    // this.setState({
    //   total: totalIncome,
    // })
  }


  render() {
    const finalIncomeTotal = this.state.incomeTotal.pop();
    const finalExpenseTotal = this.state.expenseTotal.pop();
    const finalTotal = finalIncomeTotal - finalExpenseTotal;
    return (
      <div className="wrapper">
        <Header />
        <select onChange={this.handleChangeType} value={this.state.value}>
          <option value=""> select </option>
          <option value="income"> income </option>
          <option value="expense"> expense </option>
        </select>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="transactionType"></label>
          <input id="transactionType" type="text" value={this.state.userInput} onChange={this.handleUserInputChange} />
          <label htmlFor="transactionAmount"></label>
          <input id="transactionAmount" type="number" value={this.state.amount} onChange={this.handleAmountChange} />
          <button type="submit"> Add Transaction to List</button>
        </form>
        <div className="flexParent">
          <div>
            <h2> Income </h2>
            <ul>
              {this.state.transactionList.map((transaction, i) => {
                const isType = transaction.transactionObject.type === "income"
                return (
                  (isType) ?

                    <li key={i}> <i className="fa fa-minus-circle" id={transaction.transactionKey} onClick={this.handleDelete}> </i>{transaction.transactionObject.userInput
                    } {transaction.transactionObject.amount} </li>

                    : null
                )
              })}
            </ul>
            <h4> Total : {finalIncomeTotal} </h4>
          </div>
          <div>
            <h2> Expenses </h2>
            <ul>
              {this.state.transactionList.map((transaction, i) => {
                const isType = transaction.transactionObject.type === "expense"
                return (
                  (isType) ?

                    <li key={i}> <i className="fa fa-minus-circle" id={transaction.transactionKey} onClick={this.handleDelete}></i>  {transaction.transactionObject.userInput
                    } {transaction.transactionObject.amount} </li>

                    : null
                )
              })}
            </ul>
            <h4> Total: {finalExpenseTotal} </h4>
          </div>
          <h3> Balance: {finalTotal} </h3>
        </div>
      </div>
    )
  }
}

export default App;
