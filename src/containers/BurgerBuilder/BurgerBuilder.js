import React, { Component } from "react";
import Aux from "../../hoc/Aux";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";

const INGREDIENT_PRICE = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7
};

class BurgerBuilder extends Component {
  state = {
    ingredients: {
      salad: 0,
      bacon: 0,
      cheese: 0,
      meat: 0
    },
    totalPrice: 0,
    purchaseable: false,
    purchasing: false
  };

  addIngredientHandler = type => {
    const newIngredients = { ...this.state.ingredients };
    newIngredients[type]++;
    const newPrice = INGREDIENT_PRICE[type] + this.state.totalPrice;
    this.setState({
      ingredients: newIngredients,
      totalPrice: newPrice
    });
    this.updatePurchaseHandler(newIngredients);
  };

  deleteIngredientHandler = type => {
    const newIngredients = { ...this.state.ingredients };
    if (newIngredients[type] <= 0) {
      return;
    }
    newIngredients[type]--;
    const newPrice = this.state.totalPrice - INGREDIENT_PRICE[type];
    this.setState({
      ingredients: newIngredients,
      totalPrice: newPrice
    });
    this.updatePurchaseHandler(newIngredients);
  };

  updatePurchaseHandler = newIngredients => {
    const sum = Object.keys(newIngredients)
      .map(igkey => {
        return newIngredients[igkey];
      })
      .reduce((total, prePrice) => {
        return total + prePrice;
      }, 0);
    this.setState({ purchaseable: sum > 0 });
  };

  purchaseHandler = () => {
    this.setState({ purchasing: true });
  };

  purchaseCancelHandler = () => {
    this.setState({ purchasing: false });
  };

  purchaseContinueHandler = () => {
    alert("continue!");
  };

  render() {
    const ingredientStatus = { ...this.state.ingredients };
    for (let key in ingredientStatus) {
      ingredientStatus[key] = ingredientStatus[key] <= 0;
    }
    return (
      <Aux>
        <Modal
          show={this.state.purchasing}
          modalClosed={this.purchaseCancelHandler}
        >
          <OrderSummary
            purchaseCancelled={this.purchaseCancelHandler}
            purchaseContinued={this.purchaseContinueHandler}
            ingredients={this.state.ingredients}
            price={this.state.totalPrice}
          />
        </Modal>
        <Burger ingredients={this.state.ingredients} />
        <BuildControls
          ingredientAdd={this.addIngredientHandler}
          ingredientDelete={this.deleteIngredientHandler}
          disabled={ingredientStatus}
          price={this.state.totalPrice}
          purchaseable={this.state.purchaseable}
          ordered={this.purchaseHandler}
        />
      </Aux>
    );
  }
}

export default BurgerBuilder;
