import React, { Component } from "react";
import Aux from "../../hoc/Auxios";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import axios from "../../axios-order";
import Spinner from "../../components/UI/Spinner/Spinner";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";

const INGREDIENT_PRICE = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7
};

class BurgerBuilder extends Component {
  state = {
    ingredients: null,
    totalPrice: 0,
    purchaseable: false,
    purchasing: false,
    loading: false,
    error: false
  };

  componentDidMount() {
    axios
      .get("https://react-burger-d192a.firebaseio.com/ingredients.json")
      .then(response => {
        //console.log(response.data);
        this.setState({ ingredients: response.data });
      })
      .catch(err => {
        console.log(err);
        this.setState({ error: true });
      });
  }

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
    //alert("continue!");
    this.setState({ loading: true });
    const order = {
      ingredients: this.state.ingredients,
      price: this.state.totalPrice,
      customer: {
        name: "Tim WU",
        address: {
          street: "Boloerno 1",
          contry: "UK"
        },
        email: "tim@react.com"
      },
      deliveryMethod: "fastest"
    };
    axios
      .post("/orders.json", order)
      .then(response => {
        this.setState({ loading: false, purchasing: false });
      })
      .catch(err => {
        this.setState({ loading: false, purchasing: false });
        console.log(err);
      });
  };

  render() {
    const ingredientStatus = { ...this.state.ingredients };
    for (let key in ingredientStatus) {
      ingredientStatus[key] = ingredientStatus[key] <= 0;
    }

    let orderSummary = null;

    let burger = this.state.error ? (
      <p>Ingredients can't be loaded!</p>
    ) : (
      <Spinner />
    );

    if (this.state.ingredients) {
      burger = (
        <Aux>
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
      orderSummary = (
        <OrderSummary
          purchaseCancelled={this.purchaseCancelHandler}
          purchaseContinued={this.purchaseContinueHandler}
          ingredients={this.state.ingredients}
          price={this.state.totalPrice}
        />
      );
    }
    if (this.state.loading) {
      orderSummary = <Spinner />;
    }

    return (
      <Aux>
        <Modal
          show={this.state.purchasing}
          modalClosed={this.purchaseCancelHandler}
        >
          {orderSummary}
        </Modal>
        {burger}
      </Aux>
    );
  }
}

export default withErrorHandler(BurgerBuilder, axios);
