import React, { Component } from "react";

import Aux from "../../hoc/Auxx/Auxx";
import Burger from "./../../Components/Burger/Burger";
import BuildControls from "../../Components/Burger/BuildControls/BuildControls";
import Modal from './../../Components/UI/Modal/Modal'
import OrderSummary from './../../Components/Burger/OrderSummary/OrderSummary'
import Spinner from './../../Components/UI/Spinner/Spinner'
import withErrorHandler from './../../hoc/withErrorHandler/withErrorHandler'
import axios from '../../axios-orders'

const INGREDIENT_PRICES = {
  salad: 0.5,
  bacon: 1.2,
  cheese: 0.6,
  meat: 0.7
}


class BurgerBuilder extends Component {
  state = {
    ingredients: null,
    totalPrice: 0,
    purchasable: false,
    purchasing: false,
    loading: false,
    error: false
  };

  componentDidMount() {
    console.log(this.props)
    axios.get('/ingredients.json')
      .then(response => {
        this.setState({ ingredients: response.data })
      })
      .catch(error => {
        this.setState({ error: true })
      })
  }

  updatePurchaseState(ingredients) {

    // let sum = 0
    // for(let key in ingredients){
    //   sum += ingredients[key]
    // }

    const sum = Object.keys(ingredients)
      .map(igKey => ingredients[igKey])
      .reduce((sum, el) => sum + el, 0)
    this.setState({ purchasable: sum > 0 })
  }

  addIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type]
    const updatedCount = oldCount + 1
    const updatedIngredients = {
      ...this.state.ingredients
    }
    updatedIngredients[type] = updatedCount
    const priceAddition = INGREDIENT_PRICES[type]
    const oldTotalPrice = this.state.totalPrice
    let updatedTotalPrice = oldTotalPrice + priceAddition
    updatedTotalPrice = Math.abs(updatedTotalPrice.toFixed(2))
    this.setState({
      ingredients: updatedIngredients,
      totalPrice: updatedTotalPrice
    })
    this.updatePurchaseState(updatedIngredients)
  }

  removeIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type]
    if (oldCount <= 0) {
      return
    }
    const updatedCount = oldCount - 1
    const updatedIngredients = {
      ...this.state.ingredients
    }
    updatedIngredients[type] = updatedCount
    const oldTotalPrice = this.state.totalPrice
    const priceDeduction = INGREDIENT_PRICES[type]
    let updatedTotalPrice = oldTotalPrice - priceDeduction
    updatedTotalPrice = Math.abs(updatedTotalPrice.toFixed(2))
    this.setState({
      ingredients: updatedIngredients,
      totalPrice: updatedTotalPrice
    })
    this.updatePurchaseState(updatedIngredients)
  }

  purchaseHandler = () => {
    this.setState({ purchasing: true })
  }

  purchaseCancelHandler = () => {
    this.setState({ purchasing: false })
  }

  purchaseContinueHandler = () => {
    // alert('You Continue!')

    const queryParams = []
    for(let i in this.state.ingredients) {
      queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i])) 
    } 
    queryParams.push('price='+ this.state.totalPrice)
    const queryString = queryParams.join('&')
    this.props.history.push({
      pathname: '/checkout',
      search: '?' + queryString
    })
  }

  render() {
    const disabledInfo = {
      ...this.state.ingredients
    }
    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0
    }

    let orderSummary = null
    let burger = this.state.error ? <p>Ingredients can't be loaded!</p> : <Spinner />

    if (this.state.ingredients) {
      burger = (<>
        <Burger ingredients={this.state.ingredients} />
        <BuildControls
          ingredientAdded={this.addIngredientHandler}
          ingredientRemoved={this.removeIngredientHandler}
          disabled={disabledInfo}
          totalPrice={this.state.totalPrice}
          purchasable={this.state.purchasable}
          ordered={this.purchaseHandler}
        />
      </>)
      orderSummary = <OrderSummary
        ingredients={this.state.ingredients}
        purchaseCanceled={this.purchaseCancelHandler}
        purchaseContinued={this.purchaseContinueHandler}
        price={this.state.totalPrice} />
    }
    if (this.state.loading) {
      orderSummary = <Spinner />
    }

    return (
      <Aux>
        <Modal
          show={this.state.purchasing}
          hide={this.purchaseCancelHandler}>
          {orderSummary}
        </Modal>

        {burger}
      </Aux>
    );
  }
}

export default withErrorHandler(BurgerBuilder, axios);
