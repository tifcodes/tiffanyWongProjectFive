import React, { Component } from 'react';

import dbRef from './firebase'

class Form extends Component {
  constructor() {
    super();
    this.state = {
      description: "",
      amount: "",
      type: "select",
    }
  }

  // listening to firebase
  componentDidMount() {
    dbRef.on("value", (snapshot) => {
      const trans = snapshot.val();

      const newTrans = [];
      const newIncomeArray = [];
      const newExpenseArray = [];

      for (let i in trans) {
        const singleTrans = {
          transKey: i,
          transObject: trans[i],
        }
        newTrans.push(singleTrans)

        if (singleTrans.transObject.type === "income") {
          newIncomeArray.push(singleTrans.transObject.amount)
        }

        if (singleTrans.transObject.type === "expense") {
          newExpenseArray.push(singleTrans.transObject.amount)
        }
      }

      this.setState({
        transList: newTrans,
        incomeArray: newIncomeArray,
        expenseArray: newExpenseArray,
      })
    })
  }

  // changing the income and expense drop down
  handleChangeType = (event) => {
    this.setState({
      type: event.target.value
    })
  }

  // listening to changes in the description
  handleDescription = (event) => {
    this.setState({
      description: event.target.value,
    })
  }

  // listening to changes in the amount
  handleAmountChange = (event) => {
    this.setState({
      amount: event.target.value,
    })
  }

  // submit 
  handleSubmit = (event) => {
    event.preventDefault();

    const transToBeAdded = {
      description: this.state.description,
      amount: this.state.amount,
      type: this.state.type
    }

    if (transToBeAdded.description !== "" && transToBeAdded.amount !== "" && transToBeAdded.type !== "") {
      dbRef.push(transToBeAdded)
      this.setState({
        description: "",
        amount: "",
      })
    }
  }

  handleReset = () => {
    this.setState({
      description: "",
      amount: "",
      type: ""
    })
  }

  render() {
    const { description, amount, type} = this.state
    const isEnabled = description.length > 0 && amount.length > 0
    return (
      <div>
        {/* dropdown menu */}
          <select
            onChange={this.handleChangeType} value={type}>
            <option value="" > select </option>
            <option value="income"> income </option>
            <option value="expense"> expense </option>
          </select>
          {/* form */}
          <form onSubmit={this.handleSubmit}>
            <label htmlFor="transType" className="visuallyHidden"></label>
            <input id="transType" type="text" placeholder="description"
              value={description} onChange={this.handleDescription} />
            <label htmlFor="transAmount" className="visuallyHidden"></label>
            <input id="transAmount" type="number" placeholder="amount" min="0" step=".01"
              value={amount}
              onChange={this.handleAmountChange} />
            <button disabled={!isEnabled} type="submit"> Add Transaction to List</button>
            <button type="button" onClick={this.handleReset} > Reset </button>
          </form>
      </div>
    )
  }
}

export default Form;